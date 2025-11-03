import React from 'react'

function RegisterPage() {
  return (
    <div> <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl shadow-2xl w-[70%] max-w-4xl flex flex-col md:flex-row overflow-hidden relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={toggleRegister}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            {/* LEFT SIDE – Illustration / Welcome */}
            <div
              style={{
                backgroundImage: `url("https://assets-v2.lottiefiles.com/a/fe0a9612-83f3-11ee-9945-27ca59862aef/gMMelbR6U7.gif")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="md:w-1/2 relative flex flex-col items-center justify-center p-6 text-center border-r border-gray-200"
            >
              {/* White overlay */}
              <div className="absolute inset-0 bg-white/85"></div>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Join <span className="text-indigo-600">PeerConnect</span>{" "}
                  Today!
                </h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Start your journey to connect, collaborate, and grow with
                  mentors and peers around the world.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE – Register Form */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center text-[16px]">
              <img
                src="/icon.png"
                alt="PeerConnect Logo"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">
                Create an Account
              </h3>

              <form className="space-y-4">
                {/* Full Name */}
                <div className="text-left relative">
                  <label className="block text-gray-600 mb-1 text-[16px]">
                    Full Name
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-[16px] focus:ring-1 focus:ring-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="text-left relative">
                  <label className="block text-gray-600 mb-1 text-[16px]">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-[16px] focus:ring-1 focus:ring-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="text-left relative">
                  <label className="block text-gray-600 mb-1 text-[16px]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-1.5 text-[16px] focus:ring-1 focus:ring-slate-400 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="accent-indigo-600 scale-95"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  className="w-full py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-[16px]"
                >
                  Register
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center gap-2 my-4">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              {/* Social Login */}
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

              {/* Login Link */}
              <p className="text-gray-500 mt-5 text-center text-[16px]">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div></div>
  )
}

export default RegisterPage