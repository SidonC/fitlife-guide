import { NextResponse } from "next/server";

const CLIENT_ID = "1040565079289358";
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

// Armazenamento em memória do token (em produção, use banco de dados)
let tokenCache: {
  access_token: string;
  expires_at: number;
} | null = null;

// Função para gerar token da aplicação
async function generateAppToken(): Promise<string> {
  try {
    // Verificar se há token válido em cache
    if (tokenCache && tokenCache.expires_at > Date.now()) {
      console.log("Usando token em cache");
      return tokenCache.access_token;
    }

    console.log("Gerando novo token da aplicação...");

    if (!CLIENT_SECRET) {
      throw new Error("ML_CLIENT_SECRET não configurado");
    }

    // Gerar token usando Client Credentials Flow
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao gerar token:", response.status, errorText);
      throw new Error(`Erro ao gerar token: ${response.status}`);
    }

    const data = await response.json();

    // Armazenar token em cache (expires_in vem em segundos)
    tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 300) * 1000, // 5 min antes de expirar
    };

    console.log("Token gerado com sucesso");
    return data.access_token;
  } catch (error) {
    console.error("Erro ao gerar token da aplicação:", error);
    throw error;
  }
}

// Endpoint para obter token (uso interno)
export async function GET() {
  try {
    const token = await generateAppToken();
    return NextResponse.json({ access_token: token });
  } catch (error) {
    console.error("Erro na API de token:", error);
    return NextResponse.json(
      { error: "Erro ao obter token" },
      { status: 500 }
    );
  }
}

// Exportar função para uso em outros endpoints
export { generateAppToken };
