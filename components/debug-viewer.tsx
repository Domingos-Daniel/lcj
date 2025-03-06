// Novo arquivo para diagnóstico

"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface DebugViewerProps {
  data: any
  title?: string
}

export function DebugViewer({ data, title = "Debug Viewer" }: DebugViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          🔍 Debug
        </Button>
      ) : (
        <Card className="w-[400px] max-h-[80vh] overflow-auto shadow-xl border-amber-500 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{title}</h3>
            <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {Array.isArray(data) ? (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Array com {data.length} item(s)</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {data.slice(0, 3).map((item, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm"
                      onClick={() => console.log('Item debug:', item)}
                    >
                      Log Item {i+1}
                    </Button>
                  ))}
                </div>
                <details>
                  <summary className="cursor-pointer text-sm mb-2">Exemplo de Estrutura (Item 1)</summary>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-auto max-h-[400px]">
                    {JSON.stringify(data[0], null, 2)}
                  </pre>
                </details>
                <hr className="my-2" />
              </div>
            ) : (
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}