'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

function AuthChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      const excludedRoutes = [
        '/complete-profile',
        '/create-teacher-profile',
        '/login',
        '/register',
        '/api'
      ]
      const isProtectRouteTeacher = pathname.startsWith("/teacher")
      const isExcludedRoute = excludedRoutes.some(route =>
        pathname.startsWith(route)
      )

      if (!session.user.isValid && !isExcludedRoute) {
        router.push('/complete-profile')
      }
      if (session.user.role !== "TEACHER" && isProtectRouteTeacher) {
        setUnauthorized(true)
      } else {
        setUnauthorized(false)
      }
    }
  }, [session, status, router, pathname])

  if (unauthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            🚫 Truy cập bị từ chối
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthChecker>
        {children}
      </AuthChecker>
    </SessionProvider>
  )
}
