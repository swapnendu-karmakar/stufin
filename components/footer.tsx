export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-foreground mb-1">Parul University</h3>
            <p className="text-muted-foreground">Vadodara, Gujarat</p>
          </div>

          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <h4 className="text-lg font-semibold text-foreground mb-3">Project Team</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex flex-col items-center p-3 bg-background/50 rounded-md border">
                <span className="font-medium text-foreground">Swapnendu Karmakar</span>
                <span className="text-muted-foreground">2203051240100</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background/50 rounded-md border">
                <span className="font-medium text-foreground">Shrey Bhaskar Patil</span>
                <span className="text-muted-foreground">2203051240072</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background/50 rounded-md border">
                <span className="font-medium text-foreground">Yash Kumar</span>
                <span className="text-muted-foreground">2203051240106</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 Excel File Manager</span>
            <span className="hidden md:inline">•</span>
            <span>Academic File Management System</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
