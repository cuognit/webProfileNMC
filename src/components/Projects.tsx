import React from "react";
import { Project } from "../types";
import { Search, ExternalLink, Github, Layers, ArrowUpRight, Smile, Eye } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedTag, setSelectedTag] = React.useState<string>("All");
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  // Fetch projects from the backend
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Không thể tải danh sách dự án.");
        const data = await res.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Đã xảy ra lỗi bất ngờ.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Sync filters
  React.useEffect(() => {
    let result = projects;
    
    if (selectedTag !== "All") {
      result = result.filter(p => p.tags.includes(selectedTag));
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.longDescription && p.longDescription.toLowerCase().includes(q))
      );
    }

    setFilteredProjects(result);
  }, [searchQuery, selectedTag, projects]);

  // Extract all unique tags safely
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
    return ["All", ...Array.from(tagsSet)];
  }, [projects]);

  return (
    <div className="space-y-8">
      {/* Grid Header and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
            Sản Phẩm Trí Tuệ
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Các Dự Án Đã Thực Hiện
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl">
            Khám phá các sản phẩm tiêu biểu được hoàn thiện với sự kết hợp sâu sắc của giải pháp tối ưu hóa dữ liệu và mỹ thuật thiết kế hiện đại.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dự án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-sm text-sm focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
          />
        </div>
      </div>

      {/* Tag Filters bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-neutral-400 uppercase font-mono mr-2">Bộ lọc:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedTag === tag
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
            }`}
          >
            {tag === "All" ? "Tất Cả" : tag}
          </button>
        ))}
      </div>

      {/* Main projects loading core */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-96 animate-pulse p-4 space-y-4">
              <div className="bg-neutral-200 dark:bg-neutral-800 h-48 rounded-xl w-full" />
              <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 pt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-center dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400">
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <Smile className="h-8 w-8 mx-auto text-neutral-400" />
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-base">Không tìm thấy dự án nào tương ứng với bộ lọc của bạn.</p>
          <button
            onClick={() => { setSelectedTag("All"); setSearchQuery(""); }}
            className="text-xs text-indigo-600 hover:underline font-bold"
          >
            Khôi phục lại thiết lập ban đầu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/50">
                    <Layers className="h-10 w-10 text-indigo-500" />
                  </div>
                )}
                {/* Featured indicator badge */}
                {project.featured && (
                  <span className="absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-600 rounded-full font-mono shadow-md">
                    Tiêu biểu
                  </span>
                )}
              </div>

              {/* Body Card Details */}
              <div className="flex-1 p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:indigo-400 dark:hover:text-indigo-300"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Xem chi tiết</span>
                    </button>

                    <div className="flex space-x-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                          title="Xem mã nguồn Github"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                          title="Xem Demo thực tế"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Modal project detail drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            id="project-detail-modal"
          >
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-100">
              {selectedProject.imageUrl ? (
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/50">
                  <Layers className="h-12 w-12 text-indigo-500" />
                </div>
              )}
              {/* Close Button top-right */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                title="Đóng bảng tin"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  DỰ ÁN PHÂN TÍCH
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  {selectedProject.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed descriptions */}
              <div className="space-y-2 text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {selectedProject.description}
                </p>
                <p>
                  {selectedProject.longDescription || "Không có thông tin mô tả mở rộng cho dự án này."}
                </p>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

              {/* Link Out buttons footer */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full sm:w-auto items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-250 text-neutral-800 font-bold px-5 py-2.5 rounded-xl transition-all dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 text-sm"
                  >
                    <Github className="h-4.5 w-4.5" />
                    <span>Mã nguồn Github</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full sm:w-auto items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md text-sm"
                  >
                    <span>Trải nghiệm Demo</span>
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex w-full sm:w-auto items-center justify-center bg-white border border-neutral-300 hover:bg-neutral-150 text-neutral-700 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
