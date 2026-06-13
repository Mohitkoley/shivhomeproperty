'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface SubmitButtonProps {
  children: ReactNode
  className?: string
  loadingText?: string
}

export function SubmitButton({ children, className, loadingText = 'Saving...' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={className}
    >
      {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {pending ? loadingText : children}
    </Button>
  )
}
