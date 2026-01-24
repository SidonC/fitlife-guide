import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = "1040565079289358";
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

// Cache do token em memória
let tokenCache: {
  access_token: string;
  expires_at: number;
} | null = null;

// Função para gerar token da aplicação
async function getAppToken(): Promise<string> {
  try {
    // Verificar se há token válido em cache
    if (tokenCache && tokenCache.expires_at > Date.now()) {
      return tokenCache.access_token;
    }

    if (!CLIENT_SECRET) {
      throw new Error("ML_CLIENT_SECRET não configurado");
    }

    // Gerar novo token usando Client Credentials Flow
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

    return data.access_token;
  } catch (error) {
    console.error("Erro ao gerar token da aplicação:", error);
    throw error;
  }
}

// Função para buscar dados do produto usando o item_id
async function fetchProductData(itemId: string) {
  try {
    // Obter token da aplicação
    const accessToken = await getAppToken();

    const response = await fetch(
      `https://api.mercadolibre.com/items/${itemId}`,
      { 
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao buscar produto ${itemId}:`, response.status, errorText);
      throw new Error(`Erro ao buscar produto: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
}

// Função para resolver link de afiliado e obter item_id
async function resolveAffiliateLink(affiliateLink: string): Promise<string | null> {
  try {
    const response = await fetch(affiliateLink, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const finalUrl = response.url;
    
    // Padrão 1: MLB seguido de números (mais comum)
    const mlbMatch = finalUrl.match(/MLB[0-9]+/);
    if (mlbMatch) {
      return mlbMatch[0];
    }

    // Padrão 2: /p/ seguido de código
    const pMatch = finalUrl.match(/\/p\/([A-Z0-9-]+)/);
    if (pMatch) {
      return pMatch[1];
    }

    // Padrão 3: /MLB- seguido de números
    const mlbDashMatch = finalUrl.match(/\/MLB-([0-9]+)/);
    if (mlbDashMatch) {
      return `MLB${mlbDashMatch[1]}`;
    }

    // Padrão 4: Tentar extrair do HTML
    const html = await response.text();
    const htmlMatch = html.match(/"item_id":"(MLB[0-9]+)"/);
    if (htmlMatch) {
      return htmlMatch[1];
    }

    console.error("Nenhum padrão de item_id encontrado na URL:", finalUrl);
    return null;
  } catch (error) {
    console.error("Erro ao resolver link de afiliado:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliateLink } = body;

    if (!affiliateLink) {
      return NextResponse.json(
        { error: "Link de afiliado não fornecido" },
        { status: 400 }
      );
    }

    // Resolver o link de afiliado para obter o item_id
    const itemId = await resolveAffiliateLink(affiliateLink);

    if (!itemId) {
      console.error("Não foi possível extrair o ID do produto do link:", affiliateLink);
      
      // Retornar dados de fallback mapeados
      return NextResponse.json({
        id: `fallback-${Date.now()}`,
        nome: "Produto Fitness Premium",
        preco: 0,
        imagem: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        fallback: true
      });
    }

    // Buscar dados do produto usando token da aplicação
    const productData = await fetchProductData(itemId);

    // Mapear dados da API para interface esperada
    // title → nome, price → preco, thumbnail → imagem
    const mappedData = {
      id: productData.id,
      nome: productData.title,
      preco: productData.price,
      imagem: productData.pictures?.[0]?.url || productData.thumbnail,
      fallback: false
    };

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Erro na API do Mercado Livre:", error);
    
    // Retornar dados de fallback mapeados em caso de erro
    return NextResponse.json({
      id: `fallback-${Date.now()}`,
      nome: "Produto Fitness Premium",
      preco: 0,
      imagem: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      fallback: true
    });
  }
}
