'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Globe, Calendar, HardDrive, Eye, EyeOff } from 'lucide-react'

interface DocumentViewerProps {
  document: DocumentData
}

interface DocumentData {
  id: string
  title: string
  type: string
  size: string
  uploadedAt: string
  status: string
  content: string
  metadata: {
    mimeType: string
    fileExtension: string
    words: number
    chunks: number
    description?: string
    errorMessage?: string
    documentId?: string
    hasEmbeddings: boolean
  }
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [showFullContent, setShowFullContent] = useState(false)

  const getIcon = () => {
    switch (document.type.toLowerCase()) {
      case 'url':
        return <Globe className="h-6 w-6 text-blue-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    switch (document.status) {
      case 'completed':
        return <Badge variant="default">Verwerkt</Badge>
      case 'processing':
        return <Badge variant="secondary">Bezig...</Badge>
      case 'failed':
        return <Badge variant="destructive">Mislukt</Badge>
      default:
        return <Badge variant="secondary">{document.status}</Badge>
    }
  }

  const getContentPreview = () => {
    if (!document.content || document.content === 'Content niet beschikbaar') {
      return document.content || 'Geen content beschikbaar'
    }
    
    if (showFullContent) {
      return document.content
    }
    
    // Show first 500 characters as preview
    return document.content.length > 500 
      ? document.content.substring(0, 500) + '...'
      : document.content
  }

  return (
    <div className="space-y-6">
      {/* Document Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div>
                <CardTitle className="text-xl">{document.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <HardDrive className="h-4 w-4" />
                    <span>{document.size}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(document.uploadedAt).toLocaleDateString('nl-NL')}</span>
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
      </Card>

      {/* Document Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-sm">{document.metadata.fileExtension}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Woorden</p>
              <p className="text-sm">{document.metadata.words.toLocaleString('nl-NL')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Chunks</p>
              <p className="text-sm">{document.metadata.chunks}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Embeddings</p>
              <p className="text-sm">{document.metadata.hasEmbeddings ? 'Ja' : 'Nee'}</p>
            </div>
          </div>
          {document.metadata.description && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Beschrijving</p>
              <p className="text-sm">{document.metadata.description}</p>
            </div>
          )}
          {document.metadata.errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{document.metadata.errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Geëxtraheerde inhoud</CardTitle>
            <div className="flex space-x-2">
              {document.content && document.content.length > 500 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullContent(!showFullContent)}
                >
                  {showFullContent ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Verberg
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Toon volledig
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {getContentPreview()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

