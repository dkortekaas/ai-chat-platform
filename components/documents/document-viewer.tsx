'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Globe, Calendar, HardDrive } from 'lucide-react'

interface DocumentViewerProps {
  documentId: string
}

// Mock data - replace with real data
const mockDocument = {
  id: '1',
  title: 'Producthandleiding.pdf',
  type: 'PDF',
  size: '2.4 MB',
  uploadedAt: '2024-01-15T10:30:00Z',
  status: 'processed',
  content: 'Dit is een voorbeeld van de document inhoud. In een echte implementatie zou hier de volledige tekst van het document staan die door de AI is geëxtraheerd en verwerkt.',
  metadata: {
    pages: 25,
    words: 5420,
    language: 'nl'
  }
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
  // TODO: Fetch document by ID
  const document = mockDocument

  const getIcon = () => {
    switch (document.type.toLowerCase()) {
      case 'url':
        return <Globe className="h-6 w-6 text-blue-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
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
            <Badge variant={document.status === 'processed' ? 'default' : 'secondary'}>
              {document.status === 'processed' ? 'Verwerkt' : 'Bezig...'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Document Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-sm">{document.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pagina's</p>
              <p className="text-sm">{document.metadata.pages}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Woorden</p>
              <p className="text-sm">{document.metadata.words.toLocaleString('nl-NL')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Taal</p>
              <p className="text-sm">{document.metadata.language.toUpperCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card>
        <CardHeader>
          <CardTitle>Geëxtraheerde inhoud</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-sm text-gray-700 leading-relaxed">
              {document.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
