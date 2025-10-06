"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token || !email) {
      setError('Ongeldige link. Vraag een nieuwe resetlink aan.')
      return
    }

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters zijn')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Er is iets misgegaan')
      }
      setSuccess('Wachtwoord aangepast. Je wordt doorgestuurd naar login...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div>
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="ml-3 text-2xl font-bold text-purple-800">aivanti</span>
          </div>
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6">Nieuw wachtwoord</h1>
            <p className="text-lg text-gray-600">Kies een nieuw wachtwoord voor je account.</p>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Wachtwoord resetten</h2>
            <p className="text-gray-600">Voer je nieuwe wachtwoord in</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Nieuw wachtwoord</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-gray-700">Bevestig wachtwoord</label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition-colors" disabled={isLoading}>
              {isLoading ? 'Bezig...' : 'Wachtwoord bijwerken'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Weet je het weer?{' '}
              <Link href="/login" className="font-medium text-indigo-500 hover:text-purple-500">Inloggen</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


