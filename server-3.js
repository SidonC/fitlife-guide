const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Access token fixo do Mercado Livre
const ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN || 'APP_USR-1040565079289358-123456-abcdef123456';

// Lista de IDs dos produtos (extraídos dos links de afiliado)
const PRODUCT_IDS = [
  'MLB1234567890', // Substitua pelos IDs reais dos produtos
  'MLB0987654321',
  'MLB1122334455',
  'MLB5544332211',
  'MLB9988776655',
  'MLB6677889900',
  'MLB3344556677',
];

// Links de afiliado correspondentes
const AFFILIATE_LINKS = [
  'https://mercadolivre.com/sec/2k9NkW1',
  'https://mercadolivre.com/sec/24BXnKf',
  'https://mercadolivre.com/sec/1cJU84i',
  'https://mercadolivre.com/sec/2WXeDfS',
  'https://mercadolivre.com/sec/22iv2Tc',
  'https://mercadolivre.com/sec/27rJnzp',
  'https://mercadolivre.com/sec/1AxmwyE',
];

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET'],
  credentials: true
}));

// Middleware para forçar HTTPS em produção
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.status(403).json({ error: 'HTTPS obrigatório em produção' });
  }
  next();
});

// Função para buscar dados de um produto no Mercado Livre
async function fetchProductData(itemId) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao buscar produto ${itemId}:`, response.status, errorText);
      throw new Error(`Erro ao buscar produto: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar produto ${itemId}:`, error.message);
    throw error;
  }
}

// Endpoint GET /api/ofertas
app.get('/api/ofertas', async (req, res) => {
  try {
    console.log('📦 Buscando ofertas do Mercado Livre...');

    // Buscar dados de todos os produtos em paralelo
    const productPromises = PRODUCT_IDS.map(async (itemId, index) => {
      try {
        const productData = await fetchProductData(itemId);

        // Mapear dados da API para o formato esperado
        return {
          id: productData.id,
          nome: productData.title,
          preco: productData.price,
          imagem: productData.pictures?.[0]?.url || productData.thumbnail,
          link: AFFILIATE_LINKS[index] || productData.permalink
        };
      } catch (error) {
        console.error(`Erro ao processar produto ${itemId}:`, error.message);
        
        // Retornar produto de fallback em caso de erro
        return {
          id: `fallback-${index}`,
          nome: 'Produto Fitness Premium',
          preco: 0,
          imagem: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
          link: AFFILIATE_LINKS[index] || '#',
          fallback: true
        };
      }
    });

    const products = await Promise.all(productPromises);

    console.log(`✅ ${products.length} produtos processados com sucesso`);

    res.json({
      success: true,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('❌ Erro ao buscar ofertas:', error.message);

    // Retornar produtos de fallback em caso de erro geral
    const fallbackProducts = AFFILIATE_LINKS.map((link, index) => ({
      id: `fallback-${index}`,
      nome: 'Produto Fitness Premium',
      preco: 0,
      imagem: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
      link,
      fallback: true
    }));

    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ofertas',
      products: fallbackProducts,
      total: fallbackProducts.length
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoint disponível: http://localhost:${PORT}/api/ofertas`);
  console.log(`🔒 HTTPS: ${process.env.NODE_ENV === 'production' ? 'Obrigatório' : 'Opcional'}`);
});
