import React, { useEffect, useState } from "react";
import { User as UserIcon, Pencil, Trash2, Plus, Save } from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

type User = {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 🔹 Load users
  useEffect(() => {
    fetch("http://localhost:8080/users/userslist")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // 🔹 Open Edit Modal
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    const modal = document.getElementById(
      "edit_user_modal"
    ) as HTMLDialogElement;
    modal.showModal();
  };

  // 🔹 Update User
const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!selectedUser) return;

  const formData = new FormData(e.currentTarget);
  const updatedUser: any = Object.fromEntries(formData.entries());

  // 🔹 Close modal immediately
  const modal = document.getElementById(
    "edit_user_modal"
  ) as HTMLDialogElement;
  modal.close();

  try {
    const res = await fetch(
      `http://localhost:8080/users/update/${selectedUser.userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      }
    );

    const data = await res.json();

    if (data.message === "USER_UPDATED") {
      Swal.fire({
        title: "Success!",
        text: "User info updated successfully.",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });

      // 🔹 Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === selectedUser.userId
            ? { ...u, ...updatedUser }
            : u
        )
      );
    } else {
      // If server responds with something other than USER_UPDATED
      Swal.fire({
        title: "Error",
        text: data.message || "Server error",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Error",
      text: "Server error",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  }
};
  // 🔹 Delete User
  const handleDelete = (userId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be removed from the list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:8080/users/delete/${userId}`,
            { method: "DELETE" }
          );

          const data = await res.json();

          if (data.message === "USER_DELETED") {
            Swal.fire("Deleted!", "User removed successfully.", "success");

            // 🔥 Remove from UI instantly
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
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
            <UserIcon className="text-indigo-400 w-6 h-6 md:w-7 md:h-7" />
            Library Users
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4 md:p-6">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Date of Birth</th>
                <th className="px-4 py-3 md:px-6 md:py-3 whitespace-nowrap">Address</th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                  <td className="px-6 py-4">{user.dateOfBirth}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">

                    {/* Edit */}
                    <button
                      onClick={() => handleEditClick(user)}
                      className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(user.userId)}
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

        {/* Add More Users Button */}
        <div className="border-t border-gray-100 px-6 py-5 flex justify-end">
          <Link to="/add-user">
          <button className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md">
            <Plus size={18} />
            Add More Users
          </button>
          </Link>
        </div>
      </div>

      {/* 🔥 EDIT MODAL */}
      <dialog id="edit_user_modal" className="modal">
        <div className="modal-box max-w-3xl p-0 rounded-2xl overflow-hidden">

          <div className="bg-slate-900 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Pencil className="text-indigo-400" size={22} />
              Edit User
            </h2>
            <p className="text-slate-400 text-sm mt-1 ml-9">
              Update user details
            </p>
          </div>

          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedUser?.name}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedUser?.email}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phoneNumber"
                  defaultValue={selectedUser?.phoneNumber}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  defaultValue={selectedUser?.dateOfBirth}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={selectedUser?.address}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  (document.getElementById("edit_user_modal") as HTMLDialogElement).close()
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

export default Users;