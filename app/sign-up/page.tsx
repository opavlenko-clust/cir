'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); return }
    setMessage('Check your email to confirm your account.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded" required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded" required />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  )
}
