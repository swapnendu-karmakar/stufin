import { StudentDashboard } from "@/components/student-dashboard"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { getStudentById } from "@/lib/google-sheets"

interface PageProps {
  params: {
    id: string
  }
}

export default async function StudentPage({ params }: PageProps) {
  const studentId = decodeURIComponent(params.id)

  const student = await getStudentById(studentId)

  if (!student) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 px-4 py-8">
        <StudentDashboard student={student} />
      </main>
      <Footer />
    </div>
  )
}
