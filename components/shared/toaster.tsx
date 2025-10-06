import React, { useCallback, useState } from 'react'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
import { useToastSubscription, ToastOptions } from '@/hooks/use-toast'

interface QueuedToast extends ToastOptions {
  id: string
}

export function Toaster() {
  const [queue, setQueue] = useState<QueuedToast[]>([])

  const onToast = useCallback((t: ToastOptions) => {
    const item: QueuedToast = { id: crypto.randomUUID(), ...t }
    setQueue(prev => [...prev, item])
    // auto-dismiss after 3.5s
    setTimeout(() => {
      setQueue(prev => prev.filter(q => q.id !== item.id))
    }, 3500)
  }, [])

  useToastSubscription(onToast)

  return (
    <ToastProvider swipeDirection="right">
      {queue.map(t => (
        <Toast key={t.id} variant={t.variant}>
          <div className="grid gap-1">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
