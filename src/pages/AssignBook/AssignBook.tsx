import React, { useEffect, useState } from "react";
import { BookOpen, User, Calendar, FileText, Save } from "lucide-react";
import Swal from "sweetalert2";

type UserType = {
  userId: number;
  name: string;
  email: string;
};

type BookType = {
  bookId: number;
  title: string;
};

const AssignBook = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleUserSelect = (u: UserType) => {
    setSelectedUserId(u.userId.toString());
    setUserSearchQuery("");
    setShowUserDropdown(false);
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  const handleBookSelect = (b: BookType) => {
    setSelectedBookId(b.bookId.toString());
    setBookSearchQuery("");
    setShowBookDropdown(false);
  };

  // Fetch users and books on component mount
  useEffect(() => {
    fetch("https://librarymanagement-server-side.onrender.com/users/userslist")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch("https://librarymanagement-server-side.onrender.com/books/bookslist")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // Handle form submission
  const handleAssignBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const borrowRecord = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://librarymanagement-server-side.onrender.com/borrow/assign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(borrowRecord),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      // Handle backend messages
      switch (data.message) {
        case "BOOK_ASSIGNED":
          Swal.fire({
            title: "Success!",
            text: "Book assigned successfully.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
          form.reset();
          setSelectedUserId("");
          setSelectedBookId("");
          break;

        case "BOOK_ALREADY_ASSIGNED":
          Swal.fire({
            title: "Assignment Failed",
            text: "This book is already assigned to this user.",
            icon: "warning",
            confirmButtonColor: "#4f46e5",
          });
          break;

        case "NO_COPIES_AVAILABLE":
          Swal.fire({
            title: "Assignment Failed",
            text: "Cannot assign book: no copies available.",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
          break;

        default:
          Swal.fire({
            title: "Something went wrong",
            text: "Unexpected response from server.",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
          break;
      }
    } catch  {
      Swal.fire({
        title: "Server Error",
        text: "Could not connect to the server.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
            Assign Book
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 ml-9 md:ml-10">
            Assign a book to a library user
          </p>
        </div>

        <form onSubmit={handleAssignBook} className="p-5 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* User Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-indigo-500" />
                Select User
              </label>
              <select
                name="userId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white"
              >
                <option value="">Select a User</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name} (ID: {user.userId})
                  </option>
                ))}
              </select>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Or search user by name..."
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                />
                {showUserDropdown && userSearchQuery && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <li
                          key={user.userId}
                          onMouseDown={() => handleUserSelect(user)}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                        >
                          {user.name} (ID: {user.userId})
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">No users found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Book Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                Select Book
              </label>
              <select
                name="bookId"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white"
              >
                <option value="">Select a Book</option>
                {books.map((book) => (
                  <option key={book.bookId} value={book.bookId}>
                    {book.title} (ID: {book.bookId})
                  </option>
                ))}
              </select>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Or search book by name..."
                  value={bookSearchQuery}
                  onChange={(e) => {
                    setBookSearchQuery(e.target.value);
                    setShowBookDropdown(true);
                  }}
                  onFocus={() => setShowBookDropdown(true)}
                  onBlur={() => setTimeout(() => setShowBookDropdown(false), 200)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                />
                {showBookDropdown && bookSearchQuery && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book) => (
                        <li
                          key={book.bookId}
                          onMouseDown={() => handleBookSelect(book)}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                        >
                          {book.title} (ID: {book.bookId})
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">No books found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Issue Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Return Date
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white"
              />
            </div> */}

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" />
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white"
                placeholder="Optional notes..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="cursor-pointer px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg flex items-center gap-2"
            >
              <Save size={18} />
              Assign Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignBook;