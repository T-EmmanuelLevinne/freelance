// Slider functionality
(function() {
  const slides = Array.from(document.querySelectorAll('.slider-image'));
  let current = 0;
  let order = slides.map((_, i) => i);
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
  }
  function nextSlide() {
    current = (current + 1) % slides.length;
    if (current === 0) order = shuffle(order);
    showSlide(order[current]);
  }
  // Initial shuffle and show
  order = shuffle(order);
  showSlide(order[current]);
  setInterval(nextSlide, 5000);
})(); 

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
})
  // Hide Admin link if logged in
  document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      var adminLink = document.querySelector('a[href="admin-login.html"]');
      if (adminLink) adminLink.style.display = 'none';
    }
  });
  // Show/hide Logout link based on login state
  document.addEventListener('DOMContentLoaded', function() {
    var logoutNavItem = document.getElementById('logoutNavItem');
    var logoutNavLink = document.getElementById('logoutNavLink');
    if (localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('isGuest') === 'true') {
      if (logoutNavItem) logoutNavItem.style.display = 'list-item';
    } else {
      if (logoutNavItem) logoutNavItem.style.display = 'none';
    }
    if (logoutNavLink) {
      logoutNavLink.onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isGuest');
        window.location.href = 'index.html';
      };
    }
  });
    // Hide Admin link if logged in
    document.addEventListener('DOMContentLoaded', function() {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        var adminLink = document.querySelector('a[href="admin-login.html"]');
        if (adminLink) adminLink.style.display = 'none';
      }
    });
    // Show/hide Logout link based on login state (admin only)
    document.addEventListener('DOMContentLoaded', function() {
      var logoutNavItem = document.getElementById('logoutNavItem');
      var logoutNavLink = document.getElementById('logoutNavLink');
      if (localStorage.getItem('isLoggedIn') === 'true' && !localStorage.getItem('isGuest')) {
        if (logoutNavItem) logoutNavItem.style.display = 'list-item';
      } else {
        if (logoutNavItem) logoutNavItem.style.display = 'none';
      }
      if (logoutNavLink) {
        logoutNavLink.onclick = function(e) {
          e.preventDefault();
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('isGuest');
          window.location.href = 'index.html';
        };
      }
    });