import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get database path
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    
    // Check file existence and status
    const exists = fs.existsSync(dbPath);
    let fileContent = null;
    let isValidJson = false;
    let fileStats = null;
    let jsonParsed = null;
    
    if (exists) {
      fileStats = fs.statSync(dbPath);
      try {
        fileContent = fs.readFileSync(dbPath, 'utf8');
        jsonParsed = JSON.parse(fileContent);
        isValidJson = true;
      } catch (e) {
        // Content exists but isn't valid JSON
      }
    }

    // Check permissions
    let permissions = null;
    try {
      permissions = fs.accessSync(path.dirname(dbPath), fs.constants.R_OK | fs.constants.W_OK);
      permissions = "Read/Write access OK";
    } catch (e) {
      permissions = `Permission error: ${e.message}`;
    }

    // Return detailed information
    return NextResponse.json({
      path: {
        dbPath,
        absolute: path.resolve(dbPath),
        directory: path.dirname(dbPath),
        directoryExists: fs.existsSync(path.dirname(dbPath))
      },
      file: {
        exists,
        size: exists ? fileStats.size : null,
        sizeFormatted: exists ? `${(fileStats.size / 1024).toFixed(2)} KB` : null,
        modifiedTime: exists ? fileStats.mtime : null,
        isValidJson,
        contentPreview: isValidJson ? `${fileContent.substring(0, 100)}...` : null
      },
      permissions,
      database: isValidJson ? {
        lastUpdated: jsonParsed.lastUpdated,
        lastUpdatedFormatted: new Date(jsonParsed.lastUpdated).toLocaleString(),
        categoryCount: Object.keys(jsonParsed.categories || {}).length,
        categories: Object.keys(jsonParsed.categories || {}).slice(0, 5) // Show first 5 categories
      } : null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}