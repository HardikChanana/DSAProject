// In-memory cache to store frequently viewed products
let cache = {};

document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById('product-list');
    const productModal = document.getElementById('product-modal');
    const productDetails = document.getElementById('product-details');
    const closeModal = document.getElementById('close-modal');
    const timeDisplay = document.getElementById('time-display'); // For displaying request time

    // Sample product data (In a real setup, this would be fetched from a server)
    const products = [
        { id: 1, name: 'Product 1', image: 'product1.jpg', description: 'Description of Product 1' },
        { id: 2, name: 'Product 2', image: 'product2.jpg', description: 'Description of Product 2' },
        // Add more products as needed
    ];

    // Function to display products in catalog
    function displayProducts() {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.id = `product-${product.id}`; // Assign ID for styling
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <button onclick="viewProduct(${product.id})">View Details</button>
            `;
            productList.appendChild(productCard);
        });
    }

    // Function to simulate fetching product details from a server
    async function fetchProductFromServer(productId) {
        // Simulating a server request delay
        return new Promise(resolve => {
            setTimeout(() => {
                const product = products.find(p => p.id === productId);
                console.log("Fetching product from server:", product);
                resolve(product);
            }, 1000); // Simulate network delay
        });
    }

    // Function to display product details in modal with caching mechanism
    window.viewProduct = async function(productId) {
        let product;
        const productCard = document.getElementById(`product-${productId}`);

        // Measure start time
        const startTime = performance.now();

        // Check if product is already in the cache
        if (cache[productId]) {
            product = cache[productId];
            console.log("Retrieved product from cache:", product);
            productCard.style.filter = "grayscale(100%)"; // Apply greyish tone if cached

            // Measure end time for cache request
            const endTime = performance.now();
            timeDisplay.innerText = `Cache request time: ${(endTime - startTime).toFixed(2)} ms`;
        } else {
            // Fetch product from the "server" if not in cache
            product = await fetchProductFromServer(productId);
            cache[productId] = product;  // Add product to cache
            console.log("Product added to cache:", product);
            productCard.style.filter = "none"; // No greyish tone if fetched from server

            // Measure end time for server request
            const endTime = performance.now();
            timeDisplay.innerText = `Server request time: ${(endTime - startTime).toFixed(2)} ms`;
        }

        // Display product details in the modal
        productDetails.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
        `;
        productModal.style.display = 'flex';
    };

    // Close modal event
    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Display products on page load
    displayProducts();
});
