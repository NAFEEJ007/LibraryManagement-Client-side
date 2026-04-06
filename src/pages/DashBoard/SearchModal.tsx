import React from 'react';
import { X, BookOpen, Users } from 'lucide-react';

export type BookResultDto = { id: number, title: string, borrowedBy: string[] };
export type UserResultDto = { id: number, name: string, borrowedBooks: string[] };

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: BookResultDto[];
  users: UserResultDto[];
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, books, users }) => {
  if (!isOpen) return null;

  const hasResults = books.length > 0 || users.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Search Results
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {!hasResults ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-lg font-medium">No results matches your search</p>
              <p className="text-sm mt-1 text-slate-400">Try adjusting your keywords.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 w-1/2 flex-1 font-semibold">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-500" />
                        Books
                      </div>
                    </th>
                    <th className="px-6 py-4 w-1/2 flex-1 font-semibold border-l border-gray-200">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-emerald-500" />
                        Library Users
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  
                  {/* Books Rows */}
                  {books.map(book => (
                    <tr key={`book-${book.id}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{book.title}</span>
                      </td>
                      <td className="px-6 py-4 border-l border-gray-100">
                        {book.borrowedBy.join(', ')}
                      </td>
                    </tr>
                  ))}

                  {/* Users Rows */}
                  {users.map(user => (
                    <tr key={`user-${user.id}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        {user.borrowedBooks.join(', ')}
                      </td>
                      <td className="px-6 py-4 border-l border-gray-100">
                        <span className="font-medium text-slate-800">{user.name}</span>
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
  );
};

export default SearchModal;
