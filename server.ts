import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { BlogPost, Project, ContactMessage } from "./src/types";

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths
const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

// Static credentials for administrative authentication
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const VALID_TOKEN = "jwt-session-token-portfolio-cuongnguyen";

// Seed Datasets if not existing
const seedInitialData = () => {
  if (!fs.existsSync(BLOGS_FILE)) {
    const initialBlogs: BlogPost[] = [
      {
        id: "1",
        title: "Làm Thế Nào Để Học Web Development Hiệu Quả Trong Năm 2026?",
        excerpt: "Lộ trình chi tiết từ cơ bản đến nâng cao dành cho những ai muốn theo đuổi nghề kỹ sư lập trình web toàn diện.",
        content: `Chào mọi người, trong bài viết này Cường muốn chia sẻ với các bạn lộ trình thiết thực nhất để trở thành một Web Developer thực thục trong bối cảnh công nghệ năm 2026. Với sự bùng nổ của các AI coding assistants và các nền tảng tự động hóa, kỹ năng cốt lõi của một lập trình viên không chỉ dừng lại ở cú pháp dòng lệnh mà nằm ở tư duy kiến trúc hệ thống và khả năng giải quyết bài toán nghiệp vụ.<br/><br/>
        
        <h3><strong>1. Nền tảng vững chắc (Cơ bản nhưng cực kỳ quan trọng)</strong></h3><br/>
        Đừng vội vàng nhảy ngay vào các Framework thời thượng! Hãy chắc chắn bạn đã làm chủ HTML5 cấu trúc ngữ nghĩa, CSS3 hiện đại, và đặc biệt là JavaScript (ES6+). Sự thấu hiểu sâu sắc về DOM xử lý sự kiện, asynchronous programming (Promises, async/await), và xử lý dữ liệu động là bệ đỡ vững chắc nhất cho mọi công nghệ phía sau.<br/><br/>
        
        <h3><strong>2. Làm chủ Tooling & CSS Framework hiện đại</strong></h3><br/>
        Hiện nay, Tailwind CSS kết hợp với Vite là tiêu chuẩn vàng gần như bắt buộc cho việc xây dựng ứng dụng nhanh, mượt và responsive tối đa. Việc học cách tối ưu hóa các class Tailwind CSS giúp bạn giải phóng tối đa sự sáng tạo giao diện mà không cần sa lầy vào những dòng CSS dài lê thê và rất khó bảo trì.<br/><br/>
        
        <h3><strong>3. Làm quen với tư duy Full-Stack (Full-Stack Mindset)</strong></h3><br/>
        Biết xây dựng giao diện tuyệt đẹp (Frontend) là điểm cộng lớn, nhưng việc thấu hiểu cách backend vận hành (ví dụ Express, Node.js) sẽ giải phóng hoàn toàn sức mạnh kiến trúc của bạn. Bạn có thể tự định nghĩa API, tối ưu hóa các phương thức lưu trữ file dữ liệu, thiết lập bảo mật cơ bản và viết nên những logic hoàn chỉnh.<br/><br/>
        Chúng ta hãy tiếp tục nỗ lực học tập để nắm bắt tương lai. Hãy thảo luận bình luận bằng khung thảo luận Facebook phía dưới nếu bạn có câu hỏi nhé!`,
        date: "2026-06-01",
        author: "Nguyễn Văn Cường",
        category: "Lập trình",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400&q=80",
        readTime: "5 phút"
      },
      {
        id: "2",
        title: "Tối Ưu Hóa Tải Trang Và Tăng Điểm SEO Cho Website React SPA",
        excerpt: "Những thủ thuật thực chiến giúp ứng dụng React của bạn tăng tốc độ tải, nâng điểm Lighthouse xuất sắc và lọt top tìm kiếm Google.",
        content: `Mục tiêu lớn nhất của việc thiết lập trang web cá nhân là được tiếp cận đúng người dùng. Tuy nhiên đối với các ứng dụng trang đơn (SPA) như React, quá trình Googlebot thu thập thông tin và SEO đôi khi gặp nhiều rào cản do trang được render động. Làm sao xử lý điều này tinh tế nhất?<br/><br/>
        
        <h3><strong>1. Cập nhật Meta Tags Động</strong></h3><br/>
        Giải pháp nhanh nhất là tự động cập nhật thẻ title, description và Open Graph ngay trong mã React component. Nhờ đó, link liên kết khi share lên Facebook, Zalo hay Twitter đều đi kèm hình ảnh và mô tả bắt mắt, thúc đẩy tương thích mạng xã hội tối đa.<br/><br/>
        
        <h3><strong>2. Sử dụng Component Lazy Loading và Nén Hình Ảnh</strong></h3><br/>
        Đừng bắt trình duyệt tải toàn bộ website trong một lần duy nhất! Sử dụng React Suspense và cơ chế load động các trang không hoạt động giúp giảm kích thước file bundle cực lớn. Đồng thời, tải hình ảnh có chọn lọc cùng thuộc tính <code>referrerPolicy="no-referrer"</code> để duy trì dải hiển thị ảnh mượt mà.<br/><br/>
        
        <h3><strong>3. Google Analytics Integration</strong></h3><br/>
        Tích hợp mã Google Analytics tag là cách duy nhất theo dõi trực tiếp và đo lượng traffic hiệu quả nhằm liên tục đưa ra những điều chỉnh kịp thời cho cấu trúc nội dung bài viết.`,
        date: "2026-06-04",
        author: "Nguyễn Văn Cường",
        category: "Thủ thuật SEO",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80",
        readTime: "4 phút"
      }
    ];
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(initialBlogs, null, 2), "utf-8");
  }

  if (!fs.existsSync(PROJECTS_FILE)) {
    const initialProjects: Project[] = [
      {
        id: "p1",
        title: "E-Commerce TechStore - Trang Thương Mại Điện Tử",
        description: "Nền tảng mua sắm thiết bị công nghệ hiện đại với giỏ hàng thời gian thực, quản lý đơn hàng chuyên nghiệp.",
        longDescription: "Dự án thương mại điện tử chuyên nghiệp hỗ trợ đầy đủ hành động tìm kiếm phân loại sản phẩm công nghệ, thêm giỏ hàng tự động, tổng kết thanh toán, giao diện responsive mượt mà và trang quản trị dashboard theo dõi số liệu bán hàng thực tế tài chính doanh nghiệp dành cho Admin.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&h=400&q=80",
        tags: ["React", "Node.js", "Express", "Tailwind CSS", "Local Storage"],
        demoUrl: "https://shop-techstore-demo.example.com",
        githubUrl: "https://github.com/cuongct18/techstore-ecommerce",
        featured: true
      },
      {
        id: "p2",
        title: "EdTech Dashboard - Hệ Thống Quản Lý Giáo Dục",
        description: "Bảng quản trị trung tâm học tập thông minh tương tác đa chiều hỗ trợ học trực tuyến, chấm điểm tự động.",
        longDescription: "Dashboard quản lý giáo khoa chuyên sâu nơi giảng viên cập nhật khóa học trực quan, theo dõi biểu đồ tiến trình học liệu của học viên qua Recharts, tương tác bài viết nội bộ, phòng thi trực tuyến tự động chấm điểm khách quan.",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=400&q=80",
        tags: ["React", "Express.js", "Tailwind CSS", "Recharts", "JSON DB"],
        demoUrl: "https://edtech-dashboard-demo.example.com",
        githubUrl: "https://github.com/cuongct18/edtech-dashboard",
        featured: true
      },
      {
        id: "p3",
        title: "SmartHealth Planner - Trợ Lý Sức Khỏe Gia Đình",
        description: "Hệ thống quản lý chế độ dinh dưỡng, nhắc lịch thuốc men, tiêm ngừa và tính toán BMI thông minh.",
        longDescription: "Ứng dụng gia đình tập trung vào thói quen y tế lành mạnh. Cung cấp tiện ích kiểm tra chỉ số BMI tức thì, biểu đồ cân nặng theo tuần, tạo checklist nhắc nhở lịch tiêm phòng cho trẻ nhỏ và lưu trữ hồ sơ bệnh án cơ bản.",
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&h=400&q=80",
        tags: ["TypeScript", "Vite", "Tailwind CSS", "State Management"],
        demoUrl: "https://smarthealth-planner-demo.example.com",
        githubUrl: "https://github.com/cuongct18/smarthealth-planner",
        featured: false
      }
    ];
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2), "utf-8");
  }

  if (!fs.existsSync(CONTACTS_FILE)) {
    const initialContacts: ContactMessage[] = [
      {
        id: "m1",
        name: "Lê Minh Tuấn",
        email: "tuanlm@company.com",
        subject: "Hợp tác dự án phát triển Landing Page doanh nghiệp",
        content: "Chào Cường, mình thấy các dự án của bạn rất gọn gàng và thiết kế hiện đại. Bên mình đang có dự án phát triển website doanh nghiệp, muốn trao đổi công việc và thảo luận báo giá chi tiết, mong sớm phản hồi từ bạn!",
        date: "2026-06-04T12:00:00Z",
        read: false
      }
    ];
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(initialContacts, null, 2), "utf-8");
  }
};

