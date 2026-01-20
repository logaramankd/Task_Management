import { useState } from "react";
import AuthTabs from "../components/AuthTabs";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 font-semibold ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 font-semibold ${
              activeTab === "signup"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Signup
          </button>
        </div>

        <AuthTabs type={activeTab} />
      </div>
    </div>
  );
}
