import { FileSpreadsheet } from "lucide-react"
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Excel Manager</h2>
        </div>

        <div className="flex items-center">
          <Image
            src="/images/parul-university-logo.png"
            alt="Parul University - NAAC A++ Accredited"
            width={200}
            height={64}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>
      </div>
    </header>
  )
}