seedInitialData();

// Helper to read database files
const readJSON = <T>(filePath: string): T[] => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error("Error reading: ", filePath, error);
    return [];
  }
};

// Helper to write database files
const writeJSON = <T>(filePath: string, data: T[]): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing: ", filePath, error);
  }
};

// Middlewares
app.use(express.json());

// Auth middleware helper
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Yêu cầu đăng nhập quản trị viên." });
    return;
  }
  const token = authHeader.substring(7);
  if (token !== VALID_TOKEN) {
    res.status(403).json({ error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
    return;
  }
  next();
};

// --- AUTHENTICATION API ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({
      username: ADMIN_USER,
      isAuthenticated: true,
      token: VALID_TOKEN
    });
  } else {
    res.status(400).json({ error: "Tên tài khoản hoặc mật khẩu không chính xác!" });
  }
});

app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token === VALID_TOKEN) {
      res.json({ username: ADMIN_USER, isAuthenticated: true, token: VALID_TOKEN });
      return;
    }
  }
  res.status(401).json({ isAuthenticated: false });
});


// --- BLOGS API ---
app.get("/api/blog", (req, res) => {
  const blogs = readJSON<BlogPost>(BLOGS_FILE);
  res.json(blogs);
});

app.get("/api/blog/:id", (req, res) => {
  const blogs = readJSON<BlogPost>(BLOGS_FILE);
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) {
    res.status(404).json({ error: "Không tìm thấy bài viết." });
    return;
  }
  res.json(blog);
});

