"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, FileText, Calendar } from "lucide-react"

export function StudentSearchSection() {
  const [studentId, setStudentId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!studentId.trim()) return

    setIsSearching(true)
    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Navigate to student dashboard with the ID
    router.push(`/student/${encodeURIComponent(studentId.trim())}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-8">
      {/* Search Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Search className="h-6 w-6 text-primary" />
            Search Student
          </CardTitle>
          <CardDescription className="text-lg">Enter the student ID to view their profile and schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter Student ID (e.g., 2203051240100)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg py-6 border-2 focus:border-primary"
              disabled={isSearching}
            />
            <Button
              onClick={handleSearch}
              disabled={!studentId.trim() || isSearching}
              size="lg"
              className="px-8 py-6 text-lg"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Quick Access Examples */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Quick access to sample students:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["2203051240100", "2203051240099", "2203051240106"].map((id) => (
                <Button
                  key={id}
                  variant="outline"
                  size="sm"
                  onClick={() => setStudentId(id)}
                  disabled={isSearching}
                  className="text-xs"
                >
                  {id}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Student Profiles</h3>
            <p className="text-muted-foreground text-sm">
              View comprehensive student information including personal details and academic records
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Schedule Access</h3>
            <p className="text-muted-foreground text-sm">
              Access student schedules and timetables directly from their profile dashboard
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">PDF Documents</h3>
            <p className="text-muted-foreground text-sm">
              View and download important documents and schedules in PDF format
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
