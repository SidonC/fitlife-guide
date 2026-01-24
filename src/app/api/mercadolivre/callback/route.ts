import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/mercadolivre';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Código de autorização não fornecido' },
      { status: 400 }
    );
  }

  // Nota: O client_secret deve ser armazenado em variável de ambiente
  const clientSecret = process.env.ML_CLIENT_SECRET;
  const redirectUri = process.env.ML_REDIRECT_URI || `${request.nextUrl.origin}/api/mercadolivre/callback`;

  if (!clientSecret) {
    return NextResponse.json(
      { error: 'Configuração OAuth incompleta' },
      { status: 500 }
    );
  }

  try {
    const tokens = await exchangeCodeForToken(code, clientSecret, redirectUri);

    if (!tokens) {
      throw new Error('Falha ao obter tokens');
    }

    // Aqui você pode armazenar os tokens de forma segura
    // Por exemplo, em cookies httpOnly ou em um banco de dados
    
    // Redirecionar de volta para a aplicação
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Armazenar access_token em cookie httpOnly (mais seguro)
    response.cookies.set('ml_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 6, // 6 horas
    });

    return response;
  } catch (error) {
    console.error('Erro no callback OAuth:', error);
    return NextResponse.json(
      { error: 'Erro ao processar autenticação' },
      { status: 500 }
    );
  }
}
