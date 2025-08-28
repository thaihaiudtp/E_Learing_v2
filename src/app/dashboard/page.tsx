// filepath: src/app/dashboard/page.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [protectedData, setProtectedData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Test protected API call with JWT
  const fetchProtectedData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/protected')
      if (response.status === 401) {
        signOut({ callbackUrl: '/login' })
        return
      }
      const data = await response.json()
      setProtectedData(data)
    } catch (error) {
      console.error('Error fetching protected data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard (JWT Authentication)</h1>
      
      {/* User Info from JWT */}
      <div className="mb-6 p-4 bg-green-100 rounded">
        <h2 className="text-lg font-semibold mb-2">JWT Session Data:</h2>
        <p><strong>User ID:</strong> {session.user?.id}</p>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
      </div>

      {/* Test Protected API */}
      <div className="mb-6">
        <button
          onClick={fetchProtectedData}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test Protected API (JWT)'}
        </button>
        
        {protectedData && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Protected API Response:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(protectedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}