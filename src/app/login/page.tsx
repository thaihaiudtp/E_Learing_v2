'use client'
export const dynamic = "force-dynamic";

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      console.log(session);
      router.push('/student/dashboard')
    }
  }, [status, router, session])

  useEffect(() => {
    const urlMessage = searchParams.get('message')
    if (urlMessage) {
      setMessage(urlMessage)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/student/dashboard')
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Social login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/student/dashboard' })}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.94 0 6.6 1.7 8.1 3.1l5.9-5.9C34.9 3.6 29.9 1.5 24 1.5 14.7 1.5 7 8.2 7 17.5c0 2.7.7 5.3 2 7.5l6.5-5c-1.1-3.3 1.3-6.5 4.5-7.5 1.3-.4 2.7-.5 4-.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.5c0-1.5-.1-2.6-.3-3.8H24v7.1h12.6c-.6 3.3-2.5 6.1-5.3 8l6.5 5c3.8-3.6 6-8.8 6-16.3z"
                />
                <path
                  fill="#4A90E2"
                  d="M24 46c6.5 0 11.9-2.1 15.8-5.6l-6.5-5c-2.2 1.5-5 2.5-9.3 2.5-7.1 0-13.1-4.8-15.2-11.3l-6.6 5.1C6.7 40.2 14.6 46 24 46z"
                />
                <path
                  fill="#FBBC05"
                  d="M8.7 28.2C8.2 26.8 8 25.2 8 23.5s.2-3.3.7-4.7l-6.6-5.1C.7 17.2 0 20.2 0 23.5c0 3.3.7 6.3 2.1 9.2l6.6-4.5z"
                />
              </svg>
              Google
            </button>
          </div>

        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to continue your learning journey
          </p>
        </div>
        <Suspense fallback={<div>Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
