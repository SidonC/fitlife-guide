import { NextRequest, NextResponse } from "next/server";

// Access token fixo (configure no .env.local)
const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN || "APP_USR-1040565079289358-123456-abcdef123456";

// Lista de links de afiliado
const AFFILIATE_LINKS = [
  "https://mercadolivre.com/sec/2k9NkW1",
  "https://mercadolivre.com/sec/24BXnKf",
  "https://mercadolivre.com/sec/1cJU84i",
  "https://mercadolivre.com/sec/2WXeDfS",
  "https://mercadolivre.com/sec/22iv2Tc",
  "https://mercadolivre.com/sec/27rJnzp",
  "https://mercadolivre.com/sec/1AxmwyE",
];

// Função para buscar dados do produto usando o item_id
async function fetchProductData(itemId: string) {
  try {
    const response = await fetch(
      `https://api.mercadolibre.com/items/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Erro ao buscar produto ${itemId}:`,
        response.status,
        errorText
      );
      throw new Error(`Erro ao buscar produto: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
}

// Função para resolver link de afiliado e obter item_id
async function resolveAffiliateLink(
  affiliateLink: string
): Promise<string | null> {
  try {
    const response = await fetch(affiliateLink, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
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

// Função para processar um único produto
async function processProduct(affiliateLink: string, index: number) {
  try {
    // Resolver o link de afiliado para obter o item_id
    const itemId = await resolveAffiliateLink(affiliateLink);

    if (!itemId) {
      console.error(
        `Não foi possível extrair o ID do produto do link ${index}:`,
        affiliateLink
      );

      // Retornar dados de fallback
      return {
        id: `fallback-${index}`,
        nome: "Produto Fitness Premium",
        preco: 0,
        imagem:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        link: affiliateLink,
        fallback: true,
      };
    }

    // Buscar dados do produto usando token fixo
    const productData = await fetchProductData(itemId);

    // Mapear dados da API para interface esperada
    return {
      id: productData.id,
      nome: productData.title,
      preco: productData.price,
      imagem: productData.pictures?.[0]?.url || productData.thumbnail,
      link: affiliateLink,
      fallback: false,
    };
  } catch (error) {
    console.error(`Erro ao processar produto ${index}:`, error);

    // Retornar dados de fallback em caso de erro
    return {
      id: `fallback-${index}`,
      nome: "Produto Fitness Premium",
      preco: 0,
      imagem:
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      link: affiliateLink,
      fallback: true,
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Garantir que a requisição é HTTPS em produção
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    if (process.env.NODE_ENV === "production" && protocol !== "https") {
      return NextResponse.json(
        { error: "HTTPS obrigatório em produção" },
        { status: 403 }
      );
    }

    // Processar todos os produtos em paralelo
    const productsPromises = AFFILIATE_LINKS.map((link, index) =>
      processProduct(link, index)
    );

    const products = await Promise.all(productsPromises);

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Erro ao buscar ofertas:", error);

    // Retornar produtos de fallback em caso de erro geral
    const fallbackProducts = AFFILIATE_LINKS.map((link, index) => ({
      id: `fallback-${index}`,
      nome: "Produto Fitness Premium",
      preco: 0,
      imagem:
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      link,
      fallback: true,
    }));

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar ofertas",
        products: fallbackProducts,
        total: fallbackProducts.length,
      },
      { status: 500 }
    );
  }
}
