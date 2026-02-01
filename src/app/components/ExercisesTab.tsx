"use client";

import PremiumLock from "./PremiumLock";
import { useState, useEffect } from "react";
import { Dumbbell, ChevronRight, Crown, ExternalLink, Heart, Zap, Target, Flame, Users, Activity, ArrowLeft, AlertCircle, CheckCircle2, Play, Calendar, X, Lock, MapPin } from "lucide-react";
import ActivityTracker from "./ActivityTracker";

const muscleGroups = [
  {
    id: "chest",
    name: "Peito",
    icon: Heart,
    exerciseCount: 12,
    isPremium: false,
  },
  {
    id: "back",
    name: "Costas",
    icon: Activity,
    exerciseCount: 15,
    isPremium: false,
  },
  {
    id: "legs",
    name: "Pernas",
    icon: Zap,
    exerciseCount: 18,
    isPremium: true,
  },
  {
    id: "shoulders",
    name: "Ombros",
    icon: Target,
    exerciseCount: 10,
    isPremium: true,
  },
  {
    id: "arms",
    name: "Braços",
    icon: Flame,
    exerciseCount: 14,
    isPremium: true,
  },
  {
    id: "abs",
    name: "Abdômen",
    icon: Users,
    exerciseCount: 8,
    isPremium: false,
  },
];

