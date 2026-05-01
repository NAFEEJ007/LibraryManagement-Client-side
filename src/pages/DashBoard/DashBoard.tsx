import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  RotateCcw,
  Users,
  AlertTriangle
} from "lucide-react";

type Stats = {
  totalBooks: number;
  assignedBooks: number;
  returnedBooks: number;
  totalUsers: number;
  finedUsers: number;
};

type IssuedBook = {
  title: string;
  author: string;
  category: string;
  isbn: string;
  dueDate: string;
  borrowerId: number;
  borrowerName: string;
  fine: number;
};
import GlobalSearchBar from "./GlobalSearchBar";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();

  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    assignedBooks: 0,
    returnedBooks: 0,
    totalUsers: 0,
    finedUsers: 0
  });

  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, issuedRes] = await Promise.all([
        fetch("https://librarymanagement-server-side.onrender.com/dashboard/stats"),
        fetch("https://librarymanagement-server-side.onrender.com/dashboard/issued")
      ]);

      const statsData = await statsRes.json();
      const issuedData = await issuedRes.json();

      setStats({
        totalBooks: statsData.totalBooks || 0,
        assignedBooks: statsData.assignedBooks || 0,
        returnedBooks: statsData.returnedBooks || 0,
        totalUsers: statsData.totalUsers || 0,
        finedUsers: statsData.finedUsers || 0
      });
      setIssuedBooks(issuedData || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col gap-4 md:gap-6">

      {/* 🔹 Header */}
      <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6 rounded-2xl shadow-xl flex items-center gap-3">
        <LayoutDashboard className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
        <h2 className="text-xl md:text-2xl font-bold text-white">{t('Dashboard')}</h2>
      </div>

      {/* 🔹 Global Search Bar */}
      <div className="w-full flex md:justify-end">
        <div className="w-full sm:max-w-md">
          <GlobalSearchBar />
        </div>
      </div>

      {/* 🔹 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">

        {/* Total Books */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('Total Books')}</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalBooks}
            </h3>
          </div>
          <BookOpen className="text-indigo-500 opacity-30" size={40} />
        </div>

        {/* Assigned */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('Books Assigned')}</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.assignedBooks}
            </h3>
          </div>
          <ClipboardCheck className="text-indigo-500 opacity-30" size={40} />
        </div>

        {/* Returned */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('Books Returned')}</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.returnedBooks}
            </h3>
          </div>
          <RotateCcw className="text-indigo-500 opacity-30" size={40} />
        </div>

        {/* Users */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('Total Users')}</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalUsers}
            </h3>
          </div>
          <Users className="text-indigo-500 opacity-30" size={40} />
        </div>

        {/* Fined Users */}
        <div className="bg-red-50 p-5 rounded-xl shadow-md border border-red-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-red-500">{t('Fined Users')}</p>
            <h3 className="text-2xl font-bold text-red-600">
              {stats.finedUsers}
            </h3>
          </div>
          <AlertTriangle className="text-red-500 opacity-40" size={40} />
        </div>

      </div>

      {/* 🔹 Issued Books Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-8 py-5">
          <h3 className="text-lg font-semibold text-white">
            {t('Currently Issued Books')}
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              {t('Loading data...')}
            </div>
          ) : issuedBooks.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {t('No issued books found')}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">{t('Book Title')}</th>
                  <th className="px-6 py-3">{t('Author')}</th>
                  <th className="px-6 py-3">{t('Category')}</th>
                  <th className="px-6 py-3">{t('ISBN')}</th>
                  <th className="px-6 py-3">{t('Due Date')}</th>
                  <th className="px-6 py-3">{t('Borrower ID')}</th>
                  <th className="px-6 py-3">{t('Borrower Name')}</th>
                  <th className="px-6 py-3">{t('Fine')}</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {issuedBooks.map((book, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition ${
                      book.fine > 0 ? "bg-red-50" : ""
                    }`}
                  >

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {book.title}
                    </td>

                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.category}</td>
                    <td className="px-6 py-4">{book.isbn}</td>
                    <td className="px-6 py-4">{book.dueDate}</td>
                    <td className="px-6 py-4">{book.borrowerId}</td>
                    <td className="px-6 py-4">{book.borrowerName}</td>

                    {/* 🔥 Fine Column */}
                    <td className="px-6 py-4">
                      {book.fine > 0 ? (
                        <span className="text-red-600 font-semibold bg-red-100 px-3 py-1 rounded-md">
                          ৳{book.fine}
                        </span>
                      ) : (
                        <span className="text-gray-400">{t('N/A')}</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;