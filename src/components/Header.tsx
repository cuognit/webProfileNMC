import React from "react";
import { UserSession } from "../types";
import { Menu, X, Code2, Briefcase, BookOpen, Mail, ShieldAlert, LogOut, Moon, Sun } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminSession: UserSession;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  adminSession,
  onLogout,
  darkMode,
  setDarkMode,
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: "home", label: "Trang Chủ", icon: Code2 },
    { id: "projects", label: "Dự Án", icon: Briefcase },
    { id: "blog", label: "Blog Cá Nhân", icon: BookOpen },
    { id: "contact", label: "Liên Hệ", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo container */}
        <div 
          onClick={() => setActiveTab("home")} 
          className="flex cursor-pointer items-center space-x-2"
          id="header-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md transition-transform hover:scale-105">
            <span className="font-mono text-lg font-bold">C</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Cường Nguyễn
            </span>
            <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
              PORTFOLIO
            </span>
          </div>
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex items-center space-x-1 outline-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 mx-2" />

          {/* Admin tab conditional trigger */}
          <button
            id="nav-admin"
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "admin"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{adminSession.isAuthenticated ? "Quản Trị" : "Admin"}</span>
          </button>
        </nav>

        {/* Header Right buttons (Theme slider, Admin state, Mobile trigger) */}
        <div className="flex items-center space-x-3">
          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
            id="theme-toggle"
            title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Admin Session indicators */}
          {adminSession.isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-800 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Chào, {adminSession.username}</span>
              <button 
                onClick={onLogout} 
                className="ml-2 p-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-full text-rose-600 transition-colors"
                title="Đăng xuất quản lý"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Mobile navigation menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
            id="mobile-menu-trigger"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-150 bg-white py-3 px-4 shadow-xl transition-colors dark:border-neutral-800 dark:bg-neutral-900">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-2" />
            
            <button
              id="mobile-nav-admin"
              onClick={() => {
                setActiveTab("admin");
                setIsOpen(false);
              }}
              className={`flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <span>{adminSession.isAuthenticated ? "Bảng Quản Trị Admin" : "Đăng Nhập Admin"}</span>
            </button>

            {adminSession.isAuthenticated && (
              <div className="mt-4 flex items-center justify-between border-t border-neutral-150 pt-3 dark:border-neutral-800">
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg">
                  Admin: {adminSession.username}
                </span>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
