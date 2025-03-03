const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'data', 'carousel-posts.json');
const destDir = path.join(__dirname, '..', 'public', 'data');
const destPath = path.join(destDir, 'carousel-posts.json');

// Criar diretório se não existir
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('✅ Diretório criado:', destDir);
}

try {
  // Copiar arquivo
  fs.copyFileSync(srcPath, destPath);
  console.log('✅ Arquivo copiado com sucesso para:', destPath);
} catch (error) {
  console.error('❌ Erro ao copiar arquivo:', error);
  process.exit(1);
}