# Freelancer Real Estate Website

A dynamic real estate website with a modern static frontend and a secure Flask backend for admin management.

## 🚀 Features
- Property listings with images
- Responsive, modern UI
- Admin login and management (Flask backend)
- Contact and social links

## 🗂️ Project Structure
```
├── index.html            # Home page (static)
├── properties.html       # Property listings (static)
├── contact.html          # Contact page (static)
├── admin-login.html      # Admin login (static, connects to backend)
├── css/                  # Stylesheets
├── javascript/           # JavaScript files
├── images/               # Images and assets
└── admin/                # Flask backend (dynamic)
    ├── admin_server.py
    ├── config.py
    ├── start_server.py
    └── ...
```

## ⚙️ Local Development

### 1. Frontend (Static)
You can preview the static site locally:
```bash
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### 2. Backend (Flask Admin)
```bash
cd admin
python start_server.py
# The backend will run on http://localhost:50118 by default
```

## 🌐 Deployment

### 1. Backend (Render)
- Push this repository to GitHub.
- Go to [render.com](https://render.com), create a new Web Service, and connect your repo.
- Render will auto-detect your `render.yaml` and deploy the Flask backend.
- After deployment, copy your Render backend URL (e.g., `https://your-app-name.onrender.com`).
- In `admin/admin.js`, set:
  ```js
  const RENDER_API_URL = 'https://your-app-name.onrender.com';
  ```
- Commit and push this change.

### 2. Frontend (GitHub Pages)
- Deploy all static files (except the `admin/` folder) to GitHub Pages.
- Your site will be live at `https://yourusername.github.io/your-repo`.
- The admin login will connect to your Render backend automatically.

## 🔑 Environment Variables (for Render)
- `RENDER=true` (set automatically by Render)
- `PORT` (set automatically by Render)

## 🛡️ Security
- **Never commit secrets or passwords** to your public repo.
- Use environment variables for sensitive data in production.

## 📄 License
MIT (or your choice)

## 🙋‍♂️ Author
Elmer Tecson

---

**This is a dynamic website: the frontend is static, but admin features are powered by a Flask backend.**

For detailed deployment steps, see `DEPLOYMENT.md`. 