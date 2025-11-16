const products = [
            { id: "1001", name: "Classic Espresso Machine", price: 349.99, currency: "USD", image_url: "img 1.png", description: "High-pressure, semi-automatic espresso maker with built-in frother. Perfect for the home barista.", discount: { is_on_sale: true, discount_percentage: 10, sale_price: 314.99 } },
            { id: "1002", name: "Organic Linen Bed Sheet Set (Queen)", price: 129.00, currency: "USD", image_url: "img 2.png", description: "Luxurious 100% organic linen sheets. Breathable, durable, and naturally moisture-wicking.", discount: { is_on_sale: false, discount_percentage: 0, sale_price: 129.00 } },
            { id: "1003", name: "4K Ultra HD Smart TV (55-Inch)", price: 799.99, currency: "USD", image_url: "img 3.png", description: "Stunning 4K resolution with smart features and voice control. Unbeatable viewing experience.", discount: { is_on_sale: true, discount_percentage: 15, sale_price: 679.99 } },
            { id: "1004", name: "Waterproof Hiking Backpack (50L)", price: 89.50, currency: "USD", image_url: "img 4.png", description: "Durable, lightweight 50-liter backpack with all-weather protection and ergonomic straps.", discount: { is_on_sale: false, discount_percentage: 0, sale_price: 89.50 } },
            { id: "1005", name: "Noise-Cancelling Earbuds", price: 149.99, currency: "USD", image_url: "img 5.png", description: "Compact true wireless earbuds with superior active noise cancellation and 8 hours of playback.", discount: { is_on_sale: true, discount_percentage: 5, sale_price: 142.49 } },
            { id: "1006", name: "Minimalist Leather Wallet", price: 45.00, currency: "USD", image_url: "img 6.png", description: "Slim, full-grain leather bifold wallet with RFID protection. Holds up to 6 cards.", discount: { is_on_sale: false, discount_percentage: 0, sale_price: 45.00 } },
            { id: "1007", name: "Professional Chef Knife Set (8-Piece)", price: 249.99, currency: "USD", image_url: "img 7.png", description: "High-carbon stainless steel knife set with ergonomic handles and a natural wood block.", discount: { is_on_sale: true, discount_percentage: 20, sale_price: 199.99 } },
            { id: "1008", name: "Bluetooth Mechanical Keyboard", price: 99.90, currency: "USD", image_url: "img 8.png", description: "Compact 60% mechanical keyboard with tactile switches and multi-device Bluetooth connectivity.", discount: { is_on_sale: false, discount_percentage: 0, sale_price: 99.90 } },
        ];

        let cart = []; // Global state for the shopping cart
        let selectedProduct = null; // Store the currently selected product for modal actions

        // --- DOM REFERENCES ---
        const productSection = document.getElementById('productSection');
        const aboutSection = document.getElementById('aboutSection');
        const contactSection = document.getElementById('contactSection');
        const productList = document.getElementById('product-list');
        const navLinks = document.querySelectorAll('.nav-link');

        const cartDrawer = document.getElementById('cart-drawer');
        const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
        const cartCount = document.getElementById('cart-count');
        const cartItemsList = document.getElementById('cart-items-list');
        const cartTotalDisplay = document.getElementById('cart-total');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const checkoutBtn = document.getElementById('checkout-btn');

        const detailModal = document.getElementById('product-detail-modal');
        const paymentModal = document.getElementById('payment-modal');

        // --- CORE NAVIGATION LOGIC ---

        function showPage(pageName) {
            // Hide all content sections initially
            productSection.classList.add('hidden');
            aboutSection.classList.add('hidden');
            contactSection.classList.add('hidden');

            // Remove active state from all navigation links
            navLinks.forEach(link => {
                link.classList.remove('bg-indigo-100', 'text-indigo-700');
                link.classList.add('text-gray-700');
            });

            // Show the requested section and set active link
            let activeLink;
            switch (pageName) {
                case 'home':
                    productSection.classList.remove('hidden');
                    activeLink = document.getElementById('nav-home');
                    break;
                case 'about':
                    aboutSection.classList.remove('hidden');
                    activeLink = document.getElementById('nav-about');
                    break;
                case 'contact':
                    contactSection.classList.remove('hidden');
                    activeLink = document.getElementById('nav-contact');
                    break;
                default:
                    productSection.classList.remove('hidden');
                    activeLink = document.getElementById('nav-home');
                    break;
            }

            // Apply active styles to the current link
            if (activeLink) {
                activeLink.classList.remove('text-gray-700');
                activeLink.classList.add('bg-indigo-100', 'text-indigo-700');
            }
        }

        // --- PRODUCT RENDERING (Updated to show sale/discount) ---

        function renderProducts() {
            productList.innerHTML = products.map(product => {
                const isSale = product.discount.is_on_sale;
                const displayPrice = isSale ? product.discount.sale_price : product.price;
                const originalPrice = isSale ? product.price : null;

                return `
                    <div class="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer relative"
                        onclick="openProductDetails('${product.id}')">
                        ${isSale ? `<span class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">SALE ${product.discount.discount_percentage}%</span>` : ''}

                        <img src="${product.image_url}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4" onerror="this.onerror=null;this.src='https://placehold.co/400x300/a78bfa/ffffff?text=Product';"">
                        <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-sm text-gray-500 mt-1 truncate">${product.description}</p>
                        <div class="flex flex-col mt-3">
                            <div class="flex items-end justify-start">
                                <span class="text-xl font-bold text-indigo-600">$${displayPrice.toFixed(2)}</span>
                                ${originalPrice ? `<span class="text-sm text-gray-400 line-through ml-2">$${originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <button onclick="event.stopPropagation(); addToCart('${product.id}', true)" class="mt-2 bg-indigo-500 text-white px-3 py-1 text-sm rounded-full hover:bg-indigo-700 transition">Quick Add</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // --- PRODUCT DETAIL MODAL LOGIC (Updated for sale/discount) ---

        function openProductDetails(productId) {
            selectedProduct = products.find(p => p.id === productId);

            if (selectedProduct) {
                const isSale = selectedProduct.discount.is_on_sale;
                const displayPrice = isSale ? selectedProduct.discount.sale_price : selectedProduct.price;
                const originalPrice = isSale ? selectedProduct.price : null;

                document.getElementById('modal-image-container').innerHTML = `<img src="${selectedProduct.image_url}" alt="${selectedProduct.name}" class="w-full h-96 object-cover rounded-md shadow-lg">`;
                document.getElementById('modal-title').textContent = selectedProduct.name;
                document.getElementById('modal-description').textContent = selectedProduct.description;

                // Update modal price display
                let priceHtml = `<span class="text-3xl font-semibold text-indigo-600">$${displayPrice.toFixed(2)}</span>`;
                if (originalPrice) {
                    priceHtml += `<span class="text-lg text-gray-400 line-through ml-3">$${originalPrice.toFixed(2)}</span>`;
                    priceHtml += `<span class="text-base text-red-600 ml-3 font-medium">(Save ${selectedProduct.discount.discount_percentage}%)</span>`;
                }
                document.getElementById('modal-price').innerHTML = priceHtml;

                detailModal.classList.remove('hidden');
                detailModal.classList.add('flex');
            }
        }

        function addProductFromModal() {
            if (selectedProduct) {
                addToCart(selectedProduct.id);
                closeModal('product-detail-modal');
            }
        }

        // --- CART LOGIC (Updated to save purchase price) ---

        function addToCart(productId, showDrawer = false) {
            const product = products.find(p => p.id === productId);
            if (product) {
                // Determine the price the customer is paying
                const purchasePrice = product.discount.is_on_sale ? product.discount.sale_price : product.price;

                const existingItem = cart.find(item => item.id === productId);

                if (existingItem) {
                    // Assuming if ID matches, we increment quantity
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        image: product.image_url,
                        price: purchasePrice, // Store the price at the time of adding to cart
                        originalPrice: product.price, // Store original price for display comparison
                        isSale: product.discount.is_on_sale,
                        quantity: 1
                    });
                }

                updateCartUI();
                if (showDrawer) {
                    openCart();
                }
            }
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartCount.textContent = totalItems;
            cartTotalDisplay.textContent = `$${totalCost.toFixed(2)}`;

            if (totalItems > 0) {
                emptyCartMessage.classList.add('hidden');
                checkoutBtn.disabled = false;
            } else {
                emptyCartMessage.classList.remove('hidden');
                checkoutBtn.disabled = true;
            }

            cartItemsList.innerHTML = cart.map(item => `
                <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-grow">
                        <p class="font-semibold text-gray-800">${item.name}</p>
                        <p class="text-sm text-gray-600">Qty: ${item.quantity} @ $${item.price.toFixed(2)}</p>
                        ${item.isSale ? `<span class="text-xs font-medium text-red-600">Sale Applied!</span>` : ''}
                    </div>
                    <p class="font-bold text-indigo-600">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `).join('');
        }

        function openCart() {
            cartDrawer.classList.add('open');
            cartDrawerOverlay.classList.remove('hidden');
        }

        function closeCart() {
            cartDrawer.classList.remove('open');
            cartDrawerOverlay.classList.add('hidden');
        }

        // --- MODAL & CHECKOUT LOGIC ---

        function checkout(fromCart = false) {
            // Close any currently open modals/drawers
            closeModal('product-detail-modal');
            if (fromCart) {
                closeCart();
            }

            // Show payment modal
            paymentModal.classList.remove('hidden');
            paymentModal.classList.add('flex');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');

                // If closing payment modal, reset cart
                if (modalId === 'payment-modal') {
                    cart = [];
                    updateCartUI();
                }
            }
        }

        // --- INITIALIZATION ---
        window.onload = () => {
            renderProducts();
            updateCartUI();
            showPage('home'); // Ensure products are visible on load
        };
