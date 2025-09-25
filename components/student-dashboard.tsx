"use client"
import { useState } from "react"
import * as XLSX from 'xlsx'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  ExternalLink,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Student } from "@/lib/google-sheets"
import { PDFViewer } from "@/components/pdf-viewer"

interface StudentDashboardProps {
  student: Student
}

export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return "/placeholder.svg?height=150&width=150&query=student profile";
  
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const fileId = match[1];
    // Use thumbnail API instead
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=s200`;
  }
  
  return url;
}

export function StudentDashboard({ student }: StudentDashboardProps) {
  const router = useRouter()
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)

  const profileImageUrl = convertGoogleDriveUrl(student.profileImage || "");

  // Handle Excel download
  const handleDownloadExcel = () => {
    try {
      // Prepare student data for Excel
      const studentData = [
        ['Field', 'Value'],
        ['Student ID', student.id],
        ['Name', student.name],
        ['Email', student.email],
        ['Phone', student.phone],
        ['Address', student.address],
        ['Department', student.department],
        ['Semester', student.semester],
        ['Batch', student.batch],
        ['CGPA', student.cgpa],
        ['Profile Image URL', student.profileImage || 'Not provided'],
        ['Schedule URL', student.scheduleUrl || 'Not provided'],
        ['', ''], // Empty row
        ['Downloaded on', new Date().toLocaleString()],
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(studentData);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Field column
        { wch: 40 }  // Value column
      ];
      ws['!cols'] = colWidths;

      // Style the header row (optional, may not work in all versions)
      try {
        if (ws['A1']) ws['A1'].s = { font: { bold: true }, fill: { fgColor: { rgb: "E7E7E7" } } };
        if (ws['B1']) ws['B1'].s = { font: { bold: true }, fill: { fgColor: { rgb: "E7E7E7" } } };
      } catch (styleError) {
        // Styling might not be supported, continue without it
        console.log('Styling not supported, continuing without styles');
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Student Details');

      // Generate filename with student name and current date
      const fileName = `${student.name.replace(/\s+/g, '_')}_Details_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Write and download the file
      XLSX.writeFile(wb, fileName);

      console.log(`Excel file downloaded: ${fileName}`);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  // Handle email functionality
  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Regarding Student: ${student.name} (ID: ${student.id})`);
    const body = encodeURIComponent(
      `Dear ${student.name},\n\n` +
      `I hope this email finds you well.\n\n` +
      `Student Details:\n` +
      `- Name: ${student.name}\n` +
      `- ID: ${student.id}\n` +
      `- Department: ${student.department}\n` +
      `- Semester: ${student.semester}\n` +
      `- Batch: ${student.batch}\n` +
      `- CGPA: ${student.cgpa}\n\n` +
      `Best regards,\n` +
      `[Your Name]`
    );

    // Create mailto link
    const mailtoLink = `mailto:${student.email}?subject=${subject}&body=${body}`;
    
    // Open default email client
    window.location.href = mailtoLink;
  };

  const handleViewSchedule = async () => {
    setIsLoadingSchedule(true)
    console.log(`[v0] Opening schedule URL: ${student.scheduleUrl}`)

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setShowPDFViewer(true)
    setIsLoadingSchedule(false)
  }

  const handleOpenInNewTab = () => {
    window.open(student.scheduleUrl, "_blank")
  }

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Detailed information and schedule access</p>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Image
                  src={profileImageUrl || "/placeholder.svg?height=150&width=150&query=student profile"}
                  alt={`${student.name} profile`}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-primary/20 object-cover"
                  unoptimized={true}
                  onError={(e) => {
                    console.log('Image failed to load, using placeholder');
                    e.currentTarget.src = "/placeholder.svg?height=150&width=150&query=student profile";
                  }}
                />
              </div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription className="text-lg">ID: {student.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {student.department}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="break-all">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{student.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Information
              </CardTitle>
              <CardDescription>Current academic status and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">DEPARTMENT</h4>
                    <p className="text-lg font-medium">{student.department}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">CURRENT SEMESTER</h4>
                    <p className="text-lg font-medium">{student.semester}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">BATCH</h4>
                    <p className="text-lg font-medium">{student.batch}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">CGPA</h4>
                    <p className="text-lg font-medium text-primary">{student.cgpa}/10.0</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Access Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-6 w-6 text-primary" />
              Schedule & Documents
            </CardTitle>
            <CardDescription>Access student schedule and important documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-muted rounded-lg">
              <div className="flex items-start gap-4">
                <FileText className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Class Schedule PDF</h4>
                  <p className="text-muted-foreground">View the complete class timetable and schedule</p>
                  <p className="text-xs text-muted-foreground mt-1">Last updated: Today</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleViewSchedule} disabled={isLoadingSchedule} className="flex items-center gap-2">
                  {isLoadingSchedule ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      View PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent hover:bg-green-50 hover:border-green-300 transition-colors"
                onClick={handleDownloadExcel}
              >
                <Download className="h-5 w-5 text-green-600" />
                <span className="text-sm">Download Info</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={handleSendEmail}
              >
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Send Email</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent hover:bg-purple-50 hover:border-purple-300 transition-colors">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm">View Calendar</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent hover:bg-orange-50 hover:border-orange-300 transition-colors">
                <FileText className="h-5 w-5 text-orange-600" />
                <span className="text-sm">Documents</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showPDFViewer && (
        <PDFViewer
          pdfUrl={student.scheduleUrl}
          title={`${student.name} - Class Schedule`}
          onClose={() => setShowPDFViewer(false)}
        />
      )}
    </>
  )
}