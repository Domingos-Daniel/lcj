import { NextResponse } from 'next/server';
import { updateDatabaseIfChanged } from '@/lib/data-service';

export async function GET() {
  try {
    // Forçar uma verificação de atualização imediata
    console.log('🚀 Iniciando verificação e atualização do banco de dados...');
    const result = await updateDatabaseIfChanged();
    
    return NextResponse.json({
      success: true,
      updated: result,
      message: result 
        ? 'Banco de dados atualizado com novos dados' 
        : 'Banco de dados já estava atualizado, nenhuma alteração necessária'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}