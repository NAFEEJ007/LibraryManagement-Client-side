import React, { useEffect, useState } from "react";
import { User, BookOpen, Calendar, FileText, Save } from "lucide-react";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type UserType = {
  userId: number;
  name: string;
};

type BorrowedBook = {
  borrowId: number;
  bookId: number;
  title: string;
  dueDate: string;
};

const ReturnBook = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState<BorrowedBook | null>(null);
  const [returnDate, setReturnDate] = useState("");

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const [notes, setNotes] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.userId.toString().includes(userSearchQuery)
  );

  const handleUserSelect = (u: UserType) => {
    setSelectedUser(u.userId.toString());
    setUserSearchQuery(`${u.name} (ID: ${u.userId})`);
    setShowUserDropdown(false);
  };

  const filteredBorrowedBooks = borrowedBooks.filter((b) =>
    b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || b.borrowId.toString().includes(bookSearchQuery)
  );

  const handleBookSelect = (b: BorrowedBook) => {
    setSelectedBook(b);
    setBookSearchQuery(`${b.title} (ID: ${b.borrowId})`);
    setShowBookDropdown(false);
  };

  // Load users
  useEffect(() => {
    fetch("https://librarymanagement-server-side.onrender.com/users/userslist")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Load borrowed books for selected user
  useEffect(() => {
    if (selectedUser) {
      fetch(`https://librarymanagement-server-side.onrender.com/borrow/user/${selectedUser}`)
        .then((res) => res.json())
        .then((data) => setBorrowedBooks(data));
      setSelectedBook(null); // reset book when user changes
      setBookSearchQuery("");
      setReturnDate("");
    }
  }, [selectedUser]);

  // ✅ Compute late dynamically
  const isLate = selectedBook && returnDate
    ? new Date(returnDate) > new Date(selectedBook.dueDate)
    : false;

  const handleReturn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBook || !returnDate) return;

    const payload = {
      borrowId: selectedBook.borrowId,
      returnDate,
    };

    try {
      const res = await fetch("https://librarymanagement-server-side.onrender.com/borrow/return", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.message === "BOOK_RETURNED") {
        Swal.fire("Success", "Book returned successfully", "success");
        setSelectedBook(null);
        setReturnDate("");
        setBookSearchQuery("");
        setNotes("");
        setBorrowedBooks((prev) =>
          prev.filter((b) => b.borrowId !== selectedBook.borrowId)
        );
      } else if (data.message === "BOOK_RETURNED_ON_TIME") {
        Swal.fire("Success", "Book returned on time", "success");
        setSelectedBook(null);
        setReturnDate("");
        setBookSearchQuery("");
        setNotes("");
        setBorrowedBooks((prev) =>
          prev.filter((b) => b.borrowId !== selectedBook.borrowId)
        );
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="min-h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
            Return Book
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 ml-9 md:ml-10">
            Process book return from borrower
          </p>
        </div>

        <form onSubmit={handleReturn} className="p-5 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* User */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-indigo-500" />
                Select User
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search and select user..."
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    if (selectedUser) setSelectedUser("");
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white text-sm"
                  required={!selectedUser}
                />
                {showUserDropdown && (
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

            {/* Book */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                Select Book
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search and select book..."
                  value={bookSearchQuery}
                  onChange={(e) => {
                    setBookSearchQuery(e.target.value);
                    if (selectedBook) setSelectedBook(null);
                    setShowBookDropdown(true);
                  }}
                  onFocus={() => setShowBookDropdown(true)}
                  onBlur={() => setTimeout(() => setShowBookDropdown(false), 200)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 hover:bg-white text-sm"
                  required={!selectedBook}
                  disabled={!selectedUser}
                />
                {showBookDropdown && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                    {filteredBorrowedBooks.length > 0 ? (
                      filteredBorrowedBooks.map((book) => (
                        <li
                          key={book.borrowId}
                          onMouseDown={() => handleBookSelect(book)}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                        >
                          {book.title} (Borrow ID: {book.borrowId})
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">No borrowed books found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Due Date */}
            {selectedBook && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Due Date</label>
                <input
                  value={selectedBook.dueDate}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-100"
                />
              </div>
            )}

            {/* Return Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" />
                Notes
              </label>
              <div className={`bg-white rounded-lg border ${isLate ? "border-red-500" : "border-gray-300"}`}>
                <ReactQuill 
                  theme="snow" 
                  value={notes} 
                  onChange={setNotes} 
                  placeholder={isLate ? "Late return! Fine Will Be Applied!" : "Optional notes"}
                  readOnly={isLate}
                  className={isLate ? "bg-red-50" : "bg-white"}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 flex justify-end">
            <button className="cursor-pointer px-8 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
              <Save size={18} />
              Return Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBook;