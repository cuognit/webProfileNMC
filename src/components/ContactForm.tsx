import React from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");
  
  // Status feedback states
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  
  // Clipboard copy state
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin Tên, Email và nội dung tin nhắn.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Đã xảy ra lỗi khi gửi lời nhắn của bạn.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setContent("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("cuongct18.jr@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-8" id="contact-form-section">
      {/* Title */}
      <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
          KẾT NỐI NGAY
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          Liên Hệ Trực Tiếp
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl mt-1">
          Gửi tin nhắn hoặc phản hồi đề xuất hợp tác trực tiếp đến hộp thư của Cường qua form điện tử bảo mật bên dưới.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Contact info details card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-neutral-250 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Thông Tin Liên Hệ
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Nếu bạn không muốn sử dụng form liên lạc, bạn có thể gửi email trực tiếp hoặc liên lạc bằng các phương thức dưới đây.
            </p>

            <div className="space-y-4">
              {/* Email location row */}
              <div className="flex items-start space-x-3 text-sm">
                <div className="mt-0.5 p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-200">Email Cá Nhân</div>
                  <div className="text-neutral-600 dark:text-neutral-400 flex items-center justify-between mt-0.5">
                    <span className="font-mono">cuongct18.jr@gmail.com</span>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-indigo-600 transition-all cursor-pointer dark:hover:bg-neutral-800"
                      title="Sao chép Email"
                    >
                      {copiedEmail ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone location row */}
              <div className="flex items-start space-x-3 text-sm">
                <div className="mt-0.5 p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-200">Điện Thoại Trực Tiếp</div>
                  <div className="text-neutral-600 dark:text-neutral-400 mt-0.5 font-mono">+84 (0)903 456 789</div>
                </div>
              </div>

              {/* Address Location row */}
              <div className="flex items-start space-x-3 text-sm">
                <div className="mt-0.5 p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-200">Văn Phòng Làm Việc</div>
                  <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">Quận 1, Thành Phố Hồ Chí Minh, Việt Nam</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Workplace motto */}
            <div className="bg-emerald-50/50 border border-emerald-150 p-4 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs leading-relaxed">
              <strong>Thời gian trực phản hồi:</strong> Thư liên lạc được phản hồi trong vòng tối đa 24 giờ kể từ lúc tiếp nhận hệ thống. Rất hân hạnh được đồng hành phát triển cùng bạn!
            </div>
          </div>
        </div>

        {/* Contact Form input cards */}
        <div className="lg:col-span-3">
          {success ? (
            /* Contact success view box */
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 dark:bg-emerald-950/20 dark:border-emerald-800">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Gửi lời nhắn thành công!</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto leading-relaxed">
                  Cảm ơn bạn đã gửi liên hệ cho tôi. Hệ thống Express backend đã lưu trữ thành công lời nhắn của bạn. Cường Nguyễn sẽ xem xét và phản hồi sớm nhất qua email của bạn.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
              >
                Gửi thêm một tin nhắn khác
              </button>
            </div>
          ) : (
            /* Input Form elements */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                Để Lại Thư Nhắn
              </h3>

              {/* Error feedback alert box */}
              {errorMsg && (
                <div className="flex items-start space-x-2.5 p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/25 dark:border-rose-900 dark:text-rose-400 text-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-mono">
                    Họ và Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="form-name"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-250 text-sm focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-mono">
                    Địa chỉ Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="form-email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-250 text-sm focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="form-subject" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-mono">
                  Chủ đề liên hệ
                </label>
                <input
                  type="text"
                  id="form-subject"
                  placeholder="Gợi ý hợp tác, tuyển dụng, hỏi đáp..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-250 text-sm focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label htmlFor="form-content" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-mono">
                  Nội dung liên lạc <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="form-content"
                  required
                  rows={5}
                  placeholder="Viết nội dung tin nhắn của bạn tại đây tối thiểu 10 ký tự..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-250 text-sm focus:border-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 resize-y"
                />
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98 font-mono tracking-wide uppercase text-xs"
              >
                {submitting ? (
                  <span>Đang xử lý gửi thư...</span>
                ) : (
                  <>
                    <span>Gửi tin nhắn trực tiếp</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
