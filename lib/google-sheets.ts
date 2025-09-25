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

// Initialize Google Auth with environment variables
const getGoogleAuth = () => {
  try {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    
    if (serviceAccountJson) {
      const credentials = JSON.parse(serviceAccountJson);
      return new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: "https://www.googleapis.com/auth/spreadsheets"
      });
    }

    throw new Error('No Google Sheets credentials found. Please set up environment variables.');

  } catch (error) {
    console.error('Error initializing Google Auth:', error);
    throw new Error('Failed to initialize Google authentication');
  }
};

// Get spreadsheet ID from environment variable or use default
const getSpreadsheetId = () => {
  return process.env.GOOGLE_SHEETS_SHEET_ID;
};

export async function getStudentById(studentId: string): Promise<Student | null> {
  try {
    const auth = getGoogleAuth();
    await auth.getClient();
    
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSpreadsheetId();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "Sheet1!A:K"
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in spreadsheet, using mock data');
      return getMockStudentById(studentId);
    }

    // Find student by ID (assuming ID is in column A)
    const studentRow = rows.find(row => row && row[0] === studentId);
    if (!studentRow) {
      console.log(`Student ${studentId} not found in spreadsheet, checking mock data`);
      return getMockStudentById(studentId);
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
    };

    return student;

  } catch (error) {
    console.error("Error getting student from Google Sheets:", error);
    console.log('Falling back to mock data');
    return getMockStudentById(studentId);
  }
}

// Get all students (for search suggestions)
export async function getAllStudents(): Promise<Student[]> {
  try {
    const auth = getGoogleAuth();
    await auth.getClient();
    
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "Sheet1!A:K"
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in spreadsheet, using mock data');
      return Object.values(getMockStudents());
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
    }));

    const validStudents = students.filter(student => student.id); // Filter out empty rows
    
    // If no valid students found, return mock data
    if (validStudents.length === 0) {
      console.log('No valid students found in spreadsheet, using mock data');
      return Object.values(getMockStudents());
    }

    return validStudents;

  } catch (error) {
    console.error("Error getting all students from Google Sheets:", error);
    console.log('Falling back to mock data');
    return Object.values(getMockStudents());
  }
}

// Mock data fallback (keep your existing mock data)
function getMockStudentById(studentId: string): Student | null {
  const mockStudents: Record<string, Student> = getMockStudents();
  return mockStudents[studentId] || null;
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
      profileImage: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
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
      profileImage: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
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
      profileImage: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
    },
  }
}

// Additional utility functions for search and filtering
export async function searchStudents(query: string): Promise<Student[]> {
  try {
    const allStudents = await getAllStudents();
    
    if (!query.trim()) {
      return allStudents;
    }

    const searchQuery = query.toLowerCase().trim();
    
    return allStudents.filter(student => 
      student.name.toLowerCase().includes(searchQuery) ||
      student.id.toLowerCase().includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery) ||
      student.department.toLowerCase().includes(searchQuery) ||
      student.batch.toLowerCase().includes(searchQuery)
    );
  } catch (error) {
    console.error('Error searching students:', error);
    throw new Error('Failed to search students');
  }
}

// Get students by department
export async function getStudentsByDepartment(department: string): Promise<Student[]> {
  try {
    const allStudents = await getAllStudents();
    return allStudents.filter(student => 
      student.department.toLowerCase().includes(department.toLowerCase())
    );
  } catch (error) {
    console.error('Error getting students by department:', error);
    throw new Error('Failed to get students by department');
  }
}

// Get students by batch
export async function getStudentsByBatch(batch: string): Promise<Student[]> {
  try {
    const allStudents = await getAllStudents();
    return allStudents.filter(student => 
      student.batch.toLowerCase().includes(batch.toLowerCase())
    );
  } catch (error) {
    console.error('Error getting students by batch:', error);
    throw new Error('Failed to get students by batch');
  }
}