import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Book, Lock, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://librarymanagement-server-side.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.message === "LOGIN_SUCCESS") {
        Swal.fire("Success", "Welcome Admin", "success");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        Swal.fire("Error", "Invalid credentials", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server not reachable", "error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-800">
      <div className="relative w-96">
        {/* Floating Book Icon */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full shadow-lg animate-bounce">
          <Book className="text-indigo-600" size={36} />
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white pt-16 pb-10 px-8 rounded-2xl shadow-2xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Admin Login
          </h2>
          <p className="text-center text-gray-500 text-sm">
            Secure access to your library management dashboard
          </p>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all">
            Login
          </button>

          <p className="text-center text-gray-400 text-sm mt-2">
            &copy; {new Date().getFullYear()} Library Management System by NAFEEJ TAMJEED AHMED
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;