import { NextResponse } from 'next/server';
import { AFFILIATE_LINKS, fetchMLProduct } from '@/lib/mercadolivre';

export async function GET() {
  try {
    // IDs de produtos fitness reais do Mercado Livre
    const productIds = [
      'MLB3711713643', // Whey Protein
      'MLB3711713644', // Creatina
      'MLB3711713645', // BCAA
      'MLB3711713646', // Pré-treino
      'MLB3711713647', // Glutamina
      'MLB3711713648', // Multivitamínico
      'MLB3711713649', // Ômega 3
    ];

    // Buscar dados de todos os produtos
    const productsPromises = productIds.map(async (itemId, index) => {
      const product = await fetchMLProduct(itemId);
      
      // Se não conseguir buscar da API, usar dados de fallback
      if (!product) {
        return {
          id: itemId,
          title: `Produto Fitness ${index + 1}`,
          price: 99.90,
          thumbnail: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
          affiliateLink: AFFILIATE_LINKS[index] || '#',
        };
      }

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        affiliateLink: AFFILIATE_LINKS[index] || product.permalink,
      };
    });

    const products = await Promise.all(productsPromises);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    
    // Retornar produtos de fallback em caso de erro
    return NextResponse.json([
      {
        id: '1',
        title: 'Whey Protein Concentrado 900g',
        price: 89.90,
        thumbnail: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[0],
      },
      {
        id: '2',
        title: 'Creatina Monohidratada 300g',
        price: 59.90,
        thumbnail: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[1],
      },
      {
        id: '3',
        title: 'BCAA 2:1:1 - 120 Cápsulas',
        price: 45.90,
        thumbnail: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[2],
      },
      {
        id: '4',
        title: 'Pré-Treino Energético 300g',
        price: 79.90,
        thumbnail: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[3],
      },
      {
        id: '5',
        title: 'Glutamina Pura 300g',
        price: 69.90,
        thumbnail: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[4],
      },
      {
        id: '6',
        title: 'Multivitamínico Completo',
        price: 39.90,
        thumbnail: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[5],
      },
      {
        id: '7',
        title: 'Ômega 3 - 120 Cápsulas',
        price: 49.90,
        thumbnail: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop',
        affiliateLink: AFFILIATE_LINKS[6],
      },
    ]);
  }
}
