'use client'

import { useState, useCallback } from 'react'
import { Upload, File } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')
      }

      toast({
        title: 'Success',
        description: `${files.length} document(en) geüpload`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Upload mislukt',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }, [toast])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    onDrop(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onDrop(files)
    }
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        uploading && 'opacity-50 pointer-events-none'
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      
      <p className="text-lg font-medium text-gray-900 mb-2">
        Sleep bestanden hierheen
      </p>
      
      <p className="text-sm text-gray-500 mb-4">
        of klik om te uploaden
      </p>

      <input
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.jpg,.png"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      
      <label htmlFor="file-upload">
        <Button asChild>
          <span>Selecteer bestanden</span>
        </Button>
      </label>

      <p className="text-xs text-gray-400 mt-4">
        PDF, DOCX, TXT, JPG, PNG (max 10MB)
      </p>
    </div>
  )
}