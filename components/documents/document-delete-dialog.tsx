'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

interface DocumentDeleteDialogProps {
  documentId: string
}

export function DocumentDeleteDialog({ documentId }: DocumentDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    // TODO: Implement delete logic
    console.log('Deleting document:', documentId)
    
    setTimeout(() => {
      setIsDeleting(false)
      setIsOpen(false)
      // TODO: Redirect or refresh
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Verwijderen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document verwijderen</DialogTitle>
          <DialogDescription>
            Weet je zeker dat je dit document wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            Het document wordt ook uit de kennisbank van je chatbot verwijderd.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuleren
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
