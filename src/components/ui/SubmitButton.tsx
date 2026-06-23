'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function SubmitButton({ children, className, loadingText, variant, size, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {pending && loadingText ? loadingText : children}
    </Button>
  )
}