// Planilhas de treino pré-definidas
const workoutPlans = {
  lose: {
    title: "Planilha para Emagrecer",
    description: "Treino focado em queima de gordura com alta intensidade e volume",
    weeks: [
      {
        day: "Segunda-feira",
        focus: "Peito + Cardio",
        exercises: [
          { name: "Supino Reto", sets: "4x12", rest: "60s" },
          { name: "Supino Inclinado", sets: "3x15", rest: "45s" },
          { name: "Crucifixo", sets: "3x15", rest: "45s" },
          { name: "Flexão de Braço", sets: "3x20", rest: "30s" },
          { name: "Esteira (HIIT)", sets: "20min", rest: "-" },
        ]
      },
      {
        day: "Terça-feira",
        focus: "Costas + Abdômen",
        exercises: [
          { name: "Barra Fixa", sets: "4x10", rest: "60s" },
          { name: "Remada Curvada", sets: "4x12", rest: "60s" },
          { name: "Puxada Alta", sets: "3x15", rest: "45s" },
          { name: "Remada Unilateral", sets: "3x12", rest: "45s" },
          { name: "Abdominal Completo", sets: "4x20", rest: "30s" },
          { name: "Prancha", sets: "3x60s", rest: "30s" },
        ]
      },
      {
        day: "Quarta-feira",
        focus: "Pernas + Cardio",
        exercises: [
          { name: "Agachamento Livre", sets: "4x15", rest: "60s" },
          { name: "Leg Press", sets: "4x20", rest: "60s" },
          { name: "Cadeira Extensora", sets: "3x15", rest: "45s" },
          { name: "Cadeira Flexora", sets: "3x15", rest: "45s" },
          { name: "Panturrilha", sets: "4x20", rest: "30s" },
          { name: "Bike (Moderado)", sets: "25min", rest: "-" },
        ]
      },
      {
        day: "Quinta-feira",
        focus: "Ombros + Abdômen",
        exercises: [
          { name: "Desenvolvimento", sets: "4x12", rest: "60s" },
          { name: "Elevação Lateral", sets: "4x15", rest: "45s" },
          { name: "Elevação Frontal", sets: "3x15", rest: "45s" },
          { name: "Remada Alta", sets: "3x12", rest: "45s" },
          { name: "Abdominal Bicicleta", sets: "4x30", rest: "30s" },
          { name: "Elevação de Pernas", sets: "3x15", rest: "30s" },
        ]
      },
      {
        day: "Sexta-feira",
        focus: "Braços + Cardio",
        exercises: [
          { name: "Rosca Direta", sets: "4x12", rest: "45s" },
          { name: "Rosca Alternada", sets: "3x15", rest: "45s" },
          { name: "Tríceps Testa", sets: "4x12", rest: "45s" },
          { name: "Tríceps Corda", sets: "3x15", rest: "45s" },
          { name: "Rosca Martelo", sets: "3x12", rest: "45s" },
          { name: "Elíptico", sets: "20min", rest: "-" },
        ]
      },
      {
        day: "Sábado",
        focus: "Treino Full Body + HIIT",
        exercises: [
          { name: "Burpees", sets: "4x15", rest: "30s" },
          { name: "Agachamento Jump", sets: "4x20", rest: "30s" },
          { name: "Flexão", sets: "4x15", rest: "30s" },
          { name: "Mountain Climbers", sets: "4x30s", rest: "30s" },
          { name: "Prancha Lateral", sets: "3x45s", rest: "30s" },
        ]
      },
      {
        day: "Domingo",
        focus: "Descanso Ativo",
        exercises: [
          { name: "Caminhada Leve", sets: "30-45min", rest: "-" },
          { name: "Alongamento", sets: "15min", rest: "-" },
        ]
      }
    ]
  },
  gain: {
    title: "Planilha para Ganhar Massa",
    description: "Treino focado em hipertrofia com cargas progressivas",
    weeks: [
      {
        day: "Segunda-feira",
        focus: "Peito + Tríceps",
        exercises: [
          { name: "Supino Reto", sets: "4x8-10", rest: "90s" },
          { name: "Supino Inclinado", sets: "4x8-10", rest: "90s" },
          { name: "Crucifixo Inclinado", sets: "3x10-12", rest: "60s" },
          { name: "Paralelas", sets: "3x8-10", rest: "90s" },
          { name: "Tríceps Testa", sets: "4x10-12", rest: "60s" },
          { name: "Tríceps Corda", sets: "3x12-15", rest: "45s" },
        ]
      },
      {
        day: "Terça-feira",
        focus: "Costas + Bíceps",
        exercises: [
          { name: "Barra Fixa", sets: "4x6-8", rest: "90s" },
          { name: "Remada Curvada", sets: "4x8-10", rest: "90s" },
          { name: "Puxada Alta", sets: "4x10-12", rest: "60s" },
          { name: "Remada Cavalinho", sets: "3x10-12", rest: "60s" },
          { name: "Rosca Direta", sets: "4x10-12", rest: "60s" },
          { name: "Rosca Martelo", sets: "3x12-15", rest: "45s" },
        ]
      },
      {
        day: "Quarta-feira",
        focus: "Pernas Completo",
        exercises: [
          { name: "Agachamento Livre", sets: "5x8-10", rest: "120s" },
          { name: "Leg Press 45°", sets: "4x10-12", rest: "90s" },
          { name: "Cadeira Extensora", sets: "3x12-15", rest: "60s" },
          { name: "Cadeira Flexora", sets: "3x12-15", rest: "60s" },
          { name: "Stiff", sets: "4x10-12", rest: "90s" },
          { name: "Panturrilha em Pé", sets: "4x15-20", rest: "45s" },
        ]
      },
      {
        day: "Quinta-feira",
        focus: "Ombros + Abdômen",
        exercises: [
          { name: "Desenvolvimento Barra", sets: "4x8-10", rest: "90s" },
          { name: "Desenvolvimento Halteres", sets: "4x10-12", rest: "90s" },
          { name: "Elevação Lateral", sets: "4x12-15", rest: "60s" },
          { name: "Elevação Frontal", sets: "3x12-15", rest: "60s" },
          { name: "Remada Alta", sets: "3x10-12", rest: "60s" },
          { name: "Abdominal Completo", sets: "4x15-20", rest: "45s" },
        ]
      },
      {
        day: "Sexta-feira",
        focus: "Peito + Bíceps",
        exercises: [
          { name: "Supino Inclinado", sets: "4x8-10", rest: "90s" },
          { name: "Supino Declinado", sets: "3x10-12", rest: "90s" },
          { name: "Crucifixo Reto", sets: "3x10-12", rest: "60s" },
          { name: "Cross Over", sets: "3x12-15", rest: "60s" },
          { name: "Rosca Alternada", sets: "4x10-12", rest: "60s" },
          { name: "Rosca Scott", sets: "3x12-15", rest: "45s" },
        ]
      },
      {
        day: "Sábado",
        focus: "Costas + Tríceps",
        exercises: [
          { name: "Levantamento Terra", sets: "4x6-8", rest: "120s" },
          { name: "Puxada Triângulo", sets: "4x10-12", rest: "90s" },
          { name: "Remada Unilateral", sets: "3x10-12", rest: "60s" },
          { name: "Pullover", sets: "3x12-15", rest: "60s" },
          { name: "Tríceps Francês", sets: "4x10-12", rest: "60s" },
          { name: "Mergulho", sets: "3x8-10", rest: "90s" },
        ]
      },
      {
        day: "Domingo",
        focus: "Descanso Total",
        exercises: [
          { name: "Descanso", sets: "-", rest: "-" },
          { name: "Alongamento Leve", sets: "10min", rest: "-" },
        ]
      }
    ]
  },
  maintain: {
    title: "Planilha para Manter",
    description: "Treino equilibrado para manutenção da forma física",
    weeks: [
      {
        day: "Segunda-feira",
        focus: "Peito + Tríceps",
        exercises: [
          { name: "Supino Reto", sets: "3x10", rest: "75s" },
          { name: "Supino Inclinado", sets: "3x10", rest: "75s" },
          { name: "Crucifixo", sets: "3x12", rest: "60s" },
          { name: "Tríceps Testa", sets: "3x12", rest: "60s" },
          { name: "Tríceps Corda", sets: "3x12", rest: "60s" },
        ]
      },
      {
        day: "Terça-feira",
        focus: "Costas + Bíceps",
        exercises: [
          { name: "Barra Fixa", sets: "3x8", rest: "75s" },
          { name: "Remada Curvada", sets: "3x10", rest: "75s" },
          { name: "Puxada Alta", sets: "3x12", rest: "60s" },
          { name: "Rosca Direta", sets: "3x12", rest: "60s" },
          { name: "Rosca Martelo", sets: "3x12", rest: "60s" },
        ]
      },
      {
        day: "Quarta-feira",
        focus: "Pernas",
        exercises: [
          { name: "Agachamento Livre", sets: "4x10", rest: "90s" },
          { name: "Leg Press", sets: "3x12", rest: "75s" },
          { name: "Cadeira Extensora", sets: "3x12", rest: "60s" },
          { name: "Cadeira Flexora", sets: "3x12", rest: "60s" },
          { name: "Panturrilha", sets: "3x15", rest: "45s" },
        ]
      },
      {
        day: "Quinta-feira",
        focus: "Ombros + Abdômen",
        exercises: [
          { name: "Desenvolvimento", sets: "3x10", rest: "75s" },
          { name: "Elevação Lateral", sets: "3x12", rest: "60s" },
          { name: "Elevação Frontal", sets: "3x12", rest: "60s" },
          { name: "Abdominal Completo", sets: "3x20", rest: "45s" },
          { name: "Prancha", sets: "3x45s", rest: "45s" },
        ]
      },
      {
        day: "Sexta-feira",
        focus: "Treino Full Body",
        exercises: [
          { name: "Supino", sets: "3x10", rest: "75s" },
          { name: "Remada", sets: "3x10", rest: "75s" },
          { name: "Agachamento", sets: "3x10", rest: "75s" },
          { name: "Desenvolvimento", sets: "3x10", rest: "75s" },
          { name: "Rosca + Tríceps", sets: "3x12", rest: "60s" },
        ]
      },
      {
        day: "Sábado",
        focus: "Cardio + Core",
        exercises: [
          { name: "Corrida Moderada", sets: "30min", rest: "-" },
          { name: "Abdominal", sets: "3x20", rest: "45s" },
          { name: "Prancha", sets: "3x60s", rest: "45s" },
          { name: "Alongamento", sets: "10min", rest: "-" },
        ]
      },
      {
        day: "Domingo",
        focus: "Descanso ou Atividade Leve",
        exercises: [
          { name: "Caminhada", sets: "30min", rest: "-" },
          { name: "Yoga/Alongamento", sets: "20min", rest: "-" },
        ]
      }
    ]
  }
};

