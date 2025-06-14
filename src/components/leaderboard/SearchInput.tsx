"use client"

import { Search, X } from "lucide-react"

interface SearchInputProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchInput = ({ searchQuery, setSearchQuery }: SearchInputProps) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center p-4">
        <Search className="w-5 h-5 text-cyan-400 mr-3 group-hover:animate-pulse" />
        <input
          type="text"
          placeholder="Search elite players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-cyan-400/50 outline-none font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="ml-3 p-1 rounded-full hover:bg-cyan-500/20 transition-colors duration-200 group"
          >
            <X className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
          </button>
        )}
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl border border-cyan-400/0 group-focus-within:border-cyan-400/50 transition-all duration-300"></div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl shadow-lg shadow-cyan-500/0 group-focus-within:shadow-cyan-500/20 transition-all duration-300"></div>
    </div>
  </div>
)

export default SearchInput
