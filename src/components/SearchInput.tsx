import { Search } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchInput = ({ searchQuery, setSearchQuery }: SearchInputProps) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Enter UserName"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-[#2C2F35] rounded-sm h-12 px-4 py-2 pl-10 text-white"
    />
    {!searchQuery && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2">
        <Search color="gray" />
      </span>
    )}
  </div>
);

export default SearchInput;
