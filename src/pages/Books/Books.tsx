import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  Save,
} from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

type Book = {
  bookId: number; // ✅ FIXED
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

  // 🔹 Load books
  useEffect(() => {
    fetch("http://localhost:8080/books/bookslist")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

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
        `http://localhost:8080/books/update/${selectedBook.bookId}`, // ✅ FIXED
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
            `http://localhost:8080/books/delete/${bookId}`,
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
    <div className="h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
            Library Books
          </h2>
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
              {books.map((book) => (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Button */}
        <div className="border-t border-gray-100 px-6 py-5 flex justify-end">
          <Link to="/add-book">
          <button className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus size={18} />
            Add More Books
          </button>
          </Link>
        </div>
      </div>

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
                className="cursor-pointer px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cursor-pointer px-8 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
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
