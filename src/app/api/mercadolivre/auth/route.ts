import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/mercadolivre';

export async function GET(request: NextRequest) {
  // URL de redirecionamento após autorização
  const redirectUri = process.env.ML_REDIRECT_URI || `${request.nextUrl.origin}/api/mercadolivre/callback`;
  
  // Gerar URL de autorização
  const authUrl = getAuthorizationUrl(redirectUri);
  
  // Redirecionar usuário para página de autorização do Mercado Livre
  return NextResponse.redirect(authUrl);
}