app.post("/api/blog", requireAdmin, (req, res) => {
  const { title, excerpt, content, category, imageUrl, readTime } = req.body;
  if (!title || !content || !excerpt || !category) {
    res.status(400).json({ error: "Vui lòng nhập đầy đủ tiêu đề, danh mục, tóm tắt và nội dung bài viết." });
    return;
  }
  
  const blogs = readJSON<BlogPost>(BLOGS_FILE);
  const newBlog: BlogPost = {
    id: String(Date.now()),
    title,
    excerpt,
    content,
    category,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400&q=80",
    readTime: readTime || "3 phút",
    date: new Date().toISOString().substring(0, 10),
    author: "Nguyễn Văn Cường"
  };
  
  blogs.unshift(newBlog);
  writeJSON(BLOGS_FILE, blogs);
  res.status(201).json(newBlog);
});

app.put("/api/blog/:id", requireAdmin, (req, res) => {
  const { title, excerpt, content, category, imageUrl, readTime } = req.body;
  const blogs = readJSON<BlogPost>(BLOGS_FILE);
  const index = blogs.findIndex(b => b.id === req.params.id);
  
  if (index === -1) {
    res.status(404).json({ error: "Không tìm thấy bài viết cần cập nhật." });
    return;
  }
  
  const updatedBlog = {
    ...blogs[index],
    title: title || blogs[index].title,
    excerpt: excerpt || blogs[index].excerpt,
    content: content || blogs[index].content,
    category: category || blogs[index].category,
    imageUrl: imageUrl !== undefined ? imageUrl : blogs[index].imageUrl,
    readTime: readTime || blogs[index].readTime
  };
  
  blogs[index] = updatedBlog;
  writeJSON(BLOGS_FILE, blogs);
  res.json(updatedBlog);
});

