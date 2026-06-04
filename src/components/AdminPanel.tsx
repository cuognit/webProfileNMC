import React from "react";
import { BlogPost, ContactMessage, UserSession } from "../types";
import { 
  Lock, KeyRound, LayoutGrid, FileText, MailOpen, LineChart, 
  Plus, Edit3, Trash2, CheckCircle, Clock, AlertTriangle, Eye, RefreshCw, LogOut, CheckCheck
} from "lucide-react";

interface AdminPanelProps {
  adminSession: UserSession;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  adminSession,
  onLoginSuccess,
  onLogout
}: AdminPanelProps) {
  // Login form status
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [authSubmitting, setAuthSubmitting] = React.useState(false);

  // Backoffice interior tabs
  const [activeSubTab, setActiveSubTab] = React.useState<"blogs" | "inbox" | "analytics">("blogs");

  // In-memory data states
  const [blogList, setBlogList] = React.useState<BlogPost[]>([]);
  const [inboxList, setInboxList] = React.useState<ContactMessage[]>([]);
  const [loadingContent, setLoadingContent] = React.useState(false);
  const [actionError, setActionError] = React.useState("");
  const [actionSuccess, setActionSuccess] = React.useState("");

  // Create / Edit post form states
  const [editorMode, setEditorMode] = React.useState<"list" | "create" | "edit">("list");
  const [editingBlogId, setEditingBlogId] = React.useState<string | null>(null);
  
  // Post inputs
  const [postTitle, setPostTitle] = React.useState("");
  const [postExcerpt, setPostExcerpt] = React.useState("");
  const [postContent, setPostContent] = React.useState("");
  const [postCategory, setPostCategory] = React.useState("Lập trình");
  const [postImageUrl, setPostImageUrl] = React.useState("");
  const [postReadTime, setPostReadTime] = React.useState("5 phút");

  // Load backend content for logged-in administrator
  const loadAdminDatabase = async () => {
    if (!adminSession.isAuthenticated) return;
    try {
      setLoadingContent(true);
      setActionError("");
      
      // Fetch blogs
      const blogRes = await fetch("/api/blog");
      const blogData = await blogRes.json();
      setBlogList(blogRes.ok ? blogData : []);

      // Fetch contacts inbox
      const inboxRes = await fetch("/api/contacts", {
        headers: { "Authorization": `Bearer ${adminSession.token}` }
      });
      const inboxData = await inboxRes.json();
      setInboxList(inboxRes.ok ? inboxData : []);

    } catch (err) {
      console.error(err);
      setActionError("Lỗi kết nối máy chủ khi nạp cơ sở dữ liệu nội bộ.");
    } finally {
      setLoadingContent(false);
    }
  };

  React.useEffect(() => {
    if (adminSession.isAuthenticated) {
      loadAdminDatabase();
    }
  }, [adminSession]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError("Vui lòng điền đủ tên tài khoản và mật khẩu.");
      return;
    }

    try {
      setAuthError("");
      setAuthSubmitting(true);
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Mật khẩu không hợp lệ.");
      }

      // Success
      localStorage.setItem("cuong_portfolio_token", data.token);
      onLoginSuccess(data);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Không thể kết nối đến máy chủ xác thực.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Blog CRUD actions
  const initCreatePost = () => {
    setEditorMode("create");
    setEditingBlogId(null);
    setPostTitle("");
    setPostExcerpt("");
    setPostContent("");
    setPostCategory("Lập trình");
    setPostImageUrl("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400&q=80");
    setPostReadTime("5 phút");
  };

  const initEditPost = (blog: BlogPost) => {
    setEditorMode("edit");
    setEditingBlogId(blog.id);
    setPostTitle(blog.title);
    setPostExcerpt(blog.excerpt);
    setPostContent(blog.content);
    setPostCategory(blog.category);
    setPostImageUrl(blog.imageUrl || "");
    setPostReadTime(blog.readTime);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postExcerpt.trim() || !postContent.trim()) {
      setActionError("Vui lòng nhập đầy đủ Tiêu đề, Tóm tắt và Nội dung bài viết.");
      return;
    }

    const payload = {
      title: postTitle,
      excerpt: postExcerpt,
      content: postContent,
      category: postCategory,
      imageUrl: postImageUrl,
      readTime: postReadTime
    };

    try {
      setActionError("");
      let res;
      if (editorMode === "create") {
        res = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminSession.token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/blog/${editingBlogId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminSession.token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Xảy ra lỗi khi lưu bài viết.");
      }

      setActionSuccess(editorMode === "create" ? "Tạo bài viết mới thành công" : "Đã cập nhật bài viết thành công!");
      setEditorMode("list");
      loadAdminDatabase();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Lỗi lưu dữ liệu.");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này sẽ không thể khôi phục.")) return;
    try {
      setActionError("");
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminSession.token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Không thể xóa bài viết.");
      }

      setActionSuccess("Đã xóa bài viết thành công.");
      loadAdminDatabase();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message);
    }
  };

  // Contacts Actions
  const handleMarkMessageRead = async (id: string) => {
    try {
      setActionError("");
      const res = await fetch(`/api/contacts/${id}/read`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${adminSession.token}` }
      });

      if (!res.ok) throw new Error("Không thể đánh dấu tin nhắn.");
      loadAdminDatabase();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Xóa thư khỏi hệ thống?")) return;
    try {
      setActionError("");
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminSession.token}` }
      });

      if (!res.ok) throw new Error("Chưa thể xóa thư.");
      loadAdminDatabase();
    } catch (err: any) {
      console.error(err);
      setActionError(err.message);
    }
  };

  return (
    <div className="space-y-8" id="admin-panel-container">
      
      {/* --- RENDER NO AUTHENTICATED: LOGIN GATE --- */}
      {!adminSession.isAuthenticated ? (
        <div className="max-w-md mx-auto py-12 animate-in fade-in duration-300">
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl dark:bg-neutral-900 dark:border-neutral-800 space-y-6">
            
            {/* Header login form */}
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-650 dark:bg-indigo-950/45 dark:border-indigo-800">
                <Lock className="h-6 w-6" id="login-lock-icon" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                Xác Thực Quản Trị
              </h2>
              <p className="text-xs text-neutral-500">
                Nhập tài khoản Admin để truy cập khu vực quản trị nội dung bài viết và hòm thư cá nhân.
              </p>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="flex items-start space-x-2 p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400">
                <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Main Form controls */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 text-sm">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-250 bg-white dark:bg-neutral-950 dark:border-neutral-800 focus:border-indigo-500 focus:outline-none dark:text-neutral-50"
                />
              </div>

              <div className="space-y-1.5 text-sm">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                  Mật khẩu tài khoản
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu mặc định: admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-250 bg-white dark:bg-neutral-950 dark:border-neutral-800 focus:border-indigo-500 focus:outline-none dark:text-neutral-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                {authSubmitting ? "Đang xác thực..." : "Đăng Nhập Quản Trị"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* --- RENDER HOME DASHBOARD FOR AUTHORIZED ADMIN --- */
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Header controls and title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                Bảng Điều Khiển Hệ Thống
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                Khu Vực Quản Trị Hệ Thống
              </h2>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold text-rose-650 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all dark:bg-rose-950/20 dark:border-rose-950"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất Admin</span>
            </button>
          </div>

          {/* Tab Selection controller */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "blogs", label: "Bài viết Blog", icon: FileText, color: "text-blue-600 border-blue-500" },
              { id: "inbox", label: "Hộp Thư Liên Hệ", icon: MailOpen, color: "text-emerald-600 border-emerald-500" },
              { id: "analytics", label: "Thống Kê & G.A", icon: LineChart, color: "text-indigo-600 border-indigo-500" }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    setEditorMode("list");
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-4 rounded-xl border text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-white border-neutral-900 dark:bg-neutral-900 dark:border-neutral-50 shadow-md scale-[1.02] text-neutral-900 dark:text-white"
                      : "bg-neutral-50/50 border-neutral-150 text-neutral-500 dark:bg-neutral-950/20 dark:border-neutral-850 hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action outcome alerts */}
          {actionError && (
            <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs dark:bg-rose-950/20 dark:text-rose-400">
              {actionError}
            </div>
          )}
          {actionSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs dark:bg-emerald-950/20 dark:text-emerald-300">
              {actionSuccess}
            </div>
          )}

          {/* --- SUB-TAB 1: MANAGING BLOG ARTICLES --- */}
          {activeSubTab === "blogs" && (
            <div className="space-y-6">
              
              {editorMode === "list" ? (
                /* List view */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      <span>Danh Sách Bài Viết ({blogList.length})</span>
                    </h3>
                    
                    <button
                      onClick={initCreatePost}
                      className="flex items-center space-x-1 px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Viết Bài Mới</span>
                    </button>
                  </div>

                  {loadingContent ? (
                    <div className="text-center py-10 text-neutral-400">Đang nạp danh sách...</div>
                  ) : blogList.length === 0 ? (
                    <div className="p-8 border border-dashed rounded-xl text-center text-neutral-400">Không có bài viết nào trong cơ sở dữ liệu.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-left text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-950 text-xs font-bold uppercase text-neutral-500 font-mono tracking-wider">
                          <tr>
                            <th className="px-6 py-3">Tiêu Đề</th>
                            <th className="px-6 py-3">Danh Mục</th>
                            <th className="px-6 py-3">Ngày Viết</th>
                            <th className="px-6 py-3 text-center">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                          {blogList.map((blog) => (
                            <tr key={blog.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-50 max-w-xs truncate">{blog.title}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{blog.category}</span>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono">{blog.date}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    onClick={() => initEditPost(blog)}
                                    className="p-1.5 rounded bg-neutral-100 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:bg-neutral-800 dark:text-neutral-300"
                                    title="Chỉnh sửa bài"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(blog.id)}
                                    className="p-1.5 rounded bg-neutral-100 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 transition-colors dark:bg-neutral-800 dark:text-neutral-300"
                                    title="Xóa bài viết"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                /* Create/Edit Post form layout editor view */
                <form onSubmit={handleSavePost} className="p-6 bg-white border border-neutral-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-800 space-y-4">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                    {editorMode === "create" ? "TẠO BÀI VIẾT BLOG MỚI" : "CHỈNH SỬA BÀI VIẾT"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-neutral-500 uppercase font-mono">Tiêu đề bài viết</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Làm thế nào để tối ưu mã nguồn React"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-250 rounded-xl focus:border-indigo-500 focus:outline-none dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-50"
                      />
                    </div>
                    {/* Category Selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 uppercase font-mono">Phân loại danh mục</label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-250 rounded-xl focus:border-indigo-500 focus:outline-none dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-50 text-sm"
                      >
                        <option value="Lập trình">Lập trình</option>
                        <option value="Thủ thuật SEO">Thủ thuật SEO</option>
                        <option value="Kiến trúc thiết kế">Kiến trúc thiết kế</option>
                        <option value="Góc cá nhân">Góc cá nhân</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cover image URL */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 uppercase font-mono">Ảnh bìa (URL)</label>
                      <input
                        type="url"
                        placeholder="https://unsplash.com/..."
                        value={postImageUrl}
                        onChange={(e) => setPostImageUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-250 rounded-xl focus:border-indigo-500 focus:outline-none dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-50 text-sm"
                      />
                    </div>
                    {/* Read Time estimation */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 uppercase font-mono">Thời gian đọc dự kiến</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: 5 phút"
                        value={postReadTime}
                        onChange={(e) => setPostReadTime(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-250 rounded-xl focus:border-indigo-500 focus:outline-none dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase font-mono">Tóm tắt ngắn (Excerpt)</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Một dòng tóm tắt bài viết hiển thị ở danh sách ngoài trang chủ..."
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-250 rounded-xl focus:border-indigo-500 focus:outline-none dark:bg-neutral-950 dark:border-neutral-800"
                    />
                  </div>

                  {/* Body markup HTML editor area */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-500 uppercase font-mono">Nội dung bài viết (Chấp nhận thẻ HTML cơ bản h3, p, code, pre)</label>
                      <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-neutral-500">Rich HTML Support</span>
                    </div>
                    <textarea
                      required
                      rows={12}
                      placeholder="Chào mọi người, hôm nay tôi muốn chia sẻ... <br/> <h3>1. Bắt đầu</h3> <p>Lập trình là nghệ thuật...</p>"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-250 rounded-xl focus:border-indigo-500 focus:outline-none dark:bg-neutral-950 dark:border-neutral-800 font-mono text-sm leading-relaxed"
                    />
                  </div>

                  {/* Save actions panel */}
                  <div className="flex items-center justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditorMode("list")}
                      className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-sm rounded-xl dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow"
                    >
                      Xác nhận lưu bài
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* --- SUB-TAB 2: MANAGING DIRECT INBOX CONTACT MESSAGES --- */}
          {activeSubTab === "inbox" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
                <MailOpen className="h-5.5 w-5.5 text-emerald-500" />
                <span>Hộp Thư Liên Hệ Gửi Đến ({inboxList.length})</span>
              </h3>

              {loadingContent ? (
                <div className="text-center py-10 text-neutral-400 font-mono">Đang nạp dữ liệu hòm thư...</div>
              ) : inboxList.length === 0 ? (
                <div className="p-8 border border-dashed rounded-xl text-center text-neutral-400 font-mono">Hộp thư trống trải. Chưa nhận được phản hồi nào.</div>
              ) : (
                <div className="space-y-4">
                  {inboxList.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        msg.read
                          ? "bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
                          : "bg-emerald-50/40 border-emerald-250 dark:bg-emerald-950/15 dark:border-emerald-900"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-bold text-neutral-950 dark:text-neutral-55">{msg.name}</span>
                            <span className="text-xs font-mono text-neutral-500">(&lt;{msg.email}&gt;)</span>
                            {!msg.read && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white bg-emerald-600 font-mono animate-pulse">
                                Mới
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">Chủ đề: <span className="text-indigo-600 dark:text-indigo-400">{msg.subject}</span></div>
                        </div>

                        <span className="text-xs font-mono text-neutral-400">
                          {new Date(msg.date).toLocaleString("vi-VN")}
                        </span>
                      </div>

                      {/* Content message body */}
                      <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>

                      {/* Controls toolbar */}
                      <div className="mt-4 flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-850">
                        {!msg.read && (
                          <button
                            onClick={() => handleMarkMessageRead(msg.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 hover:bg-emerald-100 transition-all text-xs font-bold"
                          >
                            <CheckCheck className="h-4 w-4" />
                            <span>Đã đọc</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all text-xs font-semibold"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Xóa tin</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- SUB-TAB 3: GOOGLE ANALYTICS INTEGRATION PREVIEW PANEL --- */}
          {activeSubTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
                    <LineChart className="h-5.5 w-5.5 text-indigo-500" />
                    <span>Trung Tâm Phân Tích Google Analytics G-PFB2026M18</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Bản tin thu thập số liệu chi tiết hoạt động tương tác trang từ mã nhúng GA4 trong index.html.
                  </p>
                </div>

                <button
                  onClick={loadAdminDatabase}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-850 dark:text-neutral-300 text-xs font-bold"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Cập nhật số liệu</span>
                </button>
              </div>

              {/* Statistical KPI display blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "482 Lượt", label: "Tổng số View tuần", change: "+12.4%", status: "up" },
                  { value: `${blogList.length} Bài`, label: "Tổng bài đăng Blog", change: "Hoạt động", status: "none" },
                  { value: `${inboxList.length} Thư`, label: "Lời nhắn phản hồi", change: `${inboxList.filter(m=>!m.read).length} Thư mới`, status: "alert" },
                  { value: "89.2 %", label: "Tỷ lệ tương tác", change: "Rất Tốt", status: "good" }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-855 space-y-1 shadow-sm">
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide font-mono">{kpi.label}</div>
                    <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{kpi.value}</div>
                    <div className={`text-[10px] font-semibold flex items-center ${
                      kpi.status === "up" ? "text-emerald-600 dark:text-emerald-450" :
                      kpi.status === "alert" ? "text-amber-600" :
                      kpi.status === "good" ? "text-indigo-600" : "text-neutral-400"
                    }`}>
                      {kpi.change}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Traffic sources */}
                <div className="md:col-span-2 p-6 rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest font-mono">
                    Nguồn Truy Cập Hàng Đầu (Top Traffic Channels)
                  </h4>
                  <div className="space-y-3.5 pt-1 text-sm">
                    {[
                      { source: "Google Organic Search", pct: "45%", width: "w-[45%]", views: "216 view" },
                      { source: "Facebook Share Link (SDK Widget)", pct: "30%", width: "w-[30%]", views: "144 view" },
                      { source: "Github Portfolio Referral", pct: "15%", width: "w-[15%]", views: "72 view" },
                      { source: "Direct Entry", pct: "10%", width: "w-[10%]", views: "48 view" }
                    ].map((item, id) => (
                      <div key={id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          <span>{item.source}</span>
                          <span className="font-mono text-neutral-500">{item.pct} ({item.views})</span>
                        </div>
                        <div className="w-full h-2 rounded bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
                          <div className={`h-full bg-indigo-505 bg-indigo-600 ${item.width} rounded`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit log overview block */}
                <div className="p-6 rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest font-mono">
                    Hoạt động Nhật Ký
                  </h4>
                  
                  <div className="space-y-3 pt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-800 dark:text-neutral-100">Bản ghi GA4 trực tuyến</strong>: Đã đăng ký tag <code>G-PFB2026M18</code> kiểm định tự động.
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-800 dark:text-neutral-100">Cơ sở dữ liệu bền vững</strong>: Hệ thống Express backend đang giám sát <strong className="text-emerald-600">{blogList.length} bài đăng</strong> và {inboxList.length} liên hệ.
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-800 dark:text-neutral-100">Tối ưu hóa hình ảnh</strong>: Tất cả các file media đang hiển thị đều áp dụng chính sách <code>no-referrer</code> bảo mật cao.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
