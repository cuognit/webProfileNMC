import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import ContactForm from "./components/ContactForm";
import AdminPanel from "./components/AdminPanel";
import { UserSession } from "./types";
import { Github, Linkedin, Mail, Heart, Shield } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>("home");
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  const [adminSession, setAdminSession] = React.useState<UserSession>({
    username: "",
    isAuthenticated: false,
  });

  // Verify token on application start
  React.useEffect(() => {
    const savedToken = localStorage.getItem("cuong_portfolio_token");
    if (savedToken) {
      const verifyToken = async () => {
        try {
          const res = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setAdminSession({
              username: data.username,
              isAuthenticated: true,
              token: savedToken,
            });
          } else {
            localStorage.removeItem("cuong_portfolio_token");
          }
        } catch (err) {
          console.error("Token verification failed on start: ", err);
        }
      };
      verifyToken();
    }

    // Sync theme settings with localStorage
    const savedTheme = localStorage.getItem("cuong_portfolio_theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Monitor and apply dark theme classes to HTML document
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("cuong_portfolio_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("cuong_portfolio_theme", "light");
    }
  }, [darkMode]);

  const handleLoginSuccess = (session: UserSession) => {
    setAdminSession(session);
    setActiveTab("admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("cuong_portfolio_token");
    setAdminSession({ username: "", isAuthenticated: false });
    setActiveTab("home");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50 selection:bg-indigo-600 selection:text-white">
      <div>
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminSession={adminSession}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Global Banner and Main page grid area */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative">
            {activeTab === "home" && (
              <div className="animate-in fade-in duration-300">
                <Hero onNavigate={(tab) => setActiveTab(tab)} />
              </div>
            )}
            {activeTab === "projects" && (
              <div className="animate-in fade-in duration-300">
                <Projects />
              </div>
            )}
            {activeTab === "blog" && (
              <div className="animate-in fade-in duration-300">
                <Blog />
              </div>
            )}
            {activeTab === "contact" && (
              <div className="animate-in fade-in duration-300">
                <ContactForm />
              </div>
            )}
            {activeTab === "admin" && (
              <div className="animate-in fade-in duration-300">
                <AdminPanel
                  adminSession={adminSession}
                  onLoginSuccess={handleLoginSuccess}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer Area */}
      <footer className="mt-16 border-t border-neutral-200 bg-white py-12 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  Cường Nguyễn
                </span>
                <span className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                <span className="text-xs font-semibold text-neutral-500 tracking-wider font-mono">
                  FULLSTACK ENGINEER
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-sm">
                Thiết kế giải pháp lập trình mạng toàn diện, kiến trúc dữ liệu tối ưu hóa SEO và đồng hành chuyển đổi số chuyên nghiệp.
              </p>
            </div>

            {/* Quick footer social links */}
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <button
                onClick={() => setActiveTab("contact")}
                className="p-2 rounded-lg text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Email liên hệ"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-450 dark:text-neutral-400">
            <div className="flex items-center space-x-1 justify-center">
              <span>© {new Date().getFullYear()} Cường Nguyễn Portfolio. Bản quyền thuộc về tác giả.</span>
            </div>
            
            <div className="flex items-center space-x-1 text-[11px] font-mono hover:text-indigo-500 cursor-pointer">
              <Shield className="h-3.5 w-3.5" />
              <span onClick={() => setActiveTab("admin")}>Khu vực quản trị tác giả bảo mật</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
