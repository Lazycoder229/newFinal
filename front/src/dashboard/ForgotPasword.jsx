import React from "react";
import { X, Mail } from "lucide-react";

function ForgotPasword({ setShowForgot, setShowLogin }) {
  return (
    <div>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowForgot(false);
        }}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-[90%] max-w-[360px] p-3 relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowForgot(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>

          {/* Content */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
            Forgot Password
          </h3>
          <p className="text-gray-600 text-center mb-3 text-[13px] leading-snug">
            Enter your email and we’ll send you a link to reset it.
          </p>

          <form className="space-y-2.5">
            <div className="text-left relative">
              <label className="block text-gray-600 mb-1 text-[14px]">
                Email Address
              </label>

              <Mail
                size={16}
                className="absolute left-3 top-[35px] text-gray-400 pointer-events-none"
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md pl-8 pr-2 py-1.5 text-[14px] focus:ring-1 focus:ring-slate-400 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all text-[14px]"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-3">
            Remembered your password?{" "}
            <span
              onClick={() => {
                setShowForgot(false);
                setShowLogin(true);
              }}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasword;
