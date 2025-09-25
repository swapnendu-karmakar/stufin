import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Student Not Found</CardTitle>
          <CardDescription className="text-lg">
            The student ID you searched for could not be found in our system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Please check the student ID and try again, or contact the administration for assistance.
          </p>
          <Button asChild className="w-full">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
