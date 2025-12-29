import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const approveDoctor = async (id) => {
    try {
      await API.put(`/admin/${id}/approve`);
      fetchUsers();
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm">
                Role:{" "}
                <span className="font-semibold capitalize">
                  {user.role}
                </span>
              </p>
              {user.role === "doctor" && (
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      user.approved
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {user.approved ? "Approved" : "Pending"}
                  </span>
                </p>
              )}
            </div>

            {user.role === "doctor" && !user.approved && (
              <button
                onClick={() => approveDoctor(user._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
