"use client"

import { useState, useEffect } from "react"
import { Download, ExternalLink, Home } from "lucide-react"

interface EpubFallbackReaderProps {
  epubUrl: string
  title: string
  author: string
  onClose: () => void
}

const EpubFallbackReader = ({ epubUrl, title, author, onClose }: EpubFallbackReaderProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = epubUrl
    link.download = epubUrl.split("/").pop() || "book.epub"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <Home className="w-4 h-4" />
          </button>
          <div className="truncate">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            <p className="text-xs text-gray-500 truncate">{author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="p-1 hover:bg-gray-100 rounded" title="Download EPUB">
            <Download className="w-4 h-4" />
          </button>
          <a
            href={epubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-100 rounded"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        )}

        <iframe src={epubUrl} className="w-full h-full border-0" title={title} onLoad={() => setIsLoading(false)} />
      </div>
    </div>
  )
}

export default EpubFallbackReader
