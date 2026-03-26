import React from 'react';
import { Book, User, Tag, Hash, Layers, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const AddBook = () => {

    const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const newBook = Object.fromEntries(formData.entries());



        try {
            const response = await fetch('http://localhost:8080/books/add', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newBook)
            });

            const data = await response.json();

            if (data.message === 'BOOK_ALREADY_EXISTS') {
                Swal.fire({
                    title: 'Operation Failed',
                    text: 'A book with this ISBN already exists.',
                    icon: 'warning',
                    confirmButtonColor: '#4f46e5',
                    customClass: { popup: 'rounded-2xl shadow-xl border border-gray-100' }
                });
                return;
            }

            Swal.fire({
                title: 'Success!',
                text: 'The book has been added to the catalogue.',
                icon: 'success',
                confirmButtonColor: '#4f46e5',
                customClass: { popup: 'rounded-2xl shadow-xl border border-gray-100' }
            });

            form.reset();

        } catch  {
           
            Swal.fire({
                title: 'Server Error',
                text: 'Could not connect to the server. Please try again later.',
                icon: 'error',
                confirmButtonColor: '#ef4444',
                customClass: { popup: 'rounded-2xl shadow-xl' }
            });
        }
    };

    return (
        <div className="h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
            <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Book className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
                        Add New Book
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm mt-1 ml-9 md:ml-10">Register a new book into the library catalogue</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleAddBook} className="p-5 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Book size={16} className="text-indigo-500" /> Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
                                placeholder="e.g. The Great Gatsby"
                                required
                            />
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" /> Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
                                placeholder="e.g. F. Scott Fitzgerald"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Tag size={16} className="text-indigo-500" /> Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
                                placeholder="e.g. Fiction"
                                required
                            />
                        </div>

                        {/* ISBN */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Hash size={16} className="text-indigo-500" /> ISBN
                            </label>
                            <input
                                type="text"
                                name="isbn"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
                                placeholder="e.g. 978-3-16-148410-0"
                                required
                            />
                        </div>

                        {/* Total Copies */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Layers size={16} className="text-indigo-500" /> Total Copies
                            </label>
                            <input
                                type="number"
                                name="totalCopies"
                                min={0}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
                                placeholder="e.g. 10"
                                required
                            />
                        </div>

                        {/* Available Copies */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Layers size={16} className="text-indigo-500" /> Available Copies
                            </label>
                            <input
                                type="number"
                                name="availableCopies"
                                min={0}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
                                placeholder="e.g. 10"
                                required
                            />
                        </div>

                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="cursor-pointer px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                            <Save size={18} />
                            Save Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBook;