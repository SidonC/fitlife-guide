"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Save, Download, MapPin, Clock, Gauge, TrendingUp, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Importação dinâmica do mapa para evitar SSR
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

// Fórmula de Haversine para calcular distância entre dois pontos
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metros
  const toRad = (v: number) => v * Math.PI / 180;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // metros
}

interface TrackPoint {
  lat: number;
  lon: number;
  timestamp: number;
  accuracy: number;
}

interface Activity {
  id: string;
  name: string;
  points: TrackPoint[];
  distance: number; // metros
  duration: number; // segundos
  avgSpeed: number; // km/h
  pace: number; // min/km
  date: string;
}

type TrackingState = "idle" | "tracking" | "paused" | "finished";

export default function ActivityTracker() {
  const [trackingState, setTrackingState] = useState<TrackingState>("idle");
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const [distance, setDistance] = useState(0); // metros
  const [duration, setDuration] = useState(0); // segundos
  const [avgSpeed, setAvgSpeed] = useState(0); // km/h
  const [pace, setPace] = useState(0); // min/km
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parâmetros ajustáveis
  const MIN_ACCURACY_THRESHOLD = 50; // metros
  const MAX_SPEED_JUMP = 50; // m/s (180 km/h) - filtrar saltos extremos

  // Carregar atividades salvas
  useEffect(() => {
    const saved = localStorage.getItem("fitlife_activities");
    if (saved) {
      setSavedActivities(JSON.parse(saved));
    }
  }, []);

  // Timer para atualizar duração
  useEffect(() => {
    if (trackingState === "tracking") {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
        setDuration(elapsed);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [trackingState]);

  // Calcular estatísticas
  const calculateStats = (newDistance: number, newDuration: number) => {
    if (newDuration > 0) {
      const distanceKm = newDistance / 1000;
      const durationHours = newDuration / 3600;
      const speed = distanceKm / durationHours;
      setAvgSpeed(speed);

      if (speed > 0) {
        const paceValue = 60 / speed; // min/km
        setPace(paceValue);
      }
    }
  };

  // Verificar permissão de geolocalização
  const checkGeolocationPermission = async (): Promise<boolean> => {
    try {
      // Verificar se a API de permissões está disponível
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        if (result.state === 'denied') {
          setError(
            "🚫 Permissão de localização bloqueada. Para usar o rastreamento:\n\n" +
            "1. Clique no ícone de cadeado/informações ao lado da URL\n" +
            "2. Encontre 'Localização' ou 'Location'\n" +
            "3. Altere para 'Permitir' ou 'Allow'\n" +
            "4. Recarregue a página e tente novamente"
          );
          return false;
        }
        
        if (result.state === 'prompt') {
          // Permissão será solicitada - tudo ok
          return true;
        }
        
        if (result.state === 'granted') {
          // Já tem permissão - tudo ok
          return true;
        }
      }
      
      // Se API de permissões não disponível, tenta mesmo assim
      return true;
    } catch (err) {
      console.warn("Erro ao verificar permissão:", err);
      // Se falhar, tenta mesmo assim
      return true;
    }
  };

  // Iniciar rastreamento - APENAS APÓS CLIQUE DO USUÁRIO
  const startTracking = async () => {
    setError(null);
    setIsLoadingPosition(true);

    try {
      // 1. Verificar HTTPS
      if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError("⚠️ O rastreamento GPS requer HTTPS. Por favor, acesse o site via HTTPS.");
        setIsLoadingPosition(false);
        return;
      }

      // 2. Verificar suporte a geolocalização
      if (!navigator.geolocation) {
        setError("❌ Geolocalização não é suportada pelo seu navegador.");
        setIsLoadingPosition(false);
        return;
      }

      // 3. Verificar permissão antes de solicitar
      const hasPermission = await checkGeolocationPermission();
      if (!hasPermission) {
        setIsLoadingPosition(false);
        return;
      }

      // 4. Resetar estado
      setPoints([]);
      setDistance(0);
      setDuration(0);
      setAvgSpeed(0);
      setPace(0);
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;

      // 5. Obter posição inicial - SOLICITA PERMISSÃO AQUI
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoadingPosition(false);
          const initialPoint: TrackPoint = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy,
          };
          setPoints([initialPoint]);
          setTrackingState("tracking");

          // Iniciar watchPosition
          watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              const newPoint: TrackPoint = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                timestamp: Date.now(),
                accuracy: pos.coords.accuracy,
              };

              // Filtrar pontos com baixa precisão
              if (newPoint.accuracy > MIN_ACCURACY_THRESHOLD) {
                console.log("Ponto ignorado: baixa precisão", newPoint.accuracy);
                return;
              }

              setPoints((prevPoints) => {
                if (prevPoints.length === 0) return [newPoint];

                const lastPoint = prevPoints[prevPoints.length - 1];
                const distanceIncrement = haversine(
                  lastPoint.lat,
                  lastPoint.lon,
                  newPoint.lat,
                  newPoint.lon
                );

                // Filtrar saltos extremos (velocidade impossível)
                const timeDiff = (newPoint.timestamp - lastPoint.timestamp) / 1000; // segundos
                const speed = distanceIncrement / timeDiff; // m/s
                if (speed > MAX_SPEED_JUMP) {
                  console.log("Ponto ignorado: salto extremo", speed, "m/s");
                  return prevPoints;
                }

                // Atualizar distância total
                const newDistance = distance + distanceIncrement;
                setDistance(newDistance);

                // Calcular estatísticas
                const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
                calculateStats(newDistance, elapsed);

                return [...prevPoints, newPoint];
              });
            },
            (err) => {
              console.error("Erro ao rastrear posição:", err);
              
              // Mensagens de erro específicas
              if (err.code === err.PERMISSION_DENIED) {
                setError(
                  "❌ Você negou a permissão de localização.\n\n" +
                  "Para permitir:\n" +
                  "1. Clique no ícone de cadeado ao lado da URL\n" +
                  "2. Altere 'Localização' para 'Permitir'\n" +
                  "3. Recarregue a página e tente novamente"
                );
              } else if (err.code === err.POSITION_UNAVAILABLE) {
                setError("⚠️ Localização indisponível. Verifique se o GPS está ativado no seu dispositivo.");
              } else if (err.code === err.TIMEOUT) {
                setError("⏱️ Tempo esgotado ao obter localização. Tente novamente.");
              } else {
                setError("❌ Erro ao acessar GPS. Verifique as permissões e tente novamente.");
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        },
        (err) => {
          setIsLoadingPosition(false);
          console.error("Erro ao obter posição inicial:", err);
          
          // Mensagens de erro específicas para permissão inicial
          if (err.code === err.PERMISSION_DENIED) {
            setError(
              "❌ Você negou a permissão de localização.\n\n" +
              "Para usar o rastreamento:\n" +
              "1. Clique no ícone de cadeado/informações ao lado da URL\n" +
              "2. Encontre 'Localização' nas configurações\n" +
              "3. Altere para 'Permitir'\n" +
              "4. Recarregue a página (F5) e clique em 'Iniciar Atividade' novamente"
            );
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setError("⚠️ GPS indisponível. Verifique se o GPS está ativado no seu dispositivo e se você está em um local com boa recepção.");
          } else if (err.code === err.TIMEOUT) {
            setError("⏱️ Tempo esgotado ao obter localização inicial. Verifique sua conexão GPS e tente novamente.");
          } else {
            setError("❌ Erro ao obter localização inicial. Verifique as permissões do navegador e tente novamente.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      setIsLoadingPosition(false);
      console.error("Erro ao iniciar rastreamento:", err);
      setError("❌ Erro inesperado ao iniciar rastreamento. Tente novamente.");
    }
  };

  // Pausar rastreamento
  const pauseTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    pausedTimeRef.current += Date.now() - startTimeRef.current;
    setTrackingState("paused");
  };

  // Retomar rastreamento
  const resumeTracking = () => {
    startTimeRef.current = Date.now();
    setTrackingState("tracking");

    // Reiniciar watchPosition
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint: TrackPoint = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: Date.now(),
          accuracy: pos.coords.accuracy,
        };

        if (newPoint.accuracy > MIN_ACCURACY_THRESHOLD) return;

        setPoints((prevPoints) => {
          if (prevPoints.length === 0) return [newPoint];

          const lastPoint = prevPoints[prevPoints.length - 1];
          const distanceIncrement = haversine(
            lastPoint.lat,
            lastPoint.lon,
            newPoint.lat,
            newPoint.lon
          );

          const timeDiff = (newPoint.timestamp - lastPoint.timestamp) / 1000;
          const speed = distanceIncrement / timeDiff;
          if (speed > MAX_SPEED_JUMP) return prevPoints;

          const newDistance = distance + distanceIncrement;
          setDistance(newDistance);

          const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
          calculateStats(newDistance, elapsed);

          return [...prevPoints, newPoint];
        });
      },
      (err) => {
        console.error("Erro ao rastrear posição:", err);
        if (err.code === err.PERMISSION_DENIED) {
          setError("❌ Permissão de localização negada.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Finalizar rastreamento
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingState("finished");
    setShowSaveModal(true);
  };

  // Salvar atividade
  const saveActivity = () => {
    if (!activityName.trim()) {
      alert("Por favor, dê um nome para a atividade");
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      points,
      distance,
      duration,
      avgSpeed,
      pace,
      date: new Date().toISOString(),
    };

    const updated = [...savedActivities, activity];
    setSavedActivities(updated);
    localStorage.setItem("fitlife_activities", JSON.stringify(updated));

    // Salvar no backend (se disponível)
    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    }).catch((err) => console.error("Erro ao salvar no backend:", err));

    setShowSaveModal(false);
    setActivityName("");
    setTrackingState("idle");
    setPoints([]);
    setDistance(0);
    setDuration(0);
    setAvgSpeed(0);
    setPace(0);
  };

  // Exportar GPX - APENAS APÓS CLIQUE DO USUÁRIO
  const exportGPX = () => {
    try {
      const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="FitLife Guide">
  <trk>
    <name>${activityName || "Atividade"}</name>
    <trkseg>
${points.map(p => `      <trkpt lat="${p.lat}" lon="${p.lon}">
        <time>${new Date(p.timestamp).toISOString()}</time>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>`;

      const blob = new Blob([gpx], { type: "application/gpx+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activityName || "atividade"}.gpx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar GPX:", err);
      alert("Erro ao exportar arquivo GPX");
    }
  };

  // Exportar JSON - APENAS APÓS CLIQUE DO USUÁRIO
  const exportJSON = () => {
    try {
      const data = {
        name: activityName,
        points,
        distance,
        duration,
        avgSpeed,
        pace,
        date: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activityName || "atividade"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar JSON:", err);
      alert("Erro ao exportar arquivo JSON");
    }
  };

  // Formatar tempo HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Visualizar atividade do histórico
  const viewActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowHistory(false);
  };

  // Voltar do histórico
  const backFromHistory = () => {
    setShowHistory(false);
    setSelectedActivity(null);
  };

  // Tela de histórico
  if (showHistory) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Histórico de Atividades</h2>
          <button
            onClick={backFromHistory}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {savedActivities.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Nenhuma atividade registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Distância</p>
                    <p className="text-lg font-bold text-emerald-700">
                      {(activity.distance / 1000).toFixed(2)} km
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">Tempo</p>
                    <p className="text-lg font-bold text-blue-700">
                      {formatTime(activity.duration)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-purple-600 font-medium mb-1">Velocidade Média</p>
                    <p className="text-lg font-bold text-purple-700">
                      {activity.avgSpeed.toFixed(1)} km/h
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-orange-600 font-medium mb-1">Pace</p>
                    <p className="text-lg font-bold text-orange-700">
                      {activity.pace.toFixed(1)} min/km
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => viewActivity(activity)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Ver no Mapa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tela de visualização de atividade
  if (selectedActivity) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedActivity.name}</h2>
            <p className="text-sm text-gray-500">
              {new Date(selectedActivity.date).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <button
            onClick={() => setSelectedActivity(null)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-xs text-emerald-600 font-medium mb-1">Distância</p>
            <p className="text-2xl font-bold text-emerald-700">
              {(selectedActivity.distance / 1000).toFixed(2)} km
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-medium mb-1">Tempo</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatTime(selectedActivity.duration)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs text-purple-600 font-medium mb-1">Velocidade Média</p>
            <p className="text-2xl font-bold text-purple-700">
              {selectedActivity.avgSpeed.toFixed(1)} km/h
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-xs text-orange-600 font-medium mb-1">Pace</p>
            <p className="text-2xl font-bold text-orange-700">
              {selectedActivity.pace.toFixed(1)} min/km
            </p>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <MapComponent points={selectedActivity.points} />
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all"
        >
          Voltar ao Histórico
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rastreamento de Atividade</h2>
          <p className="text-sm text-gray-500">Corrida ou caminhada com GPS</p>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-xl transition-colors"
        >
          Histórico
        </button>
      </div>

      {/* Aviso importante */}
      {trackingState === "idle" && !error && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium mb-2">
                📍 Instruções para rastreamento GPS
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Clique em "Iniciar Atividade" e permita o acesso à localização quando solicitado</li>
                <li>• Mantenha o app aberto durante o rastreamento (navegador não suporta tracking em background)</li>
                <li>• Certifique-se de que o GPS está ativado no dispositivo</li>
                <li>• O site deve estar em HTTPS para funcionar corretamente</li>
                <li>• Se a permissão for negada, você precisará permitir nas configurações do navegador</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoadingPosition && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            <p className="text-sm text-emerald-800 font-medium">
              Obtendo sua localização... Aguarde alguns segundos.
            </p>
          </div>
        </div>
      )}

      {/* Estatísticas em tempo real */}
      {trackingState !== "idle" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-emerald-600 font-medium">Distância</p>
            </div>
            <p className="text-3xl font-bold text-emerald-700">
              {(distance / 1000).toFixed(2)}
            </p>
            <p className="text-xs text-emerald-600 mt-1">km</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">Tempo</p>
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {formatTime(duration)}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-purple-600 font-medium">Velocidade Média</p>
            </div>
            <p className="text-3xl font-bold text-purple-700">
              {avgSpeed.toFixed(1)}
            </p>
            <p className="text-xs text-purple-600 mt-1">km/h</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <p className="text-xs text-orange-600 font-medium">Pace</p>
            </div>
            <p className="text-3xl font-bold text-orange-700">
              {pace > 0 ? pace.toFixed(1) : "0.0"}
            </p>
            <p className="text-xs text-orange-600 mt-1">min/km</p>
          </div>
        </div>
      )}

      {/* Mapa */}
      {points.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <MapComponent points={points} />
        </div>
      )}

      {/* Controles */}
      <div className="space-y-3">
        {trackingState === "idle" && (
          <button
            onClick={startTracking}
            disabled={isLoadingPosition}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {isLoadingPosition ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">Obtendo localização...</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" fill="white" />
                <span className="text-lg">Iniciar Atividade</span>
              </>
            )}
          </button>
        )}

        {trackingState === "tracking" && (
          <>
            <button
              onClick={pauseTracking}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <Pause className="w-6 h-6" fill="white" />
              <span className="text-lg">Pausar</span>
            </button>
            <button
              onClick={stopTracking}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <Square className="w-6 h-6" fill="white" />
              <span className="text-lg">Finalizar</span>
            </button>
          </>
        )}

        {trackingState === "paused" && (
          <>
            <button
              onClick={resumeTracking}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <Play className="w-6 h-6" fill="white" />
              <span className="text-lg">Retomar</span>
            </button>
            <button
              onClick={stopTracking}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <Square className="w-6 h-6" fill="white" />
              <span className="text-lg">Finalizar</span>
            </button>
          </>
        )}
      </div>

      {/* Modal de Salvar */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Salvar Atividade</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Atividade
                </label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Ex: Corrida matinal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 mb-1">Distância</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(distance / 1000).toFixed(2)} km
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 mb-1">Tempo</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(duration)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveActivity}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar
                </button>
                <button
                  onClick={exportGPX}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                  title="Exportar GPX"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={exportJSON}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                  title="Exportar JSON"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setTrackingState("idle");
                }}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
