import { google } from "googleapis"

// Student interface
export interface Student {
  id: string
  name: string
  email: string
  department: string
  semester: string
  batch: string
  phone: string
  address: string
  cgpa: string
  scheduleUrl: string
  profileImage: string
}

export async function getStudentById(studentId: string): Promise<Student | null> {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: "secrets.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
      })

      await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth })
      const spreadsheetId = "1eItKls2_ib-w9X3ALHEnWqaLIIAYWglQn3DD4AZPQ0g"
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A:K"
      })

      const rows = response.data.values
      if (!rows || rows.length === 0) {
        return null
      }

      // Find student by ID (assuming ID is in column A)
      const studentRow = rows.find(row => row && row[0] === studentId)
      if (!studentRow) {
        return null
      }

      const student: Student = {
        id: studentRow[0] || "",
        name: studentRow[1] || "",
        email: studentRow[2] || "",
        department: studentRow[3] || "",
        semester: studentRow[4] || "",
        batch: studentRow[5] || "",
        phone: studentRow[6] || "",
        address: studentRow[7] || "",
        cgpa: studentRow[8] || "",
        scheduleUrl: studentRow[9] || "",
        profileImage: studentRow[10] || "/default-profile.png"
      }

      return student

    } catch (error) {
      console.error("Error getting student:", error)
      throw new Error(`Failed to get student: ${error.message}`)
    }
  }

// Mock data fallback
function getMockStudentById(studentId: string): Student | null {
  const mockStudents: Record<string, Student> = {
    "2203051240100": {
      id: "2203051240100",
      name: "Swapnendu Karmakar",
      email: "swapnendu.karmakar@paruluniversity.ac.in",
      department: "Computer Science Engineering",
      semester: "6th Semester",
      batch: "2022-2026",
      phone: "+91 98765 43210",
      address: "Vadodara, Gujarat",
      cgpa: "8.5",
      scheduleUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
      profileImage: "/male-student-profile.png",
    },
    "2203051240099": {
      id: "2203051240099",
      name: "Suzan Mansuri",
      email: "suzan.mansuri@paruluniversity.ac.in",
      department: "Computer Science Engineering",
      semester: "6th Semester",
      batch: "2022-2026",
      phone: "+91 98765 43211",
      address: "Vadodara, Gujarat",
      cgpa: "8.7",
      scheduleUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
      profileImage: "/female-student-profile.png",
    },
    "2203051240106": {
      id: "2203051240106",
      name: "Yash Kumar",
      email: "yash.kumar@paruluniversity.ac.in",
      department: "Computer Science Engineering",
      semester: "6th Semester",
      batch: "2022-2026",
      phone: "+91 98765 43212",
      address: "Vadodara, Gujarat",
      cgpa: "8.3",
      scheduleUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
      profileImage: "/male-student-profile.png",
    },
  }

  return mockStudents[studentId] || null
}

// Get all students (for search suggestions)
export async function getAllStudents(): Promise<Student[]> {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: "secrets.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
      })

      await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth })
      const spreadsheetId = "1eItKls2_ib-w9X3ALHEnWqaLIIAYWglQn3DD4AZPQ0g"

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A:K"
      })

      const rows = response.data.values
      if (!rows || rows.length === 0) {
        return []
      }

      // Skip header row (assuming first row contains headers)
      const students = rows.slice(1).map(row => ({
        id: row[0] || "",
        name: row[1] || "",
        email: row[2] || "",
        department: row[3] || "",
        semester: row[4] || "",
        batch: row[5] || "",
        phone: row[6] || "",
        address: row[7] || "",
        cgpa: row[8] || "",
        scheduleUrl: row[9] || "",
        profileImage: row[10] || "/default-profile.png"
      }))

      return students.filter(student => student.id) // Filter out empty rows

    } catch (error) {
      console.error("Error getting all students:", error)
      throw new Error(`Failed to get students: ${error.message}`)
    }
  }

function getMockStudents(): Record<string, Student> {
  return {
    "2203051240100": {
      id: "2203051240100",
      name: "Swapnendu Karmakar",
      email: "swapnendu.karmakar@paruluniversity.ac.in",
      department: "Computer Science Engineering",
      semester: "6th Semester",
      batch: "2022-2026",
      phone: "+91 98765 43210",
      address: "Vadodara, Gujarat",
      cgpa: "8.5",
      scheduleUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
      profileImage: "/male-student-profile.png",
    },
    "2203051240099": {
      id: "2203051240099",
      name: "Suzan Mansuri",
      email: "suzan.mansuri@paruluniversity.ac.in",
      department: "Computer Science Engineering",
      semester: "6th Semester",
      batch: "2022-2026",
      phone: "+91 98765 43211",
      address: "Vadodara, Gujarat",
      cgpa: "8.7",
      scheduleUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
      profileImage: "/female-student-profile.png",
    },
    "2203051240106": {
      id: "2203051240106",
      name: "Yash Kumar",
      email: "yash.kumar@paruluniversity.ac.in",
      department: "Computer Science Engineering",
      semester: "6th Semester",
      batch: "2022-2026",
      phone: "+91 98765 43212",
      address: "Vadodara, Gujarat",
      cgpa: "8.3",
      scheduleUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
      profileImage: "/male-student-profile.png",
    },
  }
}
