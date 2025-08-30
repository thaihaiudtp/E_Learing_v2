'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

function AuthChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const currentPath = usePathname();
  
  useEffect(() => {
    if (status === 'loading') return
    
    const publicPaths = ["/login", "/register"];
    const isPublicPath = publicPaths.includes(currentPath);
    
    // Nếu chưa đăng nhập và không phải trang công khai, chuyển đến login
    if (!session?.user && !isPublicPath) {
      router.push('/login')
    }
  }, [session, status, router, currentPath])

  // Hiển thị loading khi đang kiểm tra session
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
