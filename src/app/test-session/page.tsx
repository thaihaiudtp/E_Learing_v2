'use client'

import { useSession } from 'next-auth/react'

export default function TestSession() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Session Status: {status}</h2>
        {session ? (
          <div>
            <p><strong>ID:</strong> {session.user.id} (Should be Database ID)</p>
            <p><strong>Name:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>isValid:</strong> {session.user.isValid ? 'true' : 'false'}</p>
          </div>
        ) : (
          <p>No session found</p>
        )}
      </div>
      
      {session && (
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Full Session Object:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
