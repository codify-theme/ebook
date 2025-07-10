"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, Menu, BookOpen, Facebook, Youtube, Twitter } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import BookReader from "@/components/BookReader"

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
  featured?: boolean
}

const Index = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: any }>>([])
  const [loading, setLoading] = useState(true)
  const [showArabic, setShowArabic] = useState(true)
  const [categorySearchQuery, setCategorySearchQuery] = useState("")

  // Featured books
  const featuredBooks = []

  // Load books from manifest.json
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true)
        console.log("Loading books from manifest...")

        const response = await fetch("/epubs/manifest.json")
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status}`)
        }

        const manifestBooks = await response.json()
        console.log("Loaded books from manifest:", manifestBooks.length)

        // Transform the books to ensure consistent structure
        const transformedBooks: Book[] = manifestBooks.map((book: any, index: number) => ({
          title_ar: book.title_ar || "عنوان غير معروف",
          author_ar: book.author_ar || "مؤلف غير معروف",
          title_en: book.title_en || book.title_ar || "Unknown Title",
          author_en: book.author_en || book.author_ar || "Unknown Author",
          filename: book.filename || "",
          coverText: book.coverText || "كتاب",
          type: book.type || "epub",
          source: book.source || "local",
          category: book.category || "Miscellaneous",
          id: book.id || index + 1,
          featured: book.featured || false,
        }))

        console.log("Transformed books:", transformedBooks.length)

        // Sort books: featured first, then alphabetically
        const sortedBooks = transformedBooks.sort((a, b) => {
          const aIsFeatured = featuredBooks.some((title) => a.title_ar.includes(title))
          const bIsFeatured = featuredBooks.some((title) => b.title_ar.includes(title))

          if (aIsFeatured && !bIsFeatured) return -1
          if (!aIsFeatured && bIsFeatured) return 1

          return a.title_ar.localeCompare(b.title_ar, "ar")
        })

        setBooks(sortedBooks)
        setFilteredBooks(sortedBooks)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load books from manifest:", error)
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  // Load categories from JSON file
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/categories.json")
        const categoryNames = await response.json()

        const categoriesWithIcons = [
          { id: "all", name: "All Books", icon: BookOpen },
          ...categoryNames.map((name: string) => ({
            id: name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "-"),
            name: name,
            icon: BookOpen,
          })),
        ]

        setCategories(categoriesWithIcons)
        console.log("Categories loaded:", categoriesWithIcons.length)
      } catch (error) {
        console.error("Failed to load categories:", error)
        setCategories([{ id: "all", name: "All Books", icon: BookOpen }])
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filter books based on category and search
  useEffect(() => {
    console.log("Filtering books - Category:", selectedCategory, "Search:", searchQuery)
    let filtered = [...books]

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryObj = categories.find((cat) => cat.id === selectedCategory)
      const categoryName = categoryObj ? categoryObj.name : selectedCategory
      console.log("Filtering by category:", categoryName)

      filtered = filtered.filter((book) => {
        const matches = book.category === categoryName
        if (matches) {
          console.log("Book matches category:", book.title_ar, "->", book.category)
        }
        return matches
      })

      console.log("Books after category filter:", filtered.length)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (book) =>
          book.title_ar.toLowerCase().includes(query) ||
          book.author_ar.toLowerCase().includes(query) ||
          (book.title_en && book.title_en.toLowerCase().includes(query)) ||
          (book.author_en && book.author_en.toLowerCase().includes(query)) ||
          book.category.toLowerCase().includes(query),
      )
      console.log("Books after search filter:", filtered.length)
    }

    setFilteredBooks(filtered)
  }, [searchQuery, selectedCategory, books, categories])

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  const handleBookSelect = (book: Book) => {
    console.log("Book selected for reading:", book)
    setSelectedBook(book)
    setShowSearchResults(false)
  }

  const handleSearchFocus = () => {
    setShowSearchResults(true)
    if (!searchQuery.trim()) {
      setFilteredBooks(books)
    }
  }

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200)
  }

  const handleCloseReader = () => {
    setSelectedBook(null)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleCategorySelect = (categoryId: string) => {
    console.log("Category selected:", categoryId)
    setSelectedCategory(categoryId)
    setSearchQuery("")

    if (selectedBook) {
      setSelectedBook(null)
    }

    if (isMobile) {
      setTimeout(() => {
        setSidebarCollapsed(true)
      }, 150)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSidebarCollapsed(true)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-800 text-white rounded-full mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Loading Library...</h2>
          <p className="text-amber-700">Please wait while we load your books.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50 flex relative">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
          style={{ touchAction: "manipulation" }}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "mr-0" : isMobile ? "mr-0" : "mr-80"}`}
      >
        {!selectedBook ? (
          // Landing Page
          <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-8 md:pt-16">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg"
                style={{ touchAction: "manipulation" }}
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Logo and Branding */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6">
                <img
                  src="/lovable-uploads/92c79d95-bbb5-40d0-9b0f-37bccec10dcd.png"
                  alt="Deen Mastery Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-2">Deen Mastery</h1>
              <p className="text-amber-700 text-base md:text-lg italic">Knowledge Made Accessible</p>
            </div>

            {/* Search Section */}
            <div className="relative w-full max-w-md mb-6 md:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={showArabic ? "البحث في الكتب..." : "Search books..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`w-full px-4 py-3 text-base md:text-lg border-2 border-amber-800 rounded-lg focus:outline-none focus:border-amber-600 bg-white ${
                    showArabic ? "pr-12 pl-4 text-right" : "pl-4 pr-12 text-left"
                  }`}
                  dir={showArabic ? "rtl" : "ltr"}
                />
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5 ${
                    showArabic ? "left-3" : "right-3"
                  }`}
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-800 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.slice(0, 10).map((book, index) => (
                      <div
                        key={book.id || index}
                        onClick={() => handleBookSelect(book)}
                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-amber-200 last:border-b-0"
                      >
                        <div className="font-medium text-amber-900" dir="rtl">
                          {showArabic ? book.title_ar : book.title_en}
                        </div>
                        <div className="text-sm text-amber-700" dir="rtl">
                          {showArabic ? `بقلم ${book.author_ar}` : `by ${book.author_en}`}
                        </div>
                        <div className="text-xs text-amber-600 capitalize">{book.category}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-amber-600">
                      {showArabic ? "لم يتم العثور على كتب" : "No books found"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Available Books Section */}
            <div className="w-full max-w-6xl">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                  {showArabic ? `الكتب المتاحة (${filteredBooks.length})` : `Available Books (${filteredBooks.length})`}
                </h2>
                {selectedCategory !== "all" && (
                  <div className="text-base font-normal text-amber-700 mt-2">
                    {showArabic ? "التصنيف:" : "Category:"}{" "}
                    {categories.find((cat) => cat.id === selectedCategory)?.name}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 mt-4">
                  <span className="text-sm text-amber-700">English</span>
                  <div className="relative">
                    <Switch
                      checked={showArabic}
                      onCheckedChange={setShowArabic}
                      className="data-[state=checked]:bg-amber-600"
                    />
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-600 font-medium">
                      {showArabic ? "العربية" : "EN"}
                    </span>
                  </div>
                  <span className="text-sm text-amber-700">العربية</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredBooks.map((book, index) => {
                  const isFeatured = featuredBooks.some((title) => book.title_ar.includes(title))

                  return (
                    <div
                      key={book.id || index}
                      onClick={() => handleBookSelect(book)}
                      className={`bg-white border-2 rounded-lg p-3 md:p-4 hover:bg-amber-50 cursor-pointer transition-colors shadow-sm ${
                        isFeatured ? "border-amber-400 ring-2 ring-amber-200" : "border-amber-200"
                      }`}
                    >
                      {isFeatured && (
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mb-2 text-center font-medium">
                          ⭐ Featured
                        </div>
                      )}

                      <div className="font-medium text-amber-900 mb-2 text-sm md:text-base min-h-[2.5rem] flex items-start">
                        <div className="leading-tight break-words w-full overflow-wrap-anywhere" dir="rtl">
                          {showArabic ? book.title_ar : book.title_en}
                        </div>
                      </div>

                      <div className="text-xs md:text-sm text-amber-700 mb-2" dir="rtl">
                        {showArabic ? `بقلم ${book.author_ar}` : `by ${book.author_en}`}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-amber-600 uppercase">{book.type}</div>
                        <div className="text-xs text-amber-600 capitalize bg-amber-100 px-2 py-1 rounded max-w-[120px] truncate">
                          {book.category}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredBooks.length === 0 && !loading && (
                <div className="text-center mt-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-amber-700 mb-4">
                    {showArabic
                      ? "لم يتم العثور على كتب للتصنيف أو البحث المحدد."
                      : "No books found for the selected category or search term."}
                  </p>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => handleCategorySelect("all")}
                      className="mt-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      {showArabic ? "عرض جميع الكتب" : "Show all books"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Book Reader Component
          <BookReader book={selectedBook} onClose={handleCloseReader} showArabic={showArabic} />
        )}
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full bg-green-700 text-white flex flex-col transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-16" : "w-80"
        } ${isMobile && sidebarCollapsed ? "translate-x-full" : ""}`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -left-4 top-6 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors z-50"
          style={{ touchAction: "manipulation" }}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
        </button>

        {/* Sidebar Header */}
        <div className={`p-4 md:p-6 border-b border-green-600 ${sidebarCollapsed ? "px-2" : ""}`}>
          <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="bg-white text-green-800 px-3 py-1 rounded text-center text-sm font-medium">
              Browse Categories
            </div>
          )}
        </div>

        {/* Categories Section with Search */}
        {!sidebarCollapsed && (
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            {/* Category Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-green-500 rounded bg-green-600 text-white placeholder-green-200 focus:outline-none focus:border-green-300"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-200 w-4 h-4" />
              </div>
            </div>

            {/* Categories Header with Language Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold">Filter by Category</h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-green-200">EN</span>
                <div className="relative">
                  <Switch
                    checked={showArabic}
                    onCheckedChange={setShowArabic}
                    className="data-[state=checked]:bg-green-800 data-[state=unchecked]:bg-green-600 scale-75"
                  />
                </div>
                <span className="text-xs text-green-200">AR</span>
              </div>
            </div>

            <div className="space-y-2">
              {filteredCategories.map((category) => {
                // Count books in this category
                const bookCount =
                  category.id === "all" ? books.length : books.filter((book) => book.category === category.name).length

                return (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCategorySelect(category.id)
                    }}
                    className={`w-full text-left px-3 py-3 rounded text-sm hover:bg-green-600 transition-colors ${
                      selectedCategory === category.id ? "bg-green-600" : ""
                    }`}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                      touchAction: "manipulation",
                    }}
                  >
                    <div className="flex items-center justify-between pointer-events-none">
                      <div className="flex items-center min-w-0 flex-1">
                        <category.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded ml-2 flex-shrink-0">{bookCount}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {filteredCategories.length === 0 && categorySearchQuery && (
              <div className="text-center text-green-200 mt-4">No categories found for "{categorySearchQuery}"</div>
            )}

            <div className="mt-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">About</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                This digital library offers carefully curated Islamic books and documents. Browse by category or use
                search to find specific titles. All books are available in Arabic with English translations where
                available.
              </p>
            </div>
          </div>
        )}

        {/* Collapsed Categories */}
        {sidebarCollapsed && (
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleCategorySelect(category.id)
                  }}
                  className={`w-full p-3 rounded hover:bg-green-600 transition-colors ${
                    selectedCategory === category.id ? "bg-green-600" : ""
                  }`}
                  title={category.name}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    touchAction: "manipulation",
                  }}
                >
                  <category.icon className="w-5 h-5 mx-auto pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Social Media Links */}
        <div className={`p-4 md:p-6 border-t border-green-600 ${sidebarCollapsed ? "px-2" : ""}`}>
          {!sidebarCollapsed && (
            <>
              <div className="text-xs text-green-200 mb-3">Contact & Social Media</div>
              <div className="flex justify-between gap-2 mb-4">
                <div className="w-16 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                </div>
                <div className="w-16 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <Youtube className="w-4 h-4" />
                </div>
                <div className="w-16 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                <div className="w-16 h-8 bg-sky-500 rounded flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                  <span className="text-xs font-bold">☁</span>
                </div>
              </div>

              <div className="p-3 bg-green-600 rounded">
                <div className="text-xs text-green-200 mb-2">Contact Info</div>
                <div className="text-xs text-white">Email: contact@deenmastery.com</div>
              </div>
            </>
          )}

          {sidebarCollapsed && (
            <div className="space-y-2">
              <div
                className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors mx-auto"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </div>
              <div
                className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors mx-auto"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </div>
              <div
                className="w-8 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors mx-auto"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </div>
              <div
                className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors mx-auto"
                title="Bluesky"
              >
                <span className="text-xs font-bold">☁</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
