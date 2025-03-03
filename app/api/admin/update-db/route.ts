import { NextResponse } from 'next/server';
import { updateDatabase, ensureDatabaseExists } from '@/lib/data-service';

export async function GET() {
  try {
    const result = await ensureDatabaseExists();
    
    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: 'Banco de dados verificado e atualizado com sucesso'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Falha ao verificar/atualizar banco de dados' 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro desconhecido' 
    }, { status: 500 });
  }
}