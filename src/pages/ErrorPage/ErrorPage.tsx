import React from "react";
import { BookOpen, ArrowLeft, RefreshCw } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">

      {/* 🔥 Floating Books Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-floatSlow absolute top-10 left-10 opacity-10">
          <BookOpen size={120} />
        </div>
        <div className="animate-float absolute bottom-20 right-20 opacity-10">
          <BookOpen size={100} />
        </div>
        <div className="animate-floatFast absolute top-1/2 left-1/3 opacity-10">
          <BookOpen size={90} />
        </div>
      </div>

      {/* 🔥 Main Card */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-500/10 p-4 rounded-full">
            <BookOpen className="text-indigo-400" size={40} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-3 tracking-wide">
          Something went wrong
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">

          {/* Go Back */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* Retry */}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
          >
            <RefreshCw size={18} />
            Retry
          </button>

        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 mt-8">
          Library Management System • Keep Learning 📖
        </p>
      </div>

      {/* 🔥 Custom Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }

          @keyframes floatFast {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-floatSlow {
            animation: floatSlow 10s ease-in-out infinite;
          }

          .animate-floatFast {
            animation: floatFast 4s ease-in-out infinite;
          }
        `}
      </style>

    </div>
  );
};

export default ErrorPage;