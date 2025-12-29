import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  // Approve doctor
  const approveDoctor = async (id) => {
    try {
      await API.put(
        `/admin/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  useEffect(() => {
    if (!token || role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border capitalize">{u.role}</td>
                  <td className="p-2 border">
                    {u.isApproved ? (
                      <span className="text-green-600 font-semibold">
                        Approved
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-2 border">
                    {u.role === "doctor" && !u.isApproved && (
                      <button
                        onClick={() => approveDoctor(u._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
