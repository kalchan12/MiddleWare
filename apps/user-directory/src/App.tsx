import React from "react";
import "./index.css";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

export default function App() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">User Directory</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