// Base de dados de exercícios com vídeos reais do YouTube
const exercisesDatabase: Record<string, Array<{
  id: string;
  name: string;
  muscle: string;
  videoUrl: string;
  description: string;
  steps: string[];
  commonMistakes: string[];
}>> = {
  chest: [
    {
      id: "bench-press",
      name: "Supino Reto",
      muscle: "Peitoral Maior",
      videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
      description: "Exercício fundamental para desenvolvimento do peitoral, trabalha força e massa muscular.",
      steps: [
        "Deite-se no banco com os pés firmes no chão",
        "Segure a barra com pegada um pouco mais larga que os ombros",
        "Desça a barra controladamente até tocar o peito",
        "Empurre a barra de volta à posição inicial"
      ],
      commonMistakes: [
        "Arquear demais as costas",
        "Tirar os pés do chão",
        "Descer a barra muito rápido",
        "Não controlar a descida"
      ]
    },
    {
      id: "incline-press",
      name: "Supino Inclinado",
      muscle: "Peitoral Superior",
      videoUrl: "https://www.youtube.com/embed/SrqOu55lrYU",
      description: "Foca na porção superior do peitoral, essencial para um peito completo e definido.",
      steps: [
        "Ajuste o banco em 30-45 graus de inclinação",
        "Deite-se e posicione os pés firmemente",
        "Segure a barra com pegada média",
        "Desça até a parte superior do peito e empurre"
      ],
      commonMistakes: [
        "Inclinação muito alta (acima de 45°)",
        "Não tocar o peito",
        "Usar carga excessiva",
        "Perder a estabilidade dos ombros"
      ]
    },
    {
      id: "push-ups",
      name: "Flexão de Braço",
      muscle: "Peitoral Geral",
      videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
      description: "Exercício clássico que trabalha peito, ombros e tríceps usando apenas o peso corporal.",
      steps: [
        "Posicione as mãos na largura dos ombros",
        "Mantenha o corpo reto da cabeça aos pés",
        "Desça até o peito quase tocar o chão",
        "Empurre de volta à posição inicial"
      ],
      commonMistakes: [
        "Deixar o quadril cair",
        "Não descer completamente",
        "Abrir muito os cotovelos",
        "Não manter o core ativado"
      ]
    },
    {
      id: "cable-fly",
      name: "Crucifixo no Cross Over",
      muscle: "Peitoral Médio",
      videoUrl: "https://www.youtube.com/embed/taI4XduLpTk",
      description: "Isolamento perfeito para definição e separação do peitoral médio.",
      steps: [
        "Ajuste as polias na altura dos ombros",
        "Segure as alças e dê um passo à frente",
        "Mantenha leve flexão nos cotovelos",
        "Traga as mãos juntas à frente do peito"
      ],
      commonMistakes: [
        "Dobrar muito os cotovelos",
        "Usar impulso do corpo",
        "Não controlar a volta",
        "Posição instável dos pés"
      ]
    }
  ],
  back: [
    {
      id: "pull-up",
      name: "Barra Fixa",
      muscle: "Grande Dorsal",
      videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
      description: "Exercício completo para costas, desenvolve força e largura do dorsal.",
      steps: [
        "Segure a barra com pegada pronada (palmas para frente)",
        "Pendure-se com braços totalmente estendidos",
        "Puxe o corpo até o queixo passar a barra",
        "Desça controladamente até a posição inicial"
      ],
      commonMistakes: [
        "Usar impulso das pernas",
        "Não estender completamente os braços",
        "Balançar o corpo",
        "Não retrair as escápulas"
      ]
    },
    {
      id: "barbell-row",
      name: "Remada Curvada",
      muscle: "Médio das Costas",
      videoUrl: "https://www.youtube.com/embed/FWJR5Ve8bnQ",
      description: "Fundamental para espessura das costas e desenvolvimento do trapézio médio.",
      steps: [
        "Segure a barra com pegada pronada",
        "Incline o tronco a 45 graus",
        "Puxe a barra em direção ao abdômen",
        "Controle a descida da barra"
      ],
      commonMistakes: [
        "Arredondar as costas",
        "Usar muito impulso",
        "Não retrair as escápulas",
        "Levantar muito o tronco"
      ]
    },
    {
      id: "lat-pulldown",
      name: "Puxada na Polia Alta",
      muscle: "Grande Dorsal",
      videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
      description: "Alternativa à barra fixa, excelente para iniciantes e controle de carga.",
      steps: [
        "Sente-se e ajuste o apoio das coxas",
        "Segure a barra com pegada larga",
        "Puxe a barra até a altura do peito",
        "Controle a subida da barra"
      ],
      commonMistakes: [
        "Inclinar demais para trás",
        "Usar impulso do corpo",
        "Não controlar a fase excêntrica",
        "Pegada muito larga ou estreita"
      ]
    }
  ],
  legs: [
    {
      id: "squat",
      name: "Agachamento Livre",
      muscle: "Quadríceps e Glúteos",
      videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
      description: "Rei dos exercícios para pernas, trabalha todo o corpo e libera hormônios anabólicos.",
      steps: [
        "Posicione a barra nas costas (trapézio)",
        "Pés na largura dos ombros",
        "Desça até as coxas ficarem paralelas ao chão",
        "Empurre pelos calcanhares para subir"
      ],
      commonMistakes: [
        "Joelhos ultrapassarem muito os pés",
        "Arredondar as costas",
        "Não descer o suficiente",
        "Levantar os calcanhares"
      ]
    },
    {
      id: "leg-press",
      name: "Leg Press 45°",
      muscle: "Quadríceps",
      videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ",
      description: "Exercício seguro e eficaz para ganho de massa nas pernas com carga controlada.",
      steps: [
        "Sente-se e posicione os pés na plataforma",
        "Destrave a máquina",
        "Desça controladamente até 90 graus",
        "Empurre a plataforma de volta"
      ],
      commonMistakes: [
        "Descer demais (quadril sai do banco)",
        "Travar os joelhos no topo",
        "Pés muito juntos ou separados",
        "Não controlar a descida"
      ]
    }
  ],
  shoulders: [
    {
      id: "overhead-press",
      name: "Desenvolvimento com Barra",
      muscle: "Deltóide Anterior",
      videoUrl: "https://www.youtube.com/embed/QSxDJfJzGEw",
      description: "Exercício composto essencial para ombros fortes e definidos.",
      steps: [
        "Segure a barra na altura dos ombros",
        "Pés na largura dos ombros",
        "Empurre a barra acima da cabeça",
        "Desça controladamente até os ombros"
      ],
      commonMistakes: [
        "Arquear demais as costas",
        "Não estender completamente os braços",
        "Usar impulso das pernas",
        "Barra muito à frente ou atrás"
      ]
    },
    {
      id: "lateral-raise",
      name: "Elevação Lateral",
      muscle: "Deltóide Médio",
      videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo",
      description: "Isolamento perfeito para largura dos ombros e definição lateral.",
      steps: [
        "Segure os halteres ao lado do corpo",
        "Mantenha leve flexão nos cotovelos",
        "Eleve os braços até a altura dos ombros",
        "Desça controladamente"
      ],
      commonMistakes: [
        "Elevar acima dos ombros",
        "Usar impulso do corpo",
        "Cotovelos muito flexionados",
        "Não controlar a descida"
      ]
    }
  ],
  arms: [
    {
      id: "barbell-curl",
      name: "Rosca Direta",
      muscle: "Bíceps",
      videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
      description: "Clássico para bíceps, fundamental para volume e força dos braços.",
      steps: [
        "Segure a barra com pegada supinada",
        "Mantenha os cotovelos fixos ao lado do corpo",
        "Flexione os cotovelos levando a barra ao peito",
        "Desça controladamente"
      ],
      commonMistakes: [
        "Balançar o corpo",
        "Mover os cotovelos para frente",
        "Não estender completamente",
        "Usar carga excessiva"
      ]
    },
    {
      id: "tricep-dips",
      name: "Mergulho em Paralelas",
      muscle: "Tríceps",
      videoUrl: "https://www.youtube.com/embed/6kALZikXxLc",
      description: "Exercício composto poderoso para tríceps, peito e ombros.",
      steps: [
        "Apoie-se nas barras paralelas",
        "Desça flexionando os cotovelos",
        "Desça até os cotovelos ficarem a 90 graus",
        "Empurre de volta à posição inicial"
      ],
      commonMistakes: [
        "Descer demais",
        "Inclinar muito para frente",
        "Não controlar a descida",
        "Travar os cotovelos no topo"
      ]
    }
  ],
  abs: [
    {
      id: "crunches",
      name: "Abdominal Tradicional",
      muscle: "Reto Abdominal",
      videoUrl: "https://www.youtube.com/embed/Xyd_fa5zoEU",
      description: "Exercício básico e eficaz para fortalecimento do abdômen.",
      steps: [
        "Deite-se de costas com joelhos flexionados",
        "Mãos atrás da cabeça ou cruzadas no peito",
        "Eleve o tronco contraindo o abdômen",
        "Desça controladamente"
      ],
      commonMistakes: [
        "Puxar o pescoço com as mãos",
        "Usar impulso",
        "Não contrair o abdômen",
        "Subir demais (usar flexores do quadril)"
      ]
    },
    {
      id: "plank",
      name: "Prancha Isométrica",
      muscle: "Core Completo",
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      description: "Exercício isométrico completo para estabilidade e força do core.",
      steps: [
        "Apoie-se nos antebraços e pontas dos pés",
        "Mantenha o corpo reto da cabeça aos pés",
        "Contraia o abdômen e glúteos",
        "Mantenha a posição pelo tempo determinado"
      ],
      commonMistakes: [
        "Deixar o quadril cair",
        "Elevar demais o quadril",
        "Não manter o core ativado",
        "Prender a respiração"
      ]
    }
  ]
};

