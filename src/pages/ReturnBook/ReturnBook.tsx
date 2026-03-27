import React, { useEffect, useState } from "react";
import { User, BookOpen, Calendar, FileText, Save } from "lucide-react";
import Swal from "sweetalert2";

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

  // Load users
  useEffect(() => {
    fetch("https://brave-dedication-production-c20f.up.railway.app/users/userslist")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Load borrowed books for selected user
  useEffect(() => {
    if (selectedUser) {
      fetch(`https://brave-dedication-production-c20f.up.railway.app/borrow/user/${selectedUser}`)
        .then((res) => res.json())
        .then((data) => setBorrowedBooks(data));
      setSelectedBook(null); // reset book when user changes
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
      const res = await fetch("https://brave-dedication-production-c20f.up.railway.app/borrow/return", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.message === "BOOK_RETURNED") {
        Swal.fire("Success", "Book returned successfully", "success");
        setSelectedBook(null);
        setReturnDate("");
        setBorrowedBooks((prev) =>
          prev.filter((b) => b.borrowId !== selectedBook.borrowId)
        );
      } else if (data.message === "BOOK_RETURNED_ON_TIME") {
        Swal.fire("Success", "Book returned on time", "success");
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
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
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
<option key={user.userId} value={user.userId}>
  {user.name} (ID: {user.userId})
</option>
                ))}
              </select>
            </div>

            {/* Book */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                Select Book
              </label>
              <select
                onChange={(e) => {
                  const book = borrowedBooks.find(
                    (b) => b.borrowId === Number(e.target.value)
                  );
                  setSelectedBook(book || null);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                required
              >
                <option value="">Select Book</option>
                {borrowedBooks.map((book) => (
                  <option key={book.borrowId} value={book.borrowId}>
                    {book.title}
                  </option>
                ))}
              </select>
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
              <textarea
                rows={3}
                placeholder={isLate ? "Late return! Fine Will Be Applied!" : "Optional notes"}
                className={`w-full px-4 py-3 rounded-lg border outline-none ${
                  isLate ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
                }`}
                readOnly={isLate} // optional: make read-only if you want admin to apply fine manually
              />
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