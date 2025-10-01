import Link from 'next/link'
import { FileText, MoreVertical, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatBytes, formatDate } from '@/lib/utils'

interface Document {
  id: string
  name: string
  type: string
  status: string
  fileSize?: number
  chunksCount: number
  createdAt: string
}

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              href={`/documents/${document.id}`}
              className="font-medium text-gray-900 hover:text-indigo-500 truncate block"
            >
              {document.name}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(document.createdAt)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Trash2 className="w-4 h-4 mr-2" />
              Verwijderen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={document.status === 'COMPLETED' ? 'default' : 'secondary'}>
            {document.status}
          </Badge>
          
          <div className="text-sm text-gray-500 space-y-1">
            {document.fileSize && (
              <div>{formatBytes(document.fileSize)}</div>
            )}
            <div>{document.chunksCount} chunks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}