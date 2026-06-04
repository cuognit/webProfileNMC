import React from "react";
import { ArrowRight, Code, Terminal, Brain, Coffee, Github, Linkedin, MessageSquareCode } from "lucide-react";

interface HeroProps {
  onNavigate: (tab: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const stats = [
    { label: "Kinh nghiệm thực chiến", value: "4+ Năm", icon: Terminal, color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400" },
    { label: "Dự án hoàn thành", value: "25+", icon: Code, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400" },
    { label: "Kiến thức chia sẻ", value: "50+ Bài viết", icon: Brain, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400" },
    { label: "Đã uống vô hạn", value: "1200+ Ly cà phê", icon: Coffee, color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-12">
      {/* Cover Banner and Profile Overlap */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        
        {/* Banner image background */}
        <div className="h-48 w-full sm:h-64 md:h-80 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=450&q=80"
            alt="Nguyen Van Cuong Banner"
            className="h-full w-full object-cover opacity-80 brightness-[0.7] transition-all duration-700 hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
          {/* Cover gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="relative px-6 pb-8 pt-0 sm:px-8 sm:pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-6 -mt-16 sm:-mt-24 mb-6">
            
            {/* Avatar circle */}
            <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-xl dark:border-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
                alt="Nguyen Van Cuong Developer Avatar"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Profile titles */}
            <div className="mt-4 sm:mt-0 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Nguyễn Văn Cường
                  </h1>
                  <p className="mt-1 text-lg font-medium text-emerald-400 dark:text-emerald-400 font-mono">
                    Full-Stack Web Engineer & Content Creator
                  </p>
                </div>
                
                {/* Social icons */}
                <div className="mt-4 sm:mt-0 flex justify-center space-x-3">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all shadow-md"
                    title="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all shadow-md"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <button 
                    onClick={() => onNavigate("contact")}
                    className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md animate-pulse"
                    title="Kết nối nhanh"
                  >
                    <MessageSquareCode className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-800 my-6" />

          {/* Intro description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white">Về Bản Thân Tôi</h2>
              <p className="text-neutral-300 text-base leading-relaxed">
                Xin chào! Tôi là <strong className="text-white">Cường</strong>, một kỹ sư phát triển phần mềm toàn diện (Full-Stack). Trực thuộc thành phố Hồ Chí Minh, tôi đam mê kiến tạo các sản phẩm công nghệ có trải nghiệm người dùng tinh tế và cấu trúc mã nguồn tối ưu chuẩn mực.
              </p>
              <p className="text-neutral-300 text-base leading-relaxed">
                Thế mạnh chuyên môn của tôi tập trung vào hệ sinh thái <strong className="text-white">React, Node.js (Express), TypeScript</strong> và các quy trình tự động hóa kiểm định SEO hiệu dụng. Bên cạnh lập trình, tôi thường xuyên viết blog kỹ thuật để chia sẻ kinh nghiệm vận hành hệ thống phần mềm hiệu suất cao cho cộng đồng lập trình trẻ Việt Nam.
              </p>
            </div>
            
            {/* Tech stack box */}
            <div className="bg-neutral-850 p-5 rounded-xl border border-neutral-800 space-y-3 shadow-inner">
              <h3 className="text-sm font-bold tracking-wider text-neutral-400 uppercase font-mono">
                Ngôn ngữ và Công nghệ
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {["JavaScript", "TypeScript", "React / Next.js", "Node.js", "Express", "Tailwind CSS", "RESTful API", "Git & CI/CD", "SEO Optimization"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-indigo-500 hover:text-white transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-4 p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Quick navigation controls */}
      <div className="p-8 rounded-2xl bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 bottom-0 h-48 w-48 bg-indigo-500 rounded-full blur-3xl opacity-50 pulse-glow" />
        
        <div className="space-y-2 z-10 text-center md:text-left">
          <h3 className="text-2xl font-extrabold tracking-tight">Sẵn sàng hợp tác xây dựng sản phẩm tiếp theo?</h3>
          <p className="text-indigo-100 text-sm max-w-xl">
            Hãy ghé thăm các sản phẩm tôi đã từng triển khai hoặc gửi đề nghị hợp tác trực tiếp để chúng ta cùng đưa dự án của bạn cất cánh.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={() => onNavigate("projects")}
            className="flex items-center justify-center space-x-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all active:scale-95"
          >
            <span>Khám phá dự án</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onNavigate("contact")}
            className="flex items-center justify-center space-x-2 bg-indigo-700 hover:bg-indigo-800 text-white border border-indigo-500 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <span>Liên hệ trực tiếp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