app.delete("/api/blog/:id", requireAdmin, (req, res) => {
  const blogs = readJSON<BlogPost>(BLOGS_FILE);
  const filtered = blogs.filter(b => b.id !== req.params.id);
  if (blogs.length === filtered.length) {
    res.status(404).json({ error: "Không tìm thấy bài viết cần xóa." });
    return;
  }
  writeJSON(BLOGS_FILE, filtered);
  res.json({ message: "Xóa bài viết thành công." });
});


// --- PROJECTS API ---
app.get("/api/projects", (req, res) => {
  const projects = readJSON<Project>(PROJECTS_FILE);
  res.json(projects);
});

app.post("/api/projects", requireAdmin, (req, res) => {
  const { title, description, longDescription, imageUrl, tags, demoUrl, githubUrl, featured } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "Thiếu tiêu đề hoặc mô tả dự án." });
    return;
  }
  
  const projects = readJSON<Project>(PROJECTS_FILE);
  const newProject: Project = {
    id: "p_" + Date.now(),
    title,
    description,
    longDescription,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&h=400&q=80",
    tags: Array.isArray(tags) ? tags : [],
    demoUrl,
    githubUrl,
    featured: !!featured
  };
  
  projects.unshift(newProject);
  writeJSON(PROJECTS_FILE, projects);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", requireAdmin, (req, res) => {
  const projects = readJSON<Project>(PROJECTS_FILE);
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Không tìm thấy dự án cần chỉnh sửa." });
    return;
  }
  
  const updated = {
    ...projects[index],
    ...req.body
  };
  projects[index] = updated;
  writeJSON(PROJECTS_FILE, projects);
  res.json(updated);
});

app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  const projects = readJSON<Project>(PROJECTS_FILE);
  const filtered = projects.filter(p => p.id !== req.params.id);
  if (projects.length === filtered.length) {
    res.status(404).json({ error: "Không tìm thấy dự án để xóa." });
    return;
  }
  writeJSON(PROJECTS_FILE, filtered);
  res.json({ message: "Đã xóa dự án thành công." });
});


// --- CONTACT MESSAGES API ---
app.get("/api/contacts", requireAdmin, (req, res) => {
  const contacts = readJSON<ContactMessage>(CONTACTS_FILE);
  res.json(contacts);
});

app.post("/api/contacts", (req, res) => {
  const { name, email, subject, content } = req.body;
  if (!name || !email || !content) {
    res.status(400).json({ error: "Vui lòng nhập đầy đủ Tên, Email và Nội dung phản hồi." });
    return;
  }
  
  const contacts = readJSON<ContactMessage>(CONTACTS_FILE);
  const newMessage: ContactMessage = {
    id: "m_" + Date.now(),
    name,
    email,
    subject: subject || "Liên hệ cá nhân",
    content,
    date: new Date().toISOString(),
    read: false
  };
  
  contacts.unshift(newMessage);
  writeJSON(CONTACTS_FILE, contacts);
  res.status(201).json({ message: "Gửi tin nhắn thành công! Cám ơn phản hồi của bạn.", data: newMessage });
});

app.put("/api/contacts/:id/read", requireAdmin, (req, res) => {
  const contacts = readJSON<ContactMessage>(CONTACTS_FILE);
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Không tìm thấy thư liên hệ." });
    return;
  }
  
  contacts[index].read = true;
  writeJSON(CONTACTS_FILE, contacts);
  res.json(contacts[index]);
});

app.delete("/api/contacts/:id", requireAdmin, (req, res) => {
  const contacts = readJSON<ContactMessage>(CONTACTS_FILE);
  const filtered = contacts.filter(c => c.id !== req.params.id);
  if (contacts.length === filtered.length) {
    res.status(404).json({ error: "Không tìm thấy thư để xóa." });
    return;
  }
  writeJSON(CONTACTS_FILE, filtered);
  res.json({ message: "Đã xóa thư thành công." });
});


// --- VITE DEV OR PRODUCTION STATIC INGRESS ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR Integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with compiled static distribution...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
