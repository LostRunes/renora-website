// Renora Jewellery Main Script

// --- Configurations ---
const config = {
    sparkleCount: window.innerWidth < 768 ? 40 : 100,
    colors: ['#f4a7b9', '#ffe4e9', '#ffffff']
};

// Products will come from backend
let products = [];

// --- State ---
let cart = [];
let currentFilters = { type: 'all', material: 'all', search: '' };


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {

    console.log("JS STARTED");

    initHeroSparkles();
    initNavbar();
    initFilters();
    initCart();
    initModal();
    initCheckout();
    initParallax();
    initMobileMenu();

    fetchProducts();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    reveal();
    window.addEventListener('scroll', reveal);
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


// --- Fetch Products ---
async function fetchProducts() {

    try {

        const res = await fetch("http://localhost:5000/products");
        products = await res.json();

        console.log("Products Loaded:", products);

        renderProducts();

    } catch (error) {

        console.error("Error fetching products:", error);

    }

}


// --- Navbar ---
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

    if (!mobileBtn || !navLinks) return;

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });

}


// --- Parallax ---
function initParallax() {

    const hero = document.querySelector('.hero');
    const jewellery = document.getElementById('hero-jewellery');

    if (!hero || !jewellery) return;

    hero.addEventListener('mousemove', (e) => {

        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;

        jewellery.style.transform =
            `translate(${x}px, ${y}px) rotate(${x / 2}deg)`;

    });

}


// --- Scroll Reveal ---
function reveal() {

    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(el => {

        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;

        if (revealTop < windowHeight - 100) {
            el.classList.add('active');
        }

    });

}


// --- Render Products ---
function renderProducts() {

    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = products.filter(p => {

        const typeMatch =
            currentFilters.type === 'all' || p.type === currentFilters.type;

        const materialMatch =
            currentFilters.material === 'all' || p.material === currentFilters.material;

        const searchMatch =
            p.name.toLowerCase().includes(currentFilters.search);

        return typeMatch && materialMatch && searchMatch;

    });


    grid.innerHTML = filtered.map(product => `

        <div class="product-card">

            <div class="product-image-container">

                <img src="${product.image}" alt="${product.name}">

                <div class="product-overlay">
                    <button class="quick-view-btn"
                    onclick="openModal('${product._id}')">
                    Quick View
                    </button>
                </div>

            </div>

            <div class="product-info">

                <h3 class="product-name">${product.name}</h3>

                <p class="product-price">
                ₹ ${Number(product.price).toLocaleString()}
                </p>

                <button class="add-to-cart-btn"
                onclick="addToCart('${product._id}')">
                Add to Bag
                </button>

            </div>

        </div>

    `).join('');

}


// --- Filters ---
function initFilters() {

    const typeBtns =
        document.querySelectorAll('#type-filters .filter-btn');

    const materialBtns =
        document.querySelectorAll('#material-filters .filter-btn');


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


// --- Cart ---
function initCart() {

    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const sidebar = document.getElementById('cart-sidebar');

    if (!cartBtn || !closeCart || !sidebar) return;

    cartBtn.addEventListener('click', () => sidebar.classList.add('active'));
    closeCart.addEventListener('click', () => sidebar.classList.remove('active'));

}


function addToCart(productId) {

    const product =
        products.find(p => String(p._id) === String(productId));

    if (!product) {
        console.log("Product not found");
        return;
    }

    const existing =
        cart.find(item => item.productId === productId);


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1

        });

    }

    updateCartUI();

}


function updateCartUI() {

    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (!cartItems) return;

    cartCount.innerText =
        cart.reduce((acc, item) => acc + item.quantity, 0);


    if (cart.length === 0) {

        cartItems.innerHTML = "Your bag is empty";
        subtotalEl.innerText = "₹ 0";
        return;

    }


    cartItems.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

            <img src="${item.image}" width="60">

            <div>

                <h4>${item.name}</h4>

                <p>₹ ${Number(item.price).toLocaleString()}</p>

                <button onclick="updateQty(${index},-1)">-</button>

                ${item.quantity}

                <button onclick="updateQty(${index},1)">+</button>

            </div>

        </div>

    `).join("");


    const subtotal =
        cart.reduce((acc, item) =>
            acc + item.price * item.quantity, 0);

    subtotalEl.innerText =
        "₹ " + subtotal.toLocaleString();

}


function updateQty(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartUI();

}


// --- Modal ---
function initModal() {

    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('close-modal');

    if (!modal || !closeBtn) return;

    closeBtn.onclick = () =>
        modal.classList.remove('active');

}


function openModal(productId) {

    const product =
        products.find(p => String(p._id) === String(productId));

    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `

        <img src="${product.image}" width="300">

        <h2>${product.name}</h2>

        <p>${product.description}</p>

        <h3>₹ ${Number(product.price).toLocaleString()}</h3>

        <button onclick="addToCart('${product._id}')">
        Add to Bag
        </button>

    `;

    modal.classList.add('active');

}


// --- Checkout ---
function initCheckout() {

    const checkoutBtn = document.getElementById('checkout-btn');

    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', () => {

        if (cart.length === 0) {

            alert("Your bag is empty");
            return;

        }

        alert("Checkout coming soon!");

    });

}


// --- Sparkles ---
function initHeroSparkles() {

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];

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

            this.color =
                config.colors[Math.floor(Math.random() * config.colors.length)];

        }

        update() {

            this.x += this.speedX;
            this.y += this.speedY;

            if (
                this.x < 0 ||
                this.x > width ||
                this.y < 0 ||
                this.y > height
            ) {
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

    for (let i = 0; i < config.sparkleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {

        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);

    }

    animate();

}