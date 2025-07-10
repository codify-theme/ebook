"use client"

import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, RotateCcw, Home, BookOpen } from "lucide-react"

interface Book {
  title_ar: string
  author_ar: string
  title_en?: string
  author_en?: string
  filename: string
  coverText: string
  type: string
  source?: string
  category: string
  id: number
}

interface BookReaderProps {
  book: Book
  onClose: () => void
  showArabic?: boolean
}

interface Chapter {
  title: string
  content: string
  id: string
}

const BookReader = ({ book, onClose, showArabic = false }: BookReaderProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [bookContent, setBookContent] = useState<string>("")
  const contentRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleResetZoom = () => {
    setZoom(100)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = `/epubs/${book.filename}`
    link.download = book.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Load and parse EPUB file
  useEffect(() => {
    const loadEpub = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Loading EPUB:", book.filename)

        // Import JSZip dynamically
        const JSZip = (await import("jszip")).default

        // Fetch the EPUB file
        const response = await fetch(`/epubs/${book.filename}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch EPUB file: ${response.status}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        console.log("EPUB file loaded, size:", arrayBuffer.byteLength)

        // Parse the ZIP file
        const zip = new JSZip()
        const zipContent = await zip.loadAsync(arrayBuffer)
        console.log("ZIP parsed, files:", Object.keys(zipContent.files).length)

        // Find and parse container.xml to get the OPF file path
        const containerFile = zipContent.files["META-INF/container.xml"]
        if (!containerFile) {
          throw new Error("Invalid EPUB: container.xml not found")
        }

        const containerXml = await containerFile.async("text")
        const parser = new DOMParser()
        const containerDoc = parser.parseFromString(containerXml, "text/xml")
        const opfPath = containerDoc.querySelector("rootfile")?.getAttribute("full-path")

        if (!opfPath) {
          throw new Error("Invalid EPUB: OPF path not found")
        }

        console.log("OPF path:", opfPath)

        // Parse the OPF file to get the spine and manifest
        const opfFile = zipContent.files[opfPath]
        if (!opfFile) {
          throw new Error("Invalid EPUB: OPF file not found")
        }

        const opfXml = await opfFile.async("text")
        const opfDoc = parser.parseFromString(opfXml, "text/xml")

        // Get the base path for content files
        const basePath = opfPath.substring(0, opfPath.lastIndexOf("/") + 1)

        // Extract spine items (reading order)
        const spineItems = Array.from(opfDoc.querySelectorAll("spine itemref"))
        const manifestItems = Array.from(opfDoc.querySelectorAll("manifest item"))

        console.log("Spine items:", spineItems.length)
        console.log("Manifest items:", manifestItems.length)

        // Build chapters array
        const extractedChapters: Chapter[] = []
        let allContent = ""

        for (let i = 0; i < spineItems.length; i++) {
          const itemref = spineItems[i]
          const idref = itemref.getAttribute("idref")

          if (!idref) continue

          // Find the corresponding manifest item
          const manifestItem = manifestItems.find((item) => item.getAttribute("id") === idref)
          if (!manifestItem) continue

          const href = manifestItem.getAttribute("href")
          if (!href) continue

          const fullPath = basePath + href
          console.log("Processing chapter:", fullPath)

          // Get the content file
          const contentFile = zipContent.files[fullPath]
          if (!contentFile) {
            console.warn("Content file not found:", fullPath)
            continue
          }

          try {
            const htmlContent = await contentFile.async("text")

            // Parse HTML and extract text content
            const htmlDoc = parser.parseFromString(htmlContent, "text/html")

            // Remove script and style tags
            const scripts = htmlDoc.querySelectorAll("script, style")
            scripts.forEach((el) => el.remove())

            // Get the title
            const chapterTitle =
              htmlDoc.querySelector("title")?.textContent ||
              htmlDoc.querySelector("h1, h2, h3")?.textContent ||
              `Chapter ${i + 1}`

            // Get the body content
            const bodyContent = htmlDoc.querySelector("body")?.innerHTML || htmlContent

            // Clean up the content
            const cleanContent = bodyContent
              .replace(/<script[^>]*>.*?<\/script>/gis, "")
              .replace(/<style[^>]*>.*?<\/style>/gis, "")
              .replace(/\s+/g, " ")
              .trim()

            if (cleanContent) {
              extractedChapters.push({
                id: idref,
                title: chapterTitle.trim(),
                content: cleanContent,
              })

              allContent += cleanContent + "\n\n"
            }
          } catch (chapterError) {
            console.warn("Error processing chapter:", fullPath, chapterError)
          }
        }

        console.log("Extracted chapters:", extractedChapters.length)

        if (extractedChapters.length === 0) {
          throw new Error("No readable content found in this EPUB file")
        }

        setChapters(extractedChapters)
        setTotalPages(extractedChapters.length)
        setBookContent(allContent)
        setCurrentPage(0)
        setIsLoading(false)

        console.log("✅ EPUB successfully loaded and parsed")
      } catch (err) {
        console.error("❌ Failed to load EPUB:", err)
        setError(err instanceof Error ? err.message : "Failed to load the book")
        setIsLoading(false)
      }
    }

    loadEpub()
  }, [book])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          e.preventDefault()
          handlePrevPage()
          break
        case "ArrowRight":
          e.preventDefault()
          handleNextPage()
          break
        case "Home":
          e.preventDefault()
          setCurrentPage(0)
          break
        case "End":
          e.preventDefault()
          setCurrentPage(totalPages - 1)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, currentPage, totalPages])

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
        <div className="bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-gray-900">Error Loading Book</h2>
          <div></div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-6xl mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Unable to Load Book</h3>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded">
              <p>
                <strong>Book:</strong> {showArabic ? book.title_ar : book.title_en}
              </p>
              <p>
                <strong>File:</strong> {book.filename}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Retry Loading
              </button>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download Book
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header Controls */}
      <div className="bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Home className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-gray-900 truncate text-sm md:text-base">
              {showArabic ? book.title_ar : book.title_en}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 truncate">
              {showArabic ? `بقلم ${book.author_ar}` : `by ${book.author_en}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-white rounded transition-colors"
              disabled={zoom <= 50}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="px-2 py-1 text-xs font-medium min-w-[3rem] text-center">{zoom}%</span>

            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-white rounded transition-colors"
              disabled={zoom >= 200}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-white rounded transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Page Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevPage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentPage <= 0}
              title="Previous Chapter"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-gray-600 min-w-[3rem] text-center">
              {currentPage + 1}/{totalPages}
            </span>

            <button
              onClick={handleNextPage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentPage >= totalPages - 1}
              title="Next Chapter"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download Book"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex-1 bg-gray-100 p-2 md:p-4 overflow-hidden">
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4 mx-auto"></div>
                <div className="text-lg font-medium text-gray-700">Loading Book...</div>
                <div className="text-sm text-gray-500 mt-2 max-w-xs truncate">{book.filename}</div>
                <div className="text-xs text-gray-400 mt-1">Extracting content from EPUB...</div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto p-4 md:p-8">
              <div
                ref={contentRef}
                className="max-w-4xl mx-auto"
                style={{
                  fontSize: `${zoom}%`,
                  direction: "rtl",
                  textAlign: "right",
                  fontFamily: "'Amiri', 'Noto Sans Arabic', Arial, sans-serif",
                  lineHeight: "1.8",
                }}
              >
                {chapters.length > 0 && (
                  <div>
                    {/* Chapter Title */}
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 border-b-2 border-amber-600 pb-4">
                      {chapters[currentPage]?.title}
                    </h1>

                    {/* Chapter Content */}
                    <div
                      className="prose prose-lg max-w-none text-gray-800"
                      style={{
                        direction: "rtl",
                        textAlign: "right",
                        fontFamily: "'Amiri', 'Noto Sans Arabic', Arial, sans-serif",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: chapters[currentPage]?.content || "",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 p-2 md:p-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setCurrentPage(0)}
              className="px-2 md:px-3 py-1 text-xs md:text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage <= 0}
            >
              First
            </button>

            <button
              onClick={handlePrevPage}
              className="px-2 md:px-3 py-1 text-xs md:text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage <= 0}
            >
              Previous
            </button>

            <div className="w-32 md:w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0}%` }}
              />
            </div>

            <button
              onClick={handleNextPage}
              className="px-2 md:px-3 py-1 text-xs md:text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>

            <button
              onClick={() => setCurrentPage(totalPages - 1)}
              className="px-2 md:px-3 py-1 text-xs md:text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage >= totalPages - 1}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookReader
