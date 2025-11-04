// PeerConnectLanding.jsx
import React, { useState } from "react";
import {
  Menu,
  X,
  Users,
  MessageCircle,
  Rocket,
  Star,
  Globe,
  HeartHandshake,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";
import LoginPage from "./LoginPage";
import ForgotPasword from "./ForgotPasword";
import RegisterPage from "./RegisterPage";

export default function PeerConnectLanding({ onLoginSuccess }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // NEW: for modal visibility

  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const toggleRegister = () => {
    setShowRegister((s) => !s);
    setShowLogin(false);
    setShowForgot(false);
  };

  const toggleLogin = () => {
    setShowLogin((s) => !s);
    setShowRegister(false);
    setShowForgot(false);
  }; // toggle login modal

  const toggleForgot = () => {
    setShowForgot((s) => !s);
    setShowLogin(false);
    setShowRegister(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="font-sans bg-white text-gray-800">
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="w-full  px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex gap-2">
            <img src="./icon.png" alt="" className="w-9 h-9" />
            <h1 className="text-2xl font-extrabold text-gray-600">
              PeerConnect
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#features" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#trusted" className="hover:text-indigo-600">
              Trusted By
            </a>
            <a href="#how" className="hover:text-indigo-600">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-indigo-600">
              Testimonials
            </a>
          </nav>

          <div className="hidden md:flex lg:flex space-x-3">
            <button
              onClick={toggleLogin}
              className="px-3 py-1 rounded-lg bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-100 transition font-medium"
            >
              Login
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t text-center space-y-4 py-6">
            <a href="#features" className="block hover:text-indigo-600">
              Features
            </a>
            <a href="#trusted" className="block hover:text-indigo-600">
              Trusted By
            </a>
            <a href="#how" className="block hover:text-indigo-600">
              How It Works
            </a>
            <a href="#testimonials" className="block hover:text-indigo-600">
              Testimonials
            </a>
            <div className="pt-4 space-y-3 flex flex-col items-center">
              <button className="px-4 py-1.5 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium">
                Login
              </button>
              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-medium ">
                Register
              </button>
            </div>
          </div>
        )}
      </header>
      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginPage
          toggleLogin={toggleLogin}
          setShowLogin={setShowLogin}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setShowForgot={setShowForgot}
          setShowRegister={setShowRegister}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {/* FORGOT PASSWORD MODAL */}
      {showForgot && (
        <ForgotPasword
          setShowForgot={setShowForgot}
          setShowLogin={setShowLogin}
        />
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <RegisterPage
          toggleRegister={toggleRegister}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setShowRegister={setShowRegister}
          setShowLogin={setShowLogin}
        />
      )}

      {/* ===== FLOATING BACK TO TOP BUTTON ===== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
        style={{ zIndex: 1000 }}
        title="Back to top"
      >
        <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
      </button>

      {/* ===== HERO SECTION ===== */}
      <section
        id="top"
        className="relative pt-40 pb-24 text-center px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/16/71/cf/1671cfd757b99fd756e30f7d7d28bf67.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* === Overlay === */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px]" />

        {/* === Content === */}
        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
            🚀 Join 10,000+ professionals growing together
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Grow, Connect, and Succeed with{" "}
            <span className="text-indigo-600">PeerConnect</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            Join a vibrant community where collaboration meets mentorship. Build
            meaningful connections that accelerate your professional growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg shadow-xl transition-all hover:scale-105"
            >
              Get Started Free
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            No credit card required • Free forever plan
          </p>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section
        id="features"
        className="relative py-24 bg-white text-center px-6 overflow-hidden"
      >
        {/* Floating Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <Users className="absolute top-20 left-20 w-16 h-16 text-indigo-600 animate-float" />
          <MessageCircle className="absolute top-40 right-32 w-20 h-20 text-purple-600 animate-float animation-delay-2000" />
          <Rocket className="absolute bottom-32 left-1/4 w-24 h-24 text-indigo-600 animate-float animation-delay-4000" />
          <Star className="absolute bottom-20 right-20 w-16 h-16 text-pink-600 animate-float animation-delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-4 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Features
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Everything you need to succeed
          </h3>
          <p className="text-gray-600 text-base mb-16 max-w-2xl mx-auto">
            Powerful tools designed to help you connect, collaborate, and grow
            with your peers and mentors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-10 h-10 text-indigo-600" />}
              title="Collaborative Spaces"
              desc="Work together in real-time with mentors and peers through dedicated project hubs."
            />
            <FeatureCard
              icon={<MessageCircle className="w-10 h-10 text-indigo-600" />}
              title="Seamless Communication"
              desc="Chat, share resources, and brainstorm with others in a simple, focused interface."
            />
            <FeatureCard
              icon={<Rocket className="w-10 h-10 text-indigo-600" />}
              title="Skill Growth Tracking"
              desc="Track your mentorship goals and measure your growth with personalized dashboards."
            />
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section id="trusted" className="py-20 bg-gray-50 text-center px-6">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-8 font-semibold">
          Trusted by innovators worldwide
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 text-gray-400 text-xl font-bold">
          {/* TechNova */}
          <div className="flex flex-col items-center hover:text-indigo-600 transition cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQcBmJYUYj67mXeSfDXSDJ5Q8TpVUbAsmQpg&s"
              alt="TechNova"
              className="w-20 h-20 object-contain mb-2 rounded-md shadow-sm"
            />
            <span>TechNova</span>
          </div>

          {/* GlobalMentor */}
          <div className="flex flex-col items-center hover:text-indigo-600 transition cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQnC3VwvHzLddQIv8-hqiJztNfJ-VreSMsFQ&s"
              alt="GlobalMentor"
              className="w-20 h-20 object-contain mb-2 rounded-md shadow-sm"
            />
            <span>GlobalMentor</span>
          </div>

          {/* CodeBridge */}
          <div className="flex flex-col items-center hover:text-indigo-600 transition cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJbesWIPRjm_bzedh-MYL6SVvaQTslBY8ew&s"
              alt="CodeBridge"
              className="w-20 h-20 object-contain mb-2 rounded-md shadow-sm"
            />
            <span>CodeBridge</span>
          </div>

          {/* LearnHub */}
          <div className="flex flex-col items-center hover:text-indigo-600 transition cursor-pointer">
            <img
              src="https://play-lh.googleusercontent.com/IBaZ31no6FhVpsrJGxatb9MA3azJYsDlrvB1PNig6qL8VA2tmzlARiav4GHHkzgfdKY"
              alt="LearnHub"
              className="w-20 h-20 object-contain mb-2 rounded-md shadow-sm"
            />
            <span>LearnHub</span>
          </div>

          {/* EduLink (no image yet) */}
          <div className="flex flex-col items-center hover:text-indigo-600 transition cursor-pointer">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="EduLink"
              className="w-20 h-20 object-contain mb-2 rounded-md shadow-sm"
            />
            <span>EduLink</span>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        id="how"
        className="py-24 text-center px-6 bg-white relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://www.beyonddesign.com/wp-content/uploads/2016/02/febanimation1.gif')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="relative max-w-6xl mx-auto">
          <div className="mb-4 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Process
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Get started in 3 simple steps
          </h3>
          <p className="text-gray-600 text-base mb-16 max-w-2xl mx-auto">
            Join thousands of professionals who are already growing their
            careers through meaningful connections.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              icon={<Globe className="w-8 h-8 text-white" />}
              title="Join the Network"
              desc="Sign up and become part of the growing PeerConnect community."
            />
            <StepCard
              icon={<HeartHandshake className="w-8 h-8 text-white" />}
              title="Find a Mentor or Peer"
              desc="Browse profiles to find mentors or peers who match your learning goals."
            />
            <StepCard
              icon={<ArrowRight className="w-8 h-8 text-white" />}
              title="Start Collaborating"
              desc="Engage, share, and grow together through meaningful collaboration."
            />
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-center px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Loved by our community
          </h3>
          <p className="text-gray-600 text-base mb-16 max-w-2xl mx-auto">
            See what our users have to say about their experience with
            PeerConnect.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Alex Johnson"
              feedback="PeerConnect helped me find an amazing mentor who guided my career shift into tech."
            />
            <TestimonialCard
              name="Maria Lopez"
              feedback="The collaboration tools are intuitive and make teamwork enjoyable and productive!"
            />
            <TestimonialCard
              name="James Lee"
              feedback="I met like-minded peers and grew my portfolio through real mentorship projects."
            />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="text-2xl font-bold text-white mb-3">PeerConnect</h4>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Empowering collaboration and mentorship — one connection at a time.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="hover:text-indigo-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-indigo-400 transition">
              Contact
            </a>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 PeerConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ==== REUSABLE COMPONENTS ====
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
      <div className="flex justify-center mb-6 bg-indigo-50 w-16 h-16 rounded-xl items-center mx-auto">
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function StepCard({ icon, title, desc }) {
  return (
    <div className="relative bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
      <div className="flex justify-center mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-full items-center mx-auto text-white shadow-lg">
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, feedback }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 text-left border border-gray-100">
      <div className="flex gap-1 mb-4">
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      </div>
      <p className="text-gray-700 mb-6 leading-relaxed text-base">
        "{feedback}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
          {name.charAt(0)}
        </div>
        <h5 className="font-bold text-gray-900">{name}</h5>
      </div>
    </div>
  );
}
