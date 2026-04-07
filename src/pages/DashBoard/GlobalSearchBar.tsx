import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import SearchModal from './SearchModal';
import type { BookResultDto, UserResultDto } from './SearchModal';

const GlobalSearchBar = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [books, setBooks] = useState<BookResultDto[]>([]);
  const [users, setUsers] = useState<UserResultDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{books: BookResultDto[], users: UserResultDto[]}>({ books: [], users: [] });

  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce the input query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setBooks([]);
      setUsers([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        let response;
        try {
          response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(debouncedQuery)}`);
          if (!response.ok) throw new Error("Local API failed.");
        } catch (localError) {
          // Fallback to production URL if local fails (temporary approach to handle different environments smoothly)
          response = await fetch(`https://librarymanagement-server-side.onrender.com/api/search?q=${encodeURIComponent(debouncedQuery)}`);
          if (!response.ok) throw new Error("Production API failed.");
        }
        
        const data = await response.json();
        setBooks(data.books || []);
        setUsers(data.users || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [debouncedQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowDropdown(false);
    setModalData({ books, users });
    setIsModalOpen(true);
  };

  const handleSuggestionClick = (type: 'book' | 'user', id: number) => {
    setShowDropdown(false);
    // Show only the selected result in the modal
    if (type === 'book') {
      const selectedBook = books.find(b => b.id === id);
      setModalData({ books: selectedBook ? [selectedBook] : [], users: [] });
    } else {
      const selectedUser = users.find(u => u.id === id);
      setModalData({ books: [], users: selectedUser ? [selectedUser] : [] });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow shadow-sm"
          placeholder="Search books, users..."
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
          </div>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (books.length > 0 || users.length > 0) && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-xl py-2 overflow-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
          
          {books.length > 0 && (
            <div className="px-3 pb-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Books</h3>
              <ul className="space-y-1">
                {books.slice(0, 5).map(book => (
                  <li 
                    key={`book-sugg-${book.id}`}
                    onClick={() => handleSuggestionClick('book', book.id)}
                    className="cursor-pointer text-sm px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors truncate"
                  >
                    📖 {book.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {books.length > 0 && users.length > 0 && <div className="border-t border-gray-100 my-2"></div>}

          {users.length > 0 && (
            <div className="px-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Users</h3>
              <ul className="space-y-1">
                {users.slice(0, 5).map(user => (
                  <li 
                    key={`user-sugg-${user.id}`}
                    onClick={() => handleSuggestionClick('user', user.id)}
                    className="cursor-pointer text-sm px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md transition-colors truncate"
                  >
                    👤 {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Search Results Modal */}
      <SearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        books={modalData.books}
        users={modalData.users}
      />
    </div>
  );
};

export default GlobalSearchBar;
