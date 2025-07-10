document.addEventListener('DOMContentLoaded', function() {
    // --- API URL LOGIC FOR RENDER/GITHUB PAGES/LOCAL ---
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isGithubPages = window.location.hostname.endsWith('.github.io');
    // CHANGE THIS to your actual Render backend URL after deployment:
    const RENDER_API_URL = 'https://your-app-name.onrender.com';
    const API_BASE_URL = isLocalhost
        ? 'http://localhost:50118'
        : (isGithubPages ? RENDER_API_URL : window.location.origin);

    const adminForm = document.getElementById('adminLoginForm');
    const guestBtn = document.getElementById('guestLoginBtn');
    if (adminForm) {
      adminForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        try {
          const response = await fetch(`${API_BASE_URL}/api/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          if (response.ok) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.removeItem('isGuest');
            window.location.href = 'index.html';
          } else {
            document.getElementById('loginError').style.display = 'block';
          }
        } catch (err) {
          document.getElementById('loginError').style.display = 'block';
        }
      });
    }
    if (guestBtn) {
      guestBtn.addEventListener('click', function() {
        localStorage.setItem('isGuest', 'true');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
      });
    }
  });
  