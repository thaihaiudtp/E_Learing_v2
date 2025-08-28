'use client'
import { Suspense } from 'react'
import TeacherCoursesContent from './TeacherCoursesContent'

export const dynamic = "force-dynamic";

export default function TeacherCoursesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <TeacherCoursesContent />
    </Suspense>
  )
}
