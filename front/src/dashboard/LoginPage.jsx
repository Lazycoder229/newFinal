import { React, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Eye, EyeOff, Mail, Lock } from "lucide-react";

function LoginPage({
  toggleLogin,
  setShowLogin,
  showPassword,
  setShowForgot,
  setShowPassword,
  setShowRegister,
  onLoginSuccess,
}) {
  const AUTH_URL = "http://localhost:3000/api/auth/login";

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Function to redirect based on user role
  const redirectToDashboard = (role) => {
    switch (role) {
      case "Admin":
        window.location.href = "/admin-dashboard";
        break;
      case "Mentor":
        window.location.href = "/mentor-dashboard";
        break;
      case "Mentee":
        window.location.href = "/mentee-dashboard";
        break;

        break;
      default:
        window.location.href = "/dashboard";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[70%] max-w-4xl flex flex-col md:flex-row overflow-hidden relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={toggleLogin}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {/* LEFT SIDE – Branding (White/Slate Background) */}
        <div
          style={{
            backgroundImage: `url("https://assets-v2.lottiefiles.com/a/fe0a9612-83f3-11ee-9945-27ca59862aef/gMMelbR6U7.gif")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="md:w-1/2 relative bg-slate-100 flex flex-col items-center justify-center p-6 text-center border-r border-gray-200 text-[16px]"
        >
          {/* White overlay */}
          <div className="absolute inset-0 bg-white/85"></div>

          {/* Content (make sure it's above the overlay) */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to <span className="text-indigo-600">PeerConnect!</span>
            </h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              Connect, learn, and grow with mentors and peers who inspire you.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – Login Form */}
        <div className="md:w-1/2 w-full p-6 flex flex-col justify-center text-[16px]">
          <img
            src="/icon.png"
            alt="PeerConnect Logo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">
            Login to Your Account
          </h3>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setServerError("");
              const errors = {};
              if (!form.email) errors.email = "Email is required";
              else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                errors.email = "Enter a valid email";
              if (!form.password) errors.password = "Password is required";
              setFormErrors(errors);
              if (Object.keys(errors).length) return;

              try {
                setSubmitting(true);
                const res = await axios.post(AUTH_URL, {
                  email: form.email,
                  password: form.password,
                  remember: form.remember,
                });

                // Store token and user in storage
                const storage = form.remember
                  ? window.localStorage
                  : window.sessionStorage;

                if (res.data && res.data.token) {
                  storage.setItem("auth_token", res.data.token);
                }
                if (res.data && res.data.user) {
                  storage.setItem("user", JSON.stringify(res.data.user));
                }
                if (res.data && res.data.role) {
                  storage.setItem("user_role", res.data.role);
                }

                // Show success toast
                toast.success("Login successful! Redirecting...", {
                  autoClose: 1500,
                });

                // Delay redirect to show toast
                setTimeout(() => {
                  // Get role from response (check both user.role and role)
                  const userRole =
                    res.data.role || res.data.user?.role || "Mentee";

                  // Redirect based on role
                  redirectToDashboard(userRole);

                  // Also call onLoginSuccess if provided
                  if (typeof onLoginSuccess === "function") {
                    onLoginSuccess(res.data);
                  }
                }, 1500);
              } catch (err) {
                console.error("Login error", err);
                if (
                  err.response &&
                  err.response.data &&
                  err.response.data.error
                ) {
                  setServerError(err.response.data.error);
                  toast.error(err.response.data.error);
                } else if (err.response && err.response.status === 404) {
                  toast.error("Auth endpoint not found");
                  setServerError(
                    "Server configuration error. Please contact support."
                  );
                } else if (err.response && err.response.status === 401) {
                  setServerError("Invalid email or password");
                  toast.error("Invalid email or password");
                } else {
                  setServerError("Login failed. Please try again.");
                  toast.error("Login failed. Please try again.");
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {/* Email */}
            <div className="space-y-4">
              {/* Email */}
              <div className="text-left relative">
                <label
                  htmlFor="login_email"
                  className="block text-gray-600 mb-1 text-[16px]"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="login_email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={`w-full border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg pl-9 pr-3 py-1.5 text-[16px] focus:ring-2 focus:ring-indigo-300 outline-none`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="text-left relative">
                <label
                  htmlFor="login_password"
                  className="block text-gray-600 mb-1 text-[16px]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="login_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={`w-full border ${
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg pl-9 pr-10 py-1.5 text-[16px] focus:ring-2 focus:ring-indigo-300 outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
            </div>
            {/* Remember me + Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-600 text-[16px]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-indigo-600 scale-95"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowLogin(false);
                  setShowForgot(true);
                }}
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            {serverError && (
              <p className="text-red-600 text-sm">{serverError}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-[16px]"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-1.5 hover:bg-gray-50 transition text-[16px]">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4"
              />
              Continue with Google
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-1.5 hover:bg-gray-50 transition text-[16px]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                alt="LinkedIn"
                className="w-4 h-4"
              />
              Continue with LinkedIn
            </button>
          </div>

          {/* Register link */}
          <p className="text-gray-500 mt-5 text-center text-[16px]">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
