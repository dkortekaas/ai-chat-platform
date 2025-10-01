'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, always show success
      setSuccess('Password reset link sent! Check your email for instructions.')
      
      // Reset form
      setEmail('')
      
    } catch (error) {
      setError('Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email to get started</p>
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Send Reset Link Button */}
        <Button 
          type="submit" 
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition-colors" 
          disabled={isLoading}
        >
          {isLoading ? 'Sending reset link...' : 'Send reset link'}
        </Button>
      </form>
      
      {/* Back to login */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-indigo-500 hover:text-purple-500">
            Back to sign in
          </Link>
        </p>
      </div>
      
      {/* Additional help */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or{' '}
          <Link href="#" className="font-medium text-indigo-500 hover:text-purple-500">
            try again
          </Link>
        </p>
      </div>
    </div>
  )
}
