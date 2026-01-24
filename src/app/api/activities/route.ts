import { NextRequest, NextResponse } from "next/server";

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
  distance: number;
  duration: number;
  avgSpeed: number;
  pace: number;
  date: string;
}

// Simulação de banco de dados (em produção, usar Supabase ou outro DB)
const activities: Activity[] = [];

export async function POST(request: NextRequest) {
  try {
    const activity: Activity = await request.json();

    // Validação básica
    if (!activity.name || !activity.points || activity.points.length === 0) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Salvar atividade (em produção, salvar no banco de dados)
    activities.push(activity);

    return NextResponse.json(
      { success: true, activity },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar atividade:", error);
    return NextResponse.json(
      { error: "Erro ao salvar atividade" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retornar todas as atividades (em produção, filtrar por usuário autenticado)
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return NextResponse.json(
      { error: "Erro ao buscar atividades" },
      { status: 500 }
    );
  }
}
