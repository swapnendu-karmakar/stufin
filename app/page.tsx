import { StudentSearchSection } from "@/components/student-search-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Student Information System
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Search for student information and view detailed profiles with schedules. Enter a student ID to get
              started.
            </p>
          </div>
          <StudentSearchSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
