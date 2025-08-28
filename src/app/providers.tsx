'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

function AuthChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Chỉ kiểm tra khi session đã load và user đã đăng nhập
    if (status === 'loading') return

    if (session?.user) {
      // Các route không cần kiểm tra isValid
      const excludedRoutes = [
        '/complete-profile',
        '/create-teacher-profile',
        '/login',
        '/register',
        '/api'
      ]

      // Kiểm tra nếu không phải là route được loại trừ
      const isExcludedRoute = excludedRoutes.some(route => 
        pathname.startsWith(route)
      )

      // Nếu user chưa hoàn thành profile và không ở trang complete-profile
      if (!session.user.isValid && !isExcludedRoute) {
        router.push('/complete-profile')
      }
    }
  }, [session, status, router, pathname])

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