type ViewMode = "groups" | "exercises" | "workoutPlan" | "goalSelection" | "activity";

export default function ProgressTab() {

const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
  const paid = localStorage.getItem("fitlife_paid") === "true";
  setIsPremium(paid);
}, []);

  const [isPremium, setIsPremium] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("groups");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<keyof typeof workoutPlans | null>(null);

  const handleActivatePremium = () => {
    const hotmartCheckoutUrl = "https://pay.hotmart.com/N103969250R?off=mekmrjz9&hotfeature=51&_hi=eyJjaWQiOiIxNzY4ODcxNjc1NjU1Mzc5NDI1MTExMTk1Nzk0NTAwIiwiYmlkIjoiMTc2ODg3MTY3NTY1NTM3OTQyNTExMTE5NTc5NDUwMCIsInNpZCI6Ijc4NDcyZGZiNDA2YzRiNmI5N2YzMDVmNzIyZDVjMWQ1In0=.1768875453706&bid=1768875456019";
    window.open(hotmartCheckoutUrl, "_blank");
  };

  const handleGroupClick = (group: typeof muscleGroups[0]) => {
    if (group.isPremium && !isPremium) {
      handleActivatePremium();
    } else {
      setSelectedGroup(group.id);
      setViewMode("exercises");
    }
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setViewMode("groups");
  };

  const handleOpenWorkoutPlan = () => {
    // Verificar se é Premium antes de abrir planilha
    if (!isPremium) {
      handleActivatePremium();
      return;
    }
    setViewMode("goalSelection");
  };

  const handleGoalSelect = (goal: keyof typeof workoutPlans) => {
    setSelectedGoal(goal);
    setViewMode("workoutPlan");
  };

  const handleBackFromGoalSelection = () => {
    setViewMode("groups");
  };

  const handleBackFromWorkoutPlan = () => {
    setSelectedGoal(null);
    setViewMode("goalSelection");
  };

  const handleActivityClick = () => {
    if (!isPremium) {
      // Não é Premium - não faz nada, mostra tela de bloqueio
      setViewMode("activity");
    } else {
      // É Premium - abre normalmente
      setViewMode("activity");
    }
  };

  // Tela de rastreamento de atividade (com bloqueio para não-Premium)
  if (viewMode === "activity") {
    // Se NÃO for Premium, mostrar tela de bloqueio
    if (!isPremium) {
      return (
        <div className="space-y-6 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setViewMode("groups")}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-emerald-600" strokeWidth={2} />
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                Rastreamento de Atividade
              </h2>
            </div>
          </div>

          {/* Tela de Bloqueio Premium */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full p-8 mb-6 shadow-lg">
              <Lock className="w-20 h-20 text-yellow-600" strokeWidth={1.5} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Recurso Premium
            </h2>

            <p className="text-base text-gray-600 mb-8 max-w-md leading-relaxed">
              O rastreamento por GPS é exclusivo para assinantes Premium. Desbloqueie agora e acompanhe suas corridas e caminhadas com precisão!
            </p>

            <button
              onClick={handleActivatePremium}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
            >
              <Crown className="w-6 h-6" strokeWidth={2} />
              <span className="text-lg">Ativar Premium</span>
              <ExternalLink className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 max-w-md">
              <p className="text-sm text-gray-700">
                <strong>Com Premium você terá:</strong>
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Rastreamento GPS em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Estatísticas detalhadas (distância, pace, velocidade)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Histórico completo de atividades
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Exportação de dados (GPX/JSON)
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Se for Premium, mostrar ActivityTracker normalmente
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setViewMode("groups")}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Rastreamento de Atividade
            </h2>
          </div>
        </div>
        <ActivityTracker />
      </div>
    );
  }

  // Tela de seleção de objetivo
  if (viewMode === "goalSelection") {
    return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBackFromGoalSelection}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Escolha seu Objetivo
            </h2>
    <PremiumLock isPremium={isPremium}>
            <p className="text-sm text-gray-500">
              Selecione para ver a planilha de treinos
            </p>
      </PremiumLock>
          </div>
        </div>
        {/* Cards de Objetivos */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => handleGoalSelect("lose")}
            className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Flame className="w-8 h-8" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">Emagrecer</h3>
                <p className="text-red-50 text-sm">
                  Treino focado em queima de gordura
                </p>
              </div>
              <ChevronRight className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-sm text-white/90">
                ✓ Alta intensidade • ✓ Cardio intenso • ✓ Volume elevado
              </p>
            </div>
          </button>

          <button
            onClick={() => handleGoalSelect("gain")}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Zap className="w-8 h-8" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">Ganhar Massa</h3>
                <p className="text-blue-50 text-sm">
                  Treino focado em hipertrofia muscular
                </p>
              </div>
              <ChevronRight className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-sm text-white/90">
                ✓ Cargas progressivas • ✓ Descanso adequado • ✓ Foco em força
              </p>
            </div>
          </button>

          <button
            onClick={() => handleGoalSelect("maintain")}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Target className="w-8 h-8" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">Manter</h3>
                <p className="text-emerald-50 text-sm">
                  Treino equilibrado para manutenção
                </p>
              </div>
              <ChevronRight className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-sm text-white/90">
                ✓ Treino balanceado • ✓ Intensidade moderada • ✓ Sustentável
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Tela de planilha de treino
  if (viewMode === "workoutPlan" && selectedGoal) {
    const plan = workoutPlans[selectedGoal];

    return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBackFromWorkoutPlan}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {plan.title}
            </h2>
            <p className="text-sm text-gray-500">
              {plan.description}
            </p>
          </div>
        </div>

        {/* Planilha Semanal */}
        <div className="space-y-4">
          {plan.weeks.map((day, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Cabeçalho do Dia */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Calendar className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{day.day}</h3>
                    <p className="text-emerald-50 text-sm">{day.focus}</p>
                  </div>
                </div>
              </div>

              {/* Lista de Exercícios */}
              <div className="p-4">
                <div className="space-y-3">
                  {day.exercises.map((exercise, exIndex) => (
                    <div
                      key={exIndex}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {exIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {exercise.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {exercise.sets}
                          {exercise.rest !== "-" && ` • Descanso: ${exercise.rest}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Voltar */}
        <button
          onClick={handleBackFromWorkoutPlan}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar aos Objetivos
        </button>
      </div>
    );
  }

  // Tela de exercícios detalhados
  if (viewMode === "exercises" && selectedGroup) {
    const group = muscleGroups.find(g => g.id === selectedGroup);
    const exercises = exercisesDatabase[selectedGroup] || [];

    return (
      <div className="space-y-6 pb-8">
        {/* Header com Botão Voltar */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBackToGroups}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Exercícios de {group?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {exercises.length} exercícios disponíveis
            </p>
          </div>
        </div>

        {/* Lista de Exercícios */}
        <div className="space-y-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Título do Exercício (acima do vídeo) */}
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {exercise.name}
                </h3>
                <p className="text-sm text-emerald-600 font-medium">
                  🎯 {exercise.muscle}
                </p>
              </div>

              {/* Player de Vídeo Compacto */}
              <div className="flex justify-center p-5 bg-gray-50">
                <div className="w-full max-w-2xl lg:max-w-[70%]">
                  <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg" style={{ maxHeight: '260px' }}>
                    <iframe
                      src={exercise.videoUrl}
                      title={exercise.name}
                      className="w-full aspect-video"
                      style={{ maxHeight: '260px' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>

              {/* Descrição Curta (abaixo do vídeo) */}
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 text-center">
                  {exercise.description}
                </p>
              </div>

              {/* Botão Iniciar Exercício */}
              <div className="px-5 pb-5">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
                  <Play className="w-5 h-5" fill="white" />
                  Iniciar Exercício
                </button>
              </div>

              {/* Passo a Passo */}
              <div className="p-5 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                  <h4 className="font-bold text-gray-900">Como Executar</h4>
                </div>
                <ol className="space-y-2">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Erros Comuns */}
              <div className="p-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2} />
                  <h4 className="font-bold text-gray-900">Erros Comuns</h4>
                </div>
                <ul className="space-y-2">
                  {exercise.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex gap-3 text-sm text-gray-700">
                      <span className="text-red-500 flex-shrink-0">❌</span>
                      <span className="flex-1">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Voltar (fixo no final) */}
        <button
          onClick={handleBackToGroups}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar aos Grupos Musculares
        </button>
      </div>
    );
  }

  // Tela inicial com grupos musculares
  return (
    <div className="space-y-6 pb-8">
      {/* Botão Iniciar Atividade com Badge Premium */}
      <button
        onClick={handleActivityClick}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg relative overflow-hidden group"
      >
        {!isPremium && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-[1px]" />
        )}
        <MapPin className="w-6 h-6 relative z-10" strokeWidth={2} />
        <span className="text-lg relative z-10">Iniciar Atividade (Corrida/Caminhada)</span>
        {!isPremium && <Crown className="w-5 h-5 text-yellow-300 relative z-10" strokeWidth={2} />}
        <ChevronRight className="w-5 h-5 relative z-10" strokeWidth={2} />
      </button>

      {/* Aviso Premium para Atividade */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-gray-800">
              <strong>Rastreamento Premium:</strong> O rastreamento por GPS é exclusivo para assinantes Premium.
            </p>
          </div>
        </div>
      )}

      {/* Botão Acessar Planilha de Treinos com Bloqueio Premium */}
      <button
        onClick={handleOpenWorkoutPlan}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg relative overflow-hidden group"
      >
        {!isPremium && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-[1px]" />
        )}
        <Calendar className="w-6 h-6 relative z-10" strokeWidth={2} />
        <span className="text-lg relative z-10">Acessar Planilha de Treinos</span>
        {!isPremium && <Crown className="w-5 h-5 text-yellow-300 relative z-10" strokeWidth={2} />}
        <ChevronRight className="w-5 h-5 relative z-10" strokeWidth={2} />
      </button>

      {/* Aviso Premium para Planilha */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-gray-800">
              <strong>Planilha Premium:</strong> Acesso exclusivo para assinantes Premium com treinos completos da semana.
            </p>
          </div>
        </div>
      )}

      {/* Header Clean */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-50 rounded-xl">
          <Dumbbell className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Biblioteca de Exercícios
          </h2>
          <p className="text-sm text-gray-500">
            Escolha o grupo muscular para treinar
          </p>
        </div>
      </div>

      {/* Cards de Grupos Musculares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {muscleGroups.map((group) => {
          const IconComponent = group.icon;
          const isLocked = group.isPremium && !isPremium;

          return (
            <button
              key={group.id}
              onClick={() => handleGroupClick(group)}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 text-left relative overflow-hidden group"
            >
              {/* Badge Premium */}
              {group.isPremium && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold border border-yellow-200">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Ícone */}
                <div className={`p-3 rounded-xl transition-all ${
                  isLocked 
                    ? "bg-gray-100" 
                    : "bg-emerald-50 group-hover:bg-emerald-100"
                }`}>
                  <IconComponent 
                    className={`w-7 h-7 ${
                      isLocked ? "text-gray-400" : "text-emerald-600"
                    }`} 
                    strokeWidth={1.5}
                  />
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${
                    isLocked ? "text-gray-500" : "text-gray-900"
                  }`}>
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {group.exerciseCount} exercícios
                  </p>
                </div>

                {/* Seta */}
                <ChevronRight 
                  className={`w-5 h-5 transition-all ${
                    isLocked 
                      ? "text-gray-300" 
                      : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1"
                  }`} 
                  strokeWidth={2}
                />
              </div>

              {/* Overlay de bloqueio */}
              {isLocked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Ativar Premium
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA Premium (se não for premium) */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Crown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">
                Desbloqueie Todos os Exercícios
              </h3>
              <p className="text-emerald-50 text-sm leading-relaxed">
                Tenha acesso completo a mais de 70 exercícios profissionais com demonstrações detalhadas para todos os grupos musculares.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleActivatePremium}
            className="w-full bg-white text-emerald-600 hover:bg-gray-50 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <Crown className="w-5 h-5" />
            Ativar Premium Agora
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <p className="text-sm text-emerald-900 text-center font-medium">
          💪 <span className="font-bold">Dica:</span> Combine exercícios de diferentes grupos musculares para treinos completos e eficientes
        </p>
      </div>
    </div>
  );
}
