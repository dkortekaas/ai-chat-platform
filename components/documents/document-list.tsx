'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DocumentCard } from '@/components/documents/document-card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { Pagination } from '@/components/shared/pagination'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FileText } from 'lucide-react'

interface DocumentFilters {
  search: string
  type: string
  status: string
}

interface Document {
  id: string
  name: string
  type: string
  status: string
  fileSize?: number
  chunksCount: number
  createdAt: string
}

const fetchDocuments = async (_params: { page?: number; limit?: number; search?: string }) => {
  // Mock implementation - replace with actual API call
  return {
    data: [],
    pagination: {
      totalPages: 1,
      totalItems: 0
    }
  }
}

export function DocumentList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    type: 'all',
    status: 'all',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['documents', page, filters],
    queryFn: () => fetchDocuments({ page, ...filters }),
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data?.data.length) {
    return (
      <EmptyState
        icon={FileText}
        title="Geen documenten"
        description="Upload je eerste document om te beginnen"
        action={{ label: 'Document uploaden', onClick: () => window.location.href = '/documents/upload' }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Zoeken..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-sm"
        />
        
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
        >
          <option value="all">Alle types</option>
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
          <option value="TXT">TXT</option>
          <option value="URL">URL</option>
        </Select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((document: Document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={data.pagination.totalPages}
        pageSize={pageSize}
        totalItems={data.pagination.totalItems}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}