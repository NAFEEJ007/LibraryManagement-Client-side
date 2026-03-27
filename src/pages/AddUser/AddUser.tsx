import React from "react";
import { UserPlus, User, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";
import Swal from "sweetalert2";

const AddUser = () => {

  const handleAddUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const newUser = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("https://brave-dedication-production-c20f.up.railway.app/users/add", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      const data = await res.json();

      // Duplicate user check (based on backend response)
      if (data.message === "USER_ALREADY_EXISTS") {
        Swal.fire({
          icon: "warning",
          title: "User Already Exists",
          text: "This member is already registered in the library system.",
          confirmButtonColor: "#4f46e5",
          background: "#ffffff",
          iconColor: "#f59e0b"
        });
        return;
      }

      // Success alert
      Swal.fire({
        icon: "success",
        title: "User Added Successfully",
        text: "The new library member has been registered.",
        confirmButtonColor: "#4f46e5",
        background: "#ffffff",
        iconColor: "#10b981"
      });

      form.reset();

    } catch  {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong while adding the user.",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  return (
    <div className="min-h-full w-full p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <UserPlus className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
            Add New User
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 ml-9 md:ml-10">
            Register a new library member into the system
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleAddUsers} className="p-5 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-indigo-500" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Nafeej Tamjeed"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. nafeej@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone size={16} className="text-indigo-500" /> Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. +880 1871190447"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" /> Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-indigo-500" /> Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="e.g. Sector-12, Road-13, House-18, Uttara, Dhaka-1230"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
            
              type="submit"
              className="cursor-pointer px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Save size={18} />
              Save User Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddUser;