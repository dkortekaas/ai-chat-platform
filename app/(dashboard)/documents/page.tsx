import { DocumentList } from '@/components/documents/document-list'
import { DocumentUpload } from '@/components/documents/document-upload'
import { DocumentUrlForm } from '@/components/documents/document-url-form'

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Documenten</h1>
          <p className="mt-1 text-sm text-gray-500">
            Beheer je kennisbank documenten
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentUpload />
        <DocumentUrlForm />
      </div>

      <DocumentList />
    </div>
  )
}
