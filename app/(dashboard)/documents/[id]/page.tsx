import { DocumentViewer } from '@/components/documents/document-viewer'
import { DocumentDeleteDialog } from '@/components/documents/document-delete-dialog'

interface DocumentDetailPageProps {
  params: {
    id: string
  }
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Document Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bekijk en beheer document {params.id}
          </p>
        </div>
        <DocumentDeleteDialog documentId={params.id} />
      </div>

      <DocumentViewer documentId={params.id} />
    </div>
  )
}
