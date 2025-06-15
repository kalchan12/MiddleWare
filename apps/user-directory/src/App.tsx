import React from "react";
import "./index.css";
import { User } from "./types";

const userList: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" }
];

export default function UserDirectory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">User Directory</h2>
        <ul className="divide-y divide-blue-100">
          {userList.map((user) => (
            <li key={user.id} className="py-4 flex items-center gap-4 hover:bg-blue-50 rounded-lg transition-colors px-2">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-blue-900">{user.name}</div>
                <div className="text-blue-500 text-sm">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
