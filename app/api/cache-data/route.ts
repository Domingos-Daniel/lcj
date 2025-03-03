import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Esta API salva dados em arquivos JSON no servidor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, data } = body
    
    if (!key || !data) {
      return NextResponse.json(
        { error: 'Key e data são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Validar key para evitar path traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return NextResponse.json(
        { error: 'Key inválida' },
        { status: 400 }
      )
    }
    
    // Criar diretório de dados se não existir
    const dataDir = path.join(process.cwd(), 'data')
    await fs.mkdir(dataDir, { recursive: true })
    
    // Salvar dados em um arquivo JSON
    const filePath = path.join(dataDir, `${key}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar cache:', error)
    return NextResponse.json(
      { error: 'Falha ao salvar dados' },
      { status: 500 }
    )
  }
}