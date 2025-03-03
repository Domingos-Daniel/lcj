import { NextResponse } from 'next/server';
import { updateDatabaseIfChanged } from '@/lib/data-service';

export async function GET() {
  try {
    console.log('🔄 Verificando por atualizações nos posts...');
    
    // Usar a função de atualização inteligente que já detecta mudanças
    const updated = await updateDatabaseIfChanged();
    
    if (updated) {
      return NextResponse.json({
        success: true,
        updated: true,
        message: 'Banco de dados atualizado com novos dados'
      });
    } else {
      return NextResponse.json({
        success: true,
        updated: false,
        message: 'Nenhuma alteração detectada, banco de dados já está atualizado'
      });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar/atualizar posts:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}