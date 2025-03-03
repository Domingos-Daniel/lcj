import { NextResponse } from 'next/server';
import { ensureDatabaseExists } from '@/lib/data-service';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Force database initialization
    const result = await ensureDatabaseExists();
    
    // Get database path
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    
    // Check if file exists after initialization
    const exists = fs.existsSync(dbPath);
    const stats = exists ? fs.statSync(dbPath) : null;
    const fileSize = stats ? (stats.size / 1024).toFixed(2) + ' KB' : 'N/A';
    
    return NextResponse.json({
      success: result,
      databaseExists: exists,
      databasePath: dbPath,
      fileSize: fileSize,
      message: result 
        ? 'Banco de dados inicializado com sucesso' 
        : 'Falha ao inicializar banco de dados'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}