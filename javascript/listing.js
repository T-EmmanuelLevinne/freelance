// --- API URL LOGIC FOR RENDER/GITHUB PAGES/LOCAL ---
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isGithubPages = window.location.hostname.endsWith('.github.io');
// CHANGE THIS to your actual Render backend URL after deployment:
const RENDER_API_URL = 'https://freelancer-dfbx.onrender.com';
const API_BASE_URL = isLocalhost
    ? 'http://localhost:50118'
    : (isGithubPages ? RENDER_API_URL : window.location.origin);

let properties = [];

// Fetch properties from backend
async function fetchProperties() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties`);
    properties = await res.json();
    applyFilters();
  } catch (e) {
    properties = [];
    applyFilters();
  }
}

// Add property via backend
async function addPropertyBackend(data) {
  const res = await fetch(`${API_BASE_URL}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    await fetchProperties();
  }
}

// Edit property via backend
async function editPropertyBackend(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    await fetchProperties();
  }
}

// Delete property via backend
async function deletePropertyBackend(id) {
  const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    await fetchProperties();
  }
}

// Call fetchProperties on page load
document.addEventListener('DOMContentLoaded', fetchProperties);

const PAGE_SIZE = 6;
let filtered = properties;
let currentPage = 1;

// Utility
function formatPrice(price) {
  return `₱${price.toLocaleString()}`;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Render property cards
function renderGrid() {
  const grid = document.getElementById('listingGrid');
  grid.innerHTML = '';
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageProps = filtered.slice(start, end);

  if (pageProps.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#888; padding:2rem 0;">No properties found, try adjusting the price.</div>';
    return;
  }

  const isAdmin = localStorage.getItem('isLoggedIn') === 'true' && !localStorage.getItem('isGuest');

  pageProps.forEach(prop => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
      <img src="${prop.images[0]}" alt="${prop.title}">
      <div class="property-card-content">
        <div class="property-card-title">${prop.title}</div>
        <div class="property-card-meta">${capitalizeFirst(prop.location)} &middot; <span class="property-card-type">${capitalizeFirst(prop.type)}</span></div>
        <div class="property-card-price">${formatPrice(prop.price)}</div>
        <div class="property-card-actions">
          <button onclick="openModal(${prop.id})">Quick View</button>
          ${isAdmin ? `<button class="edit-btn" data-id="${prop.id}">Edit</button><button class="delete-btn" data-id="${prop.id}">Delete</button>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Add event listeners for edit/delete (admin only)
  if (isAdmin) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.onclick = function() {
        const id = parseInt(this.getAttribute('data-id'), 10);
        openEditModal(id);
      };
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = function() {
        const id = parseInt(this.getAttribute('data-id'), 10);
        if (confirm('Are you sure you want to delete this property?')) {
          deletePropertyBackend(id);
        }
      };
    });
  }
}

// Render pagination
function renderPagination() {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      currentPage = i;
      renderGrid();
      renderPagination();
    };
    pag.appendChild(btn);
  }
}

// Filtering logic
function applyFilters() {
  const type = document.getElementById('filterType').value;
  const location = document.getElementById('filterLocation').value;
  const search = document.getElementById('searchInput').value.trim().toLowerCase();

  filtered = properties.filter(p => {
    let match = true;
    if (type && p.type !== type) match = false;
    if (location && p.location.toLowerCase() !== location) match = false;
    if (search && !(
      p.title.toLowerCase().includes(search) ||
      (p.location && p.location.toLowerCase().includes(search)) ||
      (p.description && p.description.toLowerCase().includes(search)) ||
      (p.price && p.price.toLowerCase().includes(search))
    )) match = false;
    return match;
  });
  currentPage = 1;
  renderGrid();
  renderPagination();
}

// Modal logic
window.openModal = function(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;
  document.getElementById('propertyModal').classList.add('open');
  document.getElementById('modalTitle').textContent = prop.title;
  document.getElementById('modalLocation').textContent = capitalizeFirst(prop.location);
  document.getElementById('modalType').textContent = capitalizeFirst(prop.type);
  document.getElementById('modalPrice').textContent = formatPrice(prop.price);
  document.getElementById('modalPrice').style.color = '#1bbf3a';
  document.getElementById('modalDescription').textContent = prop.description;

  // Gallery
  const gallery = document.getElementById('modalGallery');
  gallery.innerHTML = '';
  prop.images.forEach((img, idx) => {
    const image = document.createElement('img');
    image.src = img;
    image.alt = prop.title + ' image';
    if (idx === 0) image.classList.add('active');
    image.onclick = () => {
      gallery.querySelectorAll('img').forEach(i => i.classList.remove('active'));
      image.classList.add('active');
      // Show in theater overlay
      const theaterOverlay = document.getElementById('theaterOverlay');
      const theaterImage = document.getElementById('theaterImage');
      theaterImage.src = image.src;
      theaterOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
    gallery.appendChild(image);
  });
  // Theater overlay close logic
  if (typeof window._theaterOverlayInit === 'undefined') {
    window._theaterOverlayInit = true;
    const theaterOverlay = document.getElementById('theaterOverlay');
    const theaterImage = document.getElementById('theaterImage');
    const theaterClose = document.getElementById('theaterClose');
    theaterClose.onclick = function() {
      theaterOverlay.style.display = 'none';
      theaterImage.src = '';
      document.body.style.overflow = '';
    };
    theaterOverlay.onclick = function(e) {
      if (e.target === theaterOverlay) {
        theaterOverlay.style.display = 'none';
        theaterImage.src = '';
        document.body.style.overflow = '';
      }
    };
  }
};

document.getElementById('modalClose').onclick = function() {
  document.getElementById('propertyModal').classList.remove('open');
};

document.getElementById('filterForm').onsubmit = function(e) {
  e.preventDefault();
  applyFilters();
};

// Listen for filter changes (instant filtering)
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);
document.getElementById('filterLocation').addEventListener('change', applyFilters);

// Initial render
applyFilters(); 

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

// Scroll-to-top button logic
window.addEventListener('scroll', function() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;
  if (window.scrollY > 200) {
    btn.style.display = 'flex';
    btn.style.opacity = '1';
  } else {
    btn.style.opacity = '0';
    setTimeout(() => { if (btn.style.opacity === '0') btn.style.display = 'none'; }, 200);
  }
});
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
  scrollToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

window.openMessengerApp = function() {
  var appLink = 'fb://profile/100094603105010'; // Facebook user ID
  var webLink = 'https://www.facebook.com/elmer.tecson.105010';
  // Try to open the app
  window.location = appLink;
  // Fallback to web after 1 second
  setTimeout(function() {
    window.open(webLink, '_blank');
  }, 1000);
};

// Add Property logic (admin only)
if (localStorage.getItem('isLoggedIn') === 'true') {
  const addPropertyForm = document.getElementById('addPropertyForm');
  const addImagesInput = document.getElementById('addImages');
  const addImagePreview = document.getElementById('addImagePreview');
  let addImagesArray = [];

  // Preview and discard logic
  if (addImagesInput && addImagePreview) {
    addImagesInput.addEventListener('change', function() {
      addImagesArray = [];
      addImagePreview.innerHTML = '';
      const files = Array.from(addImagesInput.files);
      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = function(event) {
          addImagesArray.push({ data: event.target.result, file });
          renderAddImagePreview();
        };
        reader.readAsDataURL(file);
      });
    });
    function renderAddImagePreview() {
      addImagePreview.innerHTML = '';
      addImagesArray.forEach((imgObj, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        const image = document.createElement('img');
        image.src = imgObj.data;
        image.style.width = '48px';
        image.style.height = '48px';
        image.style.objectFit = 'cover';
        image.style.borderRadius = '0.5rem';
        image.style.marginRight = '0.3rem';
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.type = 'button';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '-8px';
        removeBtn.style.right = '-8px';
        removeBtn.style.background = '#fff';
        removeBtn.style.color = '#e53e3e';
        removeBtn.style.border = '1px solid #eee';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.fontSize = '1rem';
        removeBtn.style.cursor = 'pointer';
        removeBtn.onclick = function() {
          addImagesArray.splice(idx, 1);
          renderAddImagePreview();
        };
        wrapper.appendChild(image);
        wrapper.appendChild(removeBtn);
        addImagePreview.appendChild(wrapper);
      });
    }
  }

  if (addPropertyForm) {
    addPropertyForm.onsubmit = function(e) {
      e.preventDefault();
      const title = document.getElementById('addTitle').value.trim();
      const type = document.getElementById('addType').value;
      const location = document.getElementById('addLocation').value;
      const price = document.getElementById('addPrice').value.trim();
      const description = document.getElementById('addDescription').value.trim();
      // Use addImagesArray for images
      if (!title || !type || !location || !price || !description || !addImagesArray.length) return;
      const newId = properties.length ? Math.max(...properties.map(p => p.id)) + 1 : 1;
      const images = addImagesArray.map(imgObj => imgObj.data);
      const newProperty = {
        id: newId,
        title,
        type,
        location,
        price,
        description,
        images
      };
      addPropertyBackend(newProperty);
      document.getElementById('addPropertyModal').style.display = 'none';
      addPropertyForm.reset();
      addImagesArray = [];
      if (addImagePreview) addImagePreview.innerHTML = '';
    };
  }
}

// Edit Property logic (admin only)
window.openEditModal = function(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;
  document.getElementById('editId').value = prop.id;
  document.getElementById('editTitle').value = prop.title;
  document.getElementById('editType').value = prop.type;
  document.getElementById('editLocation').value = prop.location;
  document.getElementById('editPrice').value = prop.price;
  document.getElementById('editDescription').value = prop.description;
  // Preview images with remove option
  const preview = document.getElementById('editImagePreview');
  preview.innerHTML = '';
  // Make a copy so we can remove images before saving
  window._editImagesArray = prop.images.slice();
  window._editImagesToRemove = [];
  window._renderEditImagePreview = function() {
    preview.innerHTML = '';
    window._editImagesArray.forEach((img, idx) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      const image = document.createElement('img');
      image.src = img;
      image.style.width = '48px';
      image.style.height = '48px';
      image.style.objectFit = 'cover';
      image.style.borderRadius = '0.5rem';
      image.style.marginRight = '0.3rem';
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.type = 'button';
      removeBtn.style.position = 'absolute';
      removeBtn.style.top = '-8px';
      removeBtn.style.right = '-8px';
      removeBtn.style.background = '#fff';
      removeBtn.style.color = '#e53e3e';
      removeBtn.style.border = '1px solid #eee';
      removeBtn.style.borderRadius = '50%';
      removeBtn.style.width = '20px';
      removeBtn.style.height = '20px';
      removeBtn.style.fontSize = '1rem';
      removeBtn.style.cursor = 'pointer';
      removeBtn.onclick = function() {
        window._editImagesArray.splice(idx, 1);
        window._renderEditImagePreview();
      };
      wrapper.appendChild(image);
      wrapper.appendChild(removeBtn);
      preview.appendChild(wrapper);
    });
  };
  window._renderEditImagePreview();
  document.getElementById('editPropertyModal').style.display = 'flex';
};

const editPropertyForm = document.getElementById('editPropertyForm');
if (editPropertyForm) {
  editPropertyForm.onsubmit = function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editId').value, 10);
    const title = document.getElementById('editTitle').value.trim();
    const type = document.getElementById('editType').value;
    const location = document.getElementById('editLocation').value;
    const price = document.getElementById('editPrice').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const imageFiles = document.getElementById('editImages').files;
    let prop = properties.find(p => p.id === id);
    if (!prop) return;
    // If new images uploaded, replace images array
    if (imageFiles && imageFiles.length > 0) {
      const images = [];
      let loaded = 0;
      for (let i = 0; i < imageFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = function(event) {
          images[i] = event.target.result;
          loaded++;
          if (loaded === imageFiles.length) {
            prop.images = images;
            finishEdit();
          }
        };
        reader.readAsDataURL(imageFiles[i]);
      }
      function finishEdit() {
        prop.title = title;
        prop.type = type;
        prop.location = location;
        prop.price = price;
        prop.description = description;
        editPropertyBackend(id, prop);
        document.getElementById('editPropertyModal').style.display = 'none';
        editPropertyForm.reset();
      }
    } else {
      // No new images, just update other fields and remove any discarded images
      prop.title = title;
      prop.type = type;
      prop.location = location;
      prop.price = price;
      prop.description = description;
      if (window._editImagesArray) {
        prop.images = window._editImagesArray.slice();
      }
      editPropertyBackend(id, prop);
      document.getElementById('editPropertyModal').style.display = 'none';
      editPropertyForm.reset();
    }
  };
}

 // Hide Admin link if logged in
 document.addEventListener('DOMContentLoaded', function() {
  var adminLink = document.querySelector('a[href="admin-login.html"]');
  var managePropertyNavItem = document.getElementById('managePropertyNavItem');
  var managePropertyNavLink = document.getElementById('managePropertyNavLink');
  var addPropertyModal = document.getElementById('addPropertyModal');
  var editPropertyModal = document.getElementById('editPropertyModal');
  // Only show Manage Property for admin
  if (localStorage.getItem('isLoggedIn') === 'true' && !localStorage.getItem('isGuest')) {
    if (adminLink) adminLink.style.display = 'none';
    if (managePropertyNavItem) managePropertyNavItem.style.display = 'list-item';
    // Removed: if (editPropertyModal) editPropertyModal.style.display = 'flex';
  } else {
    if (managePropertyNavItem) managePropertyNavItem.style.display = 'none';
    if (addPropertyModal) addPropertyModal.style.display = 'none';
    if (editPropertyModal) editPropertyModal.style.display = 'none';
  }
});
// Manage Property Modal logic
const managePropertyNavLink = document.getElementById('managePropertyNavLink');
const addPropertyModal = document.getElementById('addPropertyModal');
const closeAddPropertyModal = document.getElementById('closeAddPropertyModal');
const editPropertyModal = document.getElementById('editPropertyModal');
const closeEditPropertyModal = document.getElementById('closeEditPropertyModal');
if (managePropertyNavLink && addPropertyModal && closeAddPropertyModal) {
  managePropertyNavLink.onclick = (e) => { e.preventDefault(); addPropertyModal.style.display = 'flex'; };
  closeAddPropertyModal.onclick = () => { addPropertyModal.style.display = 'none'; };
  addPropertyModal.onclick = (e) => { if (e.target === addPropertyModal) addPropertyModal.style.display = 'none'; };
}
if (editPropertyModal && closeEditPropertyModal) {
  closeEditPropertyModal.onclick = () => { editPropertyModal.style.display = 'none'; };
}
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