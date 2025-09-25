"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ExternalLink, ZoomIn, ZoomOut } from "lucide-react"

interface PDFViewerProps {
  pdfUrl: string
  title?: string
  onClose: () => void
}

export function PDFViewer({ pdfUrl, title = "Document", onClose }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Convert Google Drive share URL to embeddable format
  const getEmbedUrl = (url: string) => {
    console.log(`[v0] Converting PDF URL: ${url}`)

    // Handle Google Drive URLs
    if (url.includes("drive.google.com")) {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
      if (fileIdMatch) {
        const fileId = fileIdMatch[1]
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
    }

    // For other URLs, try using Google Docs viewer
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }

  const embedUrl = getEmbedUrl(pdfUrl)

  const handleLoad = () => {
    setIsLoading(false)
    console.log(`[v0] PDF loaded successfully: ${title}`)
  }

  const handleError = () => {
    setIsLoading(false)
    console.log(`[v0] PDF failed to load: ${title}`)
  }

  const openInNewTab = () => {
    window.open(pdfUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>PDF Document Viewer</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}

          <iframe
            src={embedUrl}
            className="w-full h-full border-0 rounded-b-lg"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
            allow="autoplay"
          />

          {!isLoading && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
