import React, { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  Save,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

type Book = {
  bookId: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
};

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Advanced features state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Load books
  useEffect(() => {
    fetch("https://librarymanagement-server-side.onrender.com/books/bookslist")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // Filter books locally
  const filteredBooks = books.filter((book) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    );
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    setIsSearchModalOpen(true);
  };

  // Sorting
  const sortedBooks = [...books].sort((a, b) => {
    if (sortAlphabetically) {
      return a.title.localeCompare(b.title);
    }
    return 0; 
  });

  // Pagination
  const totalPages = Math.ceil(sortedBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Pagination bounds checking
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [books.length, ITEMS_PER_PAGE, totalPages, currentPage, sortAlphabetically]);

  // 🔹 Open Modal
  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    const modal = document.getElementById("edit_modal") as HTMLDialogElement;
    modal.showModal();
  };

  // 🔹 Update Book
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBook) return;

    const formData = new FormData(e.currentTarget);
    const updatedBook: any = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(
        `https://librarymanagement-server-side.onrender.com/books/update/${selectedBook.bookId}`, 
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook),
        },
      );

      const data = await res.json();

      if (data.message === "BOOK_UPDATED") {
        Swal.fire({
          title: "Success!",
          text: "Book info saved successfully.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: "rounded-2xl shadow-xl border border-gray-100",
          },
        });

        // 🔥 Update UI instantly
        setBooks((prev) =>
          prev.map((b) =>
            b.bookId === selectedBook.bookId
              ? {
                  ...b,
                  ...updatedBook,
                  totalCopies: Number(updatedBook.totalCopies),
                  availableCopies: Number(updatedBook.availableCopies),
                }
              : b,
          ),
        );

        // Close modal
        const modal = document.getElementById(
          "edit_modal",
        ) as HTMLDialogElement;
        modal.close();
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Server error",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  //Delete functionality
  const handleDelete = (bookId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This book will be removed from the list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://librarymanagement-server-side.onrender.com/books/delete/${bookId}`,
            { method: "DELETE" },
          );

          const data = await res.json();

          if (data.message === "BOOK_DELETED") {
            Swal.fire("Deleted!", "Book removed successfully.", "success");

            // 🔥 Remove from UI
            setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
          }
        } catch {
          Swal.fire("Error", "Server error", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
            Library Books
          </h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-400"
                  placeholder="Search Books..."
                />
              </form>
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 overflow-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                  {filteredBooks.length > 0 ? (
                    <ul className="space-y-1">
                      {filteredBooks.slice(0, 5).map(book => (
                        <li 
                          key={`sugg-${book.bookId}`}
                          onClick={() => {
                            setSearchQuery(book.title);
                            setShowSuggestions(false);
                            setIsSearchModalOpen(true);
                          }}
                          className="cursor-pointer text-sm px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 truncate"
                        >
                          <span className="font-semibold">{book.title}</span> <span className="text-gray-400 text-xs">by {book.author}</span>
                        </li>
                      ))}
                      {filteredBooks.length > 5 && (
                         <li 
                           className="text-xs text-center p-2 text-indigo-500 hover:bg-slate-50 cursor-pointer border-t border-slate-100 font-medium"
                           onClick={() => handleSearchSubmit()}
                         >
                           See all {filteredBooks.length} matches
                         </li>
                      )}
                    </ul>
                  ) : (
                    <div className="p-3 text-center text-sm text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sort Checkbox */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 whitespace-nowrap">
              <input
                type="checkbox"
                id="sortAlphaBooks"
                checked={sortAlphabetically}
                onChange={(e) => setSortAlphabetically(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="sortAlphaBooks" className="text-sm font-medium text-slate-300 cursor-pointer">
                Sort Alphabetically
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4 md:p-6">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Book Title</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Author</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Category</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">ISBN</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Total Copies</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Available Copies</th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book) => (
                  <tr key={book.bookId} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-800 whitespace-nowrap">
                      {book.title}
                    </td>

                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">{book.author}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">{book.category}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">{book.isbn}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">{book.totalCopies}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">{book.availableCopies}</td>

                    <td className="px-4 py-3 md:px-6 md:py-4 flex justify-center gap-3 whitespace-nowrap">
                      {/* Edit */}
                      <button
                        onClick={() => handleEditClick(book)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(book.bookId)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No books available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                <ChevronLeft size={16} /> Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="border-t border-gray-100 px-6 py-5 flex justify-end">
          <Link to="/add-book">
            <button className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition">
              <Plus size={18} />
              Add More Books
            </button>
          </Link>
        </div>
      </div>

      {/* SEARCH MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Search size={22} className="text-indigo-400" /> Search Results for "{searchQuery}"
              </h2>
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50">
              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <span className="text-4xl mb-4 text-slate-400">🔍</span>
                  <p className="text-lg font-medium text-slate-600">No results match your search</p>
                  <p className="text-sm mt-1 text-slate-400">Try adjusting your keywords.</p>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Book Title</th>
                        <th className="px-6 py-4 font-semibold">Author</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">ISBN</th>
                        <th className="px-6 py-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBooks.map(book => (
                        <tr key={book.bookId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">{book.title}</td>
                          <td className="px-6 py-4 text-gray-600">{book.author}</td>
                          <td className="px-6 py-4 text-gray-600">{book.category}</td>
                          <td className="px-6 py-4 text-gray-600">{book.isbn}</td>
                          <td className="px-6 py-4 flex justify-center gap-3">
                            <button
                              onClick={() => handleEditClick(book)}
                              className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(book.bookId)}
                              className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔥 EDIT MODAL */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-3xl p-0 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Pencil className="text-indigo-400" size={22} />
              Edit Book Info
            </h2>
            <p className="text-slate-400 text-sm mt-1 ml-9">
              Update book details in the catalogue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedBook?.title}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  defaultValue={selectedBook?.author}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={selectedBook?.category}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* ISBN */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  defaultValue={selectedBook?.isbn}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Total Copies */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Total Copies
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  defaultValue={selectedBook?.totalCopies}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Available Copies */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Available Copies
                </label>
                <input
                  type="number"
                  name="availableCopies"
                  defaultValue={selectedBook?.availableCopies}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  (
                    document.getElementById("edit_modal") as HTMLDialogElement
                  ).close()
                }
                className="cursor-pointer px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cursor-pointer px-8 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 transition"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Books;
