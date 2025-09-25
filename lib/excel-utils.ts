import * as XLSX from "xlsx"

export interface CellData {
  [key: string]: any
}

export interface FileData {
  name: string
  type: string
  data: ArrayBuffer
}

export interface SheetInfo {
  name: string
  data: CellData[]
  rowCount: number
  colCount: number
}

export class ExcelProcessor {
  static parseFile(fileData: FileData): SheetInfo[] {
    try {
      const workbook = XLSX.read(fileData.data, { type: "array" })
      const sheets: SheetInfo[] = []

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" })

        // Convert array of arrays to array of objects with column letters as keys
        const formattedData: CellData[] = []
        const maxCols = Math.max(...jsonData.map((row: any) => row.length), 10)

        jsonData.forEach((row: any) => {
          const rowData: CellData = {}
          for (let colIndex = 0; colIndex < maxCols; colIndex++) {
            const colLetter = XLSX.utils.encode_col(colIndex)
            rowData[colLetter] = row[colIndex] || ""
          }
          formattedData.push(rowData)
        })

        // Ensure minimum rows for editing
        while (formattedData.length < 20) {
          const rowData: CellData = {}
          for (let colIndex = 0; colIndex < maxCols; colIndex++) {
            const colLetter = XLSX.utils.encode_col(colIndex)
            rowData[colLetter] = ""
          }
          formattedData.push(rowData)
        }

        sheets.push({
          name: sheetName,
          data: formattedData,
          rowCount: formattedData.length,
          colCount: maxCols,
        })
      })

      return sheets
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      throw new Error("Failed to parse Excel file. Please ensure it's a valid Excel or CSV file.")
    }
  }

  static createWorkbook(sheets: SheetInfo[]): XLSX.WorkBook {
    const workbook = XLSX.utils.book_new()

    sheets.forEach((sheet) => {
      // Filter out empty rows at the end
      const filteredData = sheet.data.filter((row, index) => {
        if (index < 5) return true // Keep first 5 rows regardless
        return Object.values(row).some((cell) => cell !== "")
      })

      const worksheet = XLSX.utils.json_to_sheet(filteredData, { skipHeader: true })
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
    })

    return workbook
  }

  static downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
    try {
      console.log("[v0] Starting download process")
      const cleanFilename = filename.replace(/\.[^/.]+$/, "") + "_edited.xlsx"

      console.log("[v0] Creating buffer with XLSX.write")
      // Use XLSX.write with proper browser-compatible options
      const buffer = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
        compression: true,
      })

      console.log("[v0] Buffer created, size:", buffer.length)

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      console.log("[v0] Blob created, starting download")

      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", cleanFilename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log("[v0] Download completed successfully")
    } catch (error) {
      console.error("[v0] Error downloading Excel file:", error)
      throw new Error("Failed to download Excel file")
    }
  }

  static workbookToArrayBuffer(workbook: XLSX.WorkBook): ArrayBuffer {
    try {
      console.log("[v0] Converting workbook to array buffer")
      const buffer = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
        compression: true,
      })
      console.log("[v0] Array buffer conversion completed")
      return buffer
    } catch (error) {
      console.error("[v0] Error converting workbook:", error)
      throw error
    }
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ]

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please select a valid Excel file (.xlsx, .xls) or CSV file.",
      }
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        error: "File size must be less than 10MB.",
      }
    }

    return { isValid: true }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  static getColumnName(index: number): string {
    return XLSX.utils.encode_col(index)
  }

  static addRow(data: CellData[], colCount: number): CellData[] {
    const newRow: CellData = {}
    for (let i = 0; i < colCount; i++) {
      const colLetter = XLSX.utils.encode_col(i)
      newRow[colLetter] = ""
    }
    return [...data, newRow]
  }

  static addColumn(data: CellData[]): CellData[] {
    return data.map((row) => {
      const colCount = Object.keys(row).length
      const newColLetter = XLSX.utils.encode_col(colCount)
      return { ...row, [newColLetter]: "" }
    })
  }

  static deleteRow(data: CellData[], rowIndex: number): CellData[] {
    if (data.length <= 1) return data
    return data.filter((_, index) => index !== rowIndex)
  }

  static deleteColumn(data: CellData[], colKey: string): CellData[] {
    return data.map((row) => {
      const newRow = { ...row }
      delete newRow[colKey]
      return newRow
    })
  }

  static updateCell(data: CellData[], rowIndex: number, colKey: string, value: any): CellData[] {
    const newData = [...data]
    newData[rowIndex] = { ...newData[rowIndex], [colKey]: value }
    return newData
  }
}
