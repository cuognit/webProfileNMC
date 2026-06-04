import React from "react";
import { BlogPost } from "../types";
import { Calendar, User, Clock, Tag, ArrowLeft, Search, MessageSquare, Heart, Share2, Smile } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export default function Blog() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [selectedBlog, setSelectedBlog] = React.useState<BlogPost | null>(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  // Interaction likes and native commenting backups
  const [likes, setLikes] = React.useState<Record<string, number>>({});
  const [isLiked, setIsLiked] = React.useState<Record<string, boolean>>({});
  const [nativeComments, setNativeComments] = React.useState<Record<string, Comment[]>>({
    "1": [
      { id: "c1", author: "Trần Anh Quân", content: "Bài viết chi tiết quá ạ! Cám ơn anh Cường đã tổng hợp nhiệt tình nha.", date: "2026-06-02 09:30" },
      { id: "c2", author: "Phạm Thùy Linh", content: "Năm 2026 học Web đúng là thay đổi nhiều thật. Thích nhất phần nói về Fullstack mindset.", date: "2026-06-03 14:15" }
    ],
    "2": [
      { id: "c3", author: "Nguyễn Hải Đăng", content: "Google Analytics 4 setup dễ thương ghê, lát em áp dụng thử cho SPA cá nhân.", date: "2026-06-04 10:00" }
    ]
  });

  // Comment Form state
  const [newCommentName, setNewCommentName] = React.useState<string>("");
  const [newCommentText, setNewCommentText] = React.useState<string>("");

  // Fetch blogs from backend
  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Không thể kết nối đến cơ sở dữ liệu bài viết.");
        const data = await res.json();
        setBlogs(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Xảy ra lỗi khi tải dữ liệu bài viết.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Update document title dynamically for SEO optimization
  React.useEffect(() => {
    if (selectedBlog) {
      document.title = `${selectedBlog.title} | Blog Cường Nguyễn`;
    } else {
      document.title = "Blog cá nhân | Cường Nguyễn - Kỹ Sư Lập Trình";
    }
    return () => {
      document.title = "Cường Nguyễn | Kỹ Sư Lập Trình & Blog Cá Nhân";
    };
  }, [selectedBlog]);

  // Facebook SDK parse trigger on change of blog view
  React.useEffect(() => {
    if (selectedBlog && (window as any).FB) {
      try {
        // Trigger FB parser to render the plugin asynchronously
        (window as any).FB.XFBML.parse();
      } catch (e) {
        console.warn("FB SDK Parsing error inside sandboxed iframe: ", e);
      }
    }
  }, [selectedBlog]);

  // Handlers
  const handleLike = (blogId: string) => {
    const updatedLiked = { ...isLiked, [blogId]: !isLiked[blogId] };
    const currentLikes = likes[blogId] || 0;
    const updatedLikes = {
      ...likes,
      [blogId]: isLiked[blogId] ? currentLikes - 1 : currentLikes + 1
    };
    setIsLiked(updatedLiked);
    setLikes(updatedLikes);
  };

  const handleCreateComment = (e: React.FormEvent, blogId: string) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: String(Date.now()),
      author: newCommentName,
      content: newCommentText,
      date: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updatedComments = {
      ...nativeComments,
      [blogId]: [...(nativeComments[blogId] || []), newComment]
    };

    setNativeComments(updatedComments);
    setNewCommentName("");
    setNewCommentText("");
  };

  // Categories query list
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    blogs.forEach(b => set.add(b.category));
    return ["All", ...Array.from(set)];
  }, [blogs]);

  // Filter computation
  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Current Blog absolute URL helper for Facebook Comment SDK
  const currentBlogUrl = selectedBlog 
    ? `https://developer.facebook.com/docs/plugins/comments?blog_id=${selectedBlog.id}` 
    : "";

  return (
    <div className="space-y-8" id="blog-section-container">
      {selectedBlog ? (
        /* --- SINGLE ARTICLE DETAILED VIEW --- */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Back button */}
          <button
            onClick={() => setSelectedBlog(null)}
            className="flex items-center space-x-2 text-sm font-semibold text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách bài viết</span>
          </button>

          {/* Article Header Hero */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center text-xs font-mono text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{selectedBlog.date}</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{selectedBlog.readTime} đọc</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <span className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded">
                <Tag className="h-3 w-3 mr-1" />
                <span>{selectedBlog.category}</span>
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-neutral-50">
              {selectedBlog.title}
            </h1>

            <div className="flex items-center space-x-3 pt-2">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Nguyen Van Cuong Author"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{selectedBlog.author}</div>
                <div className="text-xs text-neutral-500">Người viết bài • Công nghệ Số</div>
              </div>
            </div>
          </div>

          {/* Cover image banner */}
          {selectedBlog.imageUrl && (
            <div className="h-64 sm:h-96 md:h-120 w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* HTML Content Body */}
          <article 
            className="prose dark:prose max-w-none pt-4 focus:outline-none"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />

          <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-8" />

          {/* Social Feedback Bar */}
          <div className="flex flex-wrap gap-4 items-center justify-between pb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(selectedBlog.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                  isLiked[selectedBlog.id]
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isLiked[selectedBlog.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>Thích ({likes[selectedBlog.id] || (selectedBlog.id === "1" ? 14 : 9)})</span>
              </button>

              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Ý kiến bạn đọc là nguồn động lực to lớn của Cường Nguyễn.
              </span>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Đã sao chép đường dẫn bài viết vào Clipboard để chia sẻ!");
              }}
              className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
            >
              <Share2 className="h-4 w-4" />
              <span>Gửi link chia sẻ</span>
            </button>
          </div>

          {/* --- DOUBLE COMMENTING ENGINE SECTION --- */}
          <div className="space-y-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white p-6 sm:p-8 shadow-sm dark:bg-neutral-900">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
                <MessageSquare className="h-5.5 w-5.5 text-indigo-500" />
                <span>Khu Vực Thảo Luận Bài Viết</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Chúng tôi tích hợp bình luận liên kết Facebook và cộng đồng bình luận trực tiếp bên dưới.
              </p>
            </div>

            {/* FACEBOOK COMMENTS PLUGIN (As requested) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  Bình Luận Qua Facebook SDK
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/30 px-2 py-0.5 rounded font-medium">
                  Official Security Link
                </span>
              </div>
              
              {/* Box element containing Facebook Comments markup */}
              <div className="p-4 rounded-xl border border-neutral-150 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 overflow-x-auto min-h-[140px]">
                {/* Fallback info inside iFrame warning */}
                <div className="text-[11px] text-neutral-500 mb-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
                  Lưu ý: Widget Facebook SDK sẽ hiển thị trực tuyến. Nếu đang chạy trong môi trường bảo mật iFrame Sandbox, hãy sử dụng thêm khung bình luận Bản Địa phía dưới.
                </div>
                
                <div 
                  className="fb-comments" 
                  data-href={currentBlogUrl} 
                  data-width="100%" 
                  data-numposts="5"
                  data-colorscheme="light"
                />
              </div>
            </div>

            {/* LOCAL COMMUNITY COMMENTS BACKUP (Ensures full functional experience) */}
            <div className="space-y-6 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                Bình Luận Bản Địa (Local Chatroom)
              </span>

              {/* Render local comments list */}
              <div className="space-y-4">
                {(nativeComments[selectedBlog.id] || []).map((comment) => (
                  <div key={comment.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 dark:bg-neutral-950/50 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{comment.author}</div>
                      <div className="text-[10px] font-mono text-neutral-400">{comment.date}</div>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Submit localized comment form */}
              <form onSubmit={(e) => handleCreateComment(e, selectedBlog.id)} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Tên của bạn..."
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-neutral-200 bg-white focus:border-indigo-500 focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 dark:text-neutral-50"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Viết cảm nghĩ hoặc câu hỏi của bạn tại đây..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-white focus:border-indigo-500 focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 dark:text-neutral-50"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
                >
                  Gửi Bình Luận Bản Địa
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* --- LIST BLOG ARTICLES VIEW --- */
        <div className="space-y-8">
          
          {/* Header section with categories */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
                Chia Sẻ Tri Thức
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
                Blog Cá Nhân
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl">
                Góc viết kỹ thuật của Cường Nguyễn về tối ưu hóa mã nguồn, lập trình Fullstack, thủ thuật SEO React chuyên nghiệp.
              </p>
            </div>

            {/* Keyword Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-sm text-sm focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
              />
            </div>
          </div>

          {/* Categories Selector */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase font-mono mr-2">Chủ đề:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
                }`}
              >
                {cat === "All" ? "Tất Cả" : cat}
              </button>
            ))}
          </div>

          {/* Core Articles list handler */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-80 animate-pulse p-4 space-y-4">
                  <div className="bg-neutral-250 dark:bg-neutral-800 h-40 rounded-xl w-full" />
                  <div className="h-5 bg-neutral-250 dark:bg-neutral-800 rounded w-2/3" />
                  <div className="h-4 bg-neutral-250 dark:bg-neutral-800 rounded w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-rose-50 text-rose-700 border border-rose-250 text-center dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-450">
              <p className="font-semibold">{error}</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <Smile className="h-8 w-8 mx-auto text-neutral-400" />
              <p className="text-neutral-500 dark:text-neutral-400 font-medium font-mono">Không tìm thấy bài viết nào phù hợp.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                Khôi phục các lựa chọn ban đầu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="space-y-4">
                    {/* Thumbnail Image */}
                    {blog.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute left-3 top-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-600 rounded">
                          {blog.category}
                        </span>
                      </div>
                    )}

                    {/* Metadata body */}
                    <div className="px-5 pb-5 space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{blog.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{blog.readTime} đọc</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-bold leading-snug text-neutral-950 group-hover:text-indigo-600 dark:text-neutral-50 dark:group-hover:text-indigo-400 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Read trigger link footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    <span>Đọc chi tiết bài viết</span>
                    <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
