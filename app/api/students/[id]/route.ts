import { type NextRequest, NextResponse } from "next/server"
import { getStudentById } from "@/lib/google-sheets"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    console.log(`[v0] API: Fetching student with ID: ${studentId}`)

    const student = await getStudentById(studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 },
    )
  }
}
