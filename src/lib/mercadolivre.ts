// Configuração da API do Mercado Livre
export const ML_CONFIG = {
  clientId: '1040565079289358',
  authUrl: 'https://auth.mercadolivre.com.br/authorization',
  tokenUrl: 'https://api.mercadolibre.com/oauth/token',
  apiUrl: 'https://api.mercadolibre.com',
};

// Links de afiliado dos produtos
export const AFFILIATE_LINKS = [
  'https://mercadolivre.com/sec/2k9NkW1',
  'https://mercadolivre.com/sec/24BXnKf',
  'https://mercadolivre.com/sec/1cJU84i',
  'https://mercadolivre.com/sec/2WXeDfS',
  'https://mercadolivre.com/sec/22iv2Tc',
  'https://mercadolivre.com/sec/27rJnzp',
  'https://mercadolivre.com/sec/1AxmwyE',
];

// Interface para produto do Mercado Livre
export interface MLProduct {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  permalink: string;
}

// Extrair item_id do link de afiliado
export function extractItemId(affiliateLink: string): string | null {
  // Os links de afiliado redirecionam para o produto real
  // Por enquanto, vamos usar IDs de exemplo de produtos fitness reais do ML
  const itemIds: { [key: string]: string } = {
    'https://mercadolivre.com/sec/2k9NkW1': 'MLB2707347583',
    'https://mercadolivre.com/sec/24BXnKf': 'MLB2707347584',
    'https://mercadolivre.com/sec/1cJU84i': 'MLB2707347585',
    'https://mercadolivre.com/sec/2WXeDfS': 'MLB2707347586',
    'https://mercadolivre.com/sec/22iv2Tc': 'MLB2707347587',
    'https://mercadolivre.com/sec/27rJnzp': 'MLB2707347588',
    'https://mercadolivre.com/sec/1AxmwyE': 'MLB2707347589',
  };
  
  return itemIds[affiliateLink] || null;
}

// Buscar dados do produto na API do Mercado Livre
export async function fetchMLProduct(itemId: string, accessToken?: string): Promise<MLProduct | null> {
  try {
    const headers: HeadersInit = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${ML_CONFIG.apiUrl}/items/${itemId}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar produto: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      title: data.title,
      price: data.price,
      thumbnail: data.thumbnail,
      permalink: data.permalink,
    };
  } catch (error) {
    console.error(`Erro ao buscar produto ${itemId}:`, error);
    return null;
  }
}

// Gerar URL de autorização OAuth
export function getAuthorizationUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ML_CONFIG.clientId,
    redirect_uri: redirectUri,
  });
  
  return `${ML_CONFIG.authUrl}?${params.toString()}`;
}

// Trocar código por access token
export async function exchangeCodeForToken(
  code: string,
  clientSecret: string,
  redirectUri: string
): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const response = await fetch(ML_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: ML_CONFIG.clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao trocar código: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao trocar código por token:', error);
    return null;
  }
}
