'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Upload, 
  MoreVertical,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Download,
  Eye
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileUploadModal } from './file-upload-modal'
import { FileEditForm } from './file-edit-form'
import { DeleteConfirmationModal } from './delete-confirmation-modal'
import { useToast } from '@/hooks/use-toast'

interface KnowledgeFile {
  id: string
  originalName: string
  fileName: string
  filePath: string
  mimeType: string
  fileSize: number
  enabled: boolean
  status: 'PROCESSING' | 'COMPLETED' | 'ERROR'
  errorMessage?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export function BestandenTab() {
  const [files, setFiles] = useState<KnowledgeFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<KnowledgeFile | null>(null)
  const [fileToDelete, setFileToDelete] = useState<KnowledgeFile | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (response.ok) {
        const data = await response.json()
        setFiles(data)
      } else {
        throw new Error('Failed to fetch files')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load files',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadFile = () => {
    setIsUploadModalOpen(true)
  }

  const handleEditFile = (file: KnowledgeFile) => {
    setEditingFile(file)
    setIsEditModalOpen(true)
  }

  const handleDeleteFile = (file: KnowledgeFile) => {
    setFileToDelete(file)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/files/${fileToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'File deleted',
          description: 'The file has been deleted successfully.',
        })
        fetchFiles()
        setIsDeleteModalOpen(false)
        setFileToDelete(null)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete file')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadFile = async (file: KnowledgeFile) => {
    try {
      const response = await fetch(`/api/files/${file.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.originalName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error('Failed to download file')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive',
      })
    }
  }

  const toggleEnabled = async (file: KnowledgeFile) => {
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: file.description,
          enabled: !file.enabled
        }),
      })

      if (response.ok) {
        toast({
          title: 'File updated',
          description: `File has been ${!file.enabled ? 'enabled' : 'disabled'}.`,
        })
        fetchFiles()
      } else {
        throw new Error('Failed to update file')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update file',
        variant: 'destructive',
      })
    }
  }

  const handleUploadSuccess = () => {
    fetchFiles()
  }

  const handleEditSuccess = () => {
    fetchFiles()
  }

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingFile(null)
  }

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
      setFileToDelete(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatModifiedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  const getProcessingIcon = (status: KnowledgeFile['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getProcessingBadge = (status: KnowledgeFile['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">✓ Completed</Badge>
      case 'PROCESSING':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case 'ERROR':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bestanden</h2>
          <p className="text-sm text-gray-500">
            Upload and manage documents to enhance the assistant's knowledge base.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            ↑ No changes
          </Button>
          <Button variant="outline" size="sm">
            ► Test
          </Button>
          <Button 
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={handleUploadFile}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enabled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading files...
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No files uploaded yet. Click "Upload" to get started.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {file.originalName}
                          </span>
                          {file.description && (
                            <div className="text-xs text-gray-500">{file.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(file.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Switch
                        checked={file.enabled}
                        onCheckedChange={() => toggleEnabled(file)}
                        className="data-[state=checked]:bg-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getProcessingBadge(file.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatModifiedDate(file.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditFile(file)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteFile(file)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        onSuccess={handleUploadSuccess}
      />

      {/* File Edit Modal */}
      <FileEditForm
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
        file={editingFile}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
        itemName={fileToDelete?.originalName || ''}
        isLoading={isDeleting}
      />
    </div>
  )
}
