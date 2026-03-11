// Renora Jewellery Main Script

// --- Configurations & Data ---
const config = {
    sparkleCount: window.innerWidth < 768 ? 40 : 100,
    colors: ['#f4a7b9', '#ffe4e9', '#ffffff']
};

const products = [
    {
        id: 1,
        name: "Divine Rose Gold Ring",
        price: 12500,
        type: "Rings",
        material: "Rose Gold",
        image: "assets/rose_gold_diamond_ring_1772968757245.png",
        description: "A breathtaking rose gold ring adorned with high-quality diamonds, designed to capture the essence of divine elegance."
    },
    {
        id: 2,
        name: "Goddess Radiant Necklace",
        price: 45000,
        type: "Necklaces",
        material: "Rose Gold",
        image: "assets/rose_gold_necklace_1772968772942.png",
        description: "An intricate rose gold necklace that radiates celestial beauty. Perfect for the modern goddess."
    },
    {
        id: 3,
        name: "Timeless Oxidised Earrings",
        price: 4500,
        type: "Earrings",
        material: "Oxidised",
        image: "assets/oxidised_silver_earrings_luxury_1772968788267.png",
        description: "Handcrafted oxidised silver earrings featuring traditional motifs with a luxury finish."
    },
    {
        id: 4,
        name: "Celestial Rose Gold Bracelet",
        price: 18500,
        type: "Bracelets",
        material: "Rose Gold",
        image: "assets/rose_gold_bracelet_divine_1772968804984.png",
        description: "A soft pink tone rose gold bracelet that adds a touch of divine radiance to your wrist."
    },
    {
        id: 5,
        name: "Eternal Radiance Pendant",
        price: 8500,
        type: "Pendant",
        material: "Rose Gold",
        image: "assets/elegant_pendant_goddess_style_1772968821347.png",
        description: "A minimal yet divine pendant crafted in premium rose gold, symbolizing eternal elegance."
    }
];

// --- State ---
let cart = [];
let currentFilters = { type: 'all', material: 'all', search: '' };

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("JS STARTED");
    try {
        initHeroSparkles();
        initNavbar();
        initFilters();
        initCart();
        initModal();
        initCheckout();
        renderProducts();
        initParallax();
        initMobileMenu();
        initSearch();
        initProductGlow();

        // Set Year
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.innerText = new Date().getFullYear();

        // Initial Reveal trigger
        reveal();
        window.addEventListener('scroll', reveal);
    } catch (err) {
        console.error("Init error:", err);
    }
});

window.onload = () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }, 1500);
    }
};

// --- Navbar Logic ---
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// --- Mobile Menu ---
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
}

// --- Parallax Effect ---
function initParallax() {

    const bg = document.querySelector(".hero-bg");
    const content = document.querySelector(".hero-content");
    const canvas = document.getElementById("hero-canvas");

    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;
        if (bg) {
            bg.style.transform = `translateY(${scroll * 0.45}px)`;
        }
        if (canvas) {
            canvas.style.transform = `translateY(${scroll * 0.55}px)`;
        }
        if (content) {
            content.style.transform = `translateY(${scroll * 0.12}px)`;
        }

    });
}

// --- Scroll Reveal ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 100;

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

const leftRing = document.querySelector(".left-ring img");
const rightRing = document.querySelector(".right-ring img");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    if(leftRing){
        leftRing.style.transform =
        `translateY(${-scroll * 0.55}px) scale(${1 + scroll*0.0004}) rotate(-20deg)`;
    }

    if(rightRing){
        rightRing.style.transform =
        `translateY(${-scroll * 1.03}px) scale(${1 + scroll*0.0004}) rotate(15deg)`;
    }

});

// --- Product Rendering ---
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = products.filter(p => {
        const typeMatch = currentFilters.type === 'all' || p.type === currentFilters.type;
        const materialMatch = currentFilters.material === 'all' || p.material === currentFilters.material;
        const searchMatch = p.name.toLowerCase().includes(currentFilters.search);
        return typeMatch && materialMatch && searchMatch;
    });

    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img loading="lazy" src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="openModal(${product.id})">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹ ${product.price.toLocaleString()}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

// --- Filtering Logic ---
function initFilters() {
    const typeBtns = document.querySelectorAll('#type-filters .filter-btn');
    const materialBtns = document.querySelectorAll('#material-filters .filter-btn');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.type = btn.dataset.filter;
            renderProducts();
        });
    });

    materialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            materialBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilters.material = btn.dataset.filter;
            renderProducts();
        });
    });
}

// --- Cart Logic ---
function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const sidebar = document.getElementById('cart-sidebar');

    if (cartBtn && closeCart && sidebar) {
        cartBtn.addEventListener('click', () => sidebar.classList.add('active'));
        closeCart.addEventListener('click', () => sidebar.classList.remove('active'));
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();

    // Shake animation
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('shake');
        setTimeout(() => cartIcon.classList.remove('shake'), 400);
    }

    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.add('active');
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (cartCount) cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<div class="empty-cart-msg">Your bag is empty</div>';
        if (subtotalEl) subtotalEl.innerText = '₹ 0';
        return;
    }

    if (cartItems) {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">₹ ${item.price.toLocaleString()}</p>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.innerText = `₹ ${subtotal.toLocaleString()}`;
}

function updateQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// --- Modal Logic ---
function initModal() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('close-modal');

    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.classList.remove('active');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');

    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div class="modal-img">
                <img src="${product.image}" alt="${product.name}" id="zoom-img">
            </div>
            <div class="modal-info">
                <span class="material">${product.material} | ${product.type}</span>
                <h2>${product.name}</h2>
                <span class="price">₹ ${product.price.toLocaleString()}</span>
                <p class="description">${product.description}</p>
                <div class="hero-btns" style="justify-content: flex-start; gap: 15px;">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Bag</button>
                    <a href="https://chat.whatsapp.com/Jn5tMX8z0XYJp46KHz6apD" target="_blank" class="btn btn-outline" style="border-radius: 30px; font-size: 13px;"><i class="fab fa-whatsapp"></i> Buy on WhatsApp</a>
                </div>
            </div>
        `;

        modal.classList.add('active');

        // Simple zoom effect
        const img = document.getElementById('zoom-img');
        if (img) {
            img.addEventListener('mousemove', (e) => {
                const x = e.offsetX / img.offsetWidth;
                const y = e.offsetY / img.offsetHeight;
                img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
                img.style.transform = 'scale(2)';
            });
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        }
    }
}

// --- Checkout Modal Logic ---
function initCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckout = document.getElementById('close-checkout');

    if (checkoutBtn && checkoutModal && closeCheckout) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your bag is empty!");
                return;
            }

            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const totalEl = document.getElementById('checkout-total');
            if (totalEl) totalEl.innerText = `₹ ${subtotal.toLocaleString()}`;

            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) cartSidebar.classList.remove('active');
            checkoutModal.classList.add('active');
        });

        closeCheckout.onclick = () => checkoutModal.classList.remove('active');
    }
}

// --- Hero Sparkle Particles (Canvas) ---
function initHeroSparkles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // prevent crash

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random();
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < config.sparkleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
}
