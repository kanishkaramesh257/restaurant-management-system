/* =========================================================
   RESTAURANT MANAGEMENT SYSTEM
   script.js
   ========================================================= */


/* =========================================================
   BACKEND CONFIGURATION
   ========================================================= */

const API_BASE_URL = "http://localhost:8082/api";

/*
 * Fixed Admin ID.
 * There is no Admin table in the current database,
 * so Admin uses this frontend-defined ID.
 */
const ADMIN_ID = "ADMIN001";


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let selectedRole = "customer";

let currentUserId = null;

let currentUser = null;

let restaurants = [];

let menuItems = [];

let customers = [];

let staffMembers = [];

let orders = [];

let cart = [];

let selectedRestaurant = null;


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupLogin();

    updateCartDisplay();

});


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        login();

    });

}


/*
 * Change Customer / Staff / Admin
 */

function selectRole(role) {

    selectedRole = role;

    const roleButtons =
        document.querySelectorAll(".role-button");

    roleButtons.forEach(function (button) {

        button.classList.remove("active");

        if (button.dataset.role === role) {
            button.classList.add("active");
        }

    });


    const idInput =
        document.getElementById("userId");

    const idLabel =
        document.getElementById("idLabel");


    if (!idInput || !idLabel) {
        return;
    }


    if (role === "customer") {

        idLabel.textContent = "Customer ID";

        idInput.placeholder = "Enter customer ID";

        idInput.value = "";

        idInput.readOnly = false;

    }


    else if (role === "staff") {

        idLabel.textContent = "Staff ID";

        idInput.placeholder = "Enter staff ID";

        idInput.value = "";

        idInput.readOnly = false;

    }


    else if (role === "admin") {

        idLabel.textContent = "Admin ID";

        idInput.placeholder = "Admin ID";

        /*
         * Automatically fill the fixed Admin ID.
         */
        idInput.value = ADMIN_ID;

        /*
         * User doesn't need to modify it.
         */
        idInput.readOnly = true;

    }

}


/*
 * Main login function
 */

async function login() {

    const input =
        document.getElementById("userId");

    const message =
        document.getElementById("loginMessage");


    if (!input || !message) {
        return;
    }


    const userId =
        input.value.trim();


    if (!userId) {

        showLoginMessage(
            "Please enter your ID.",
            "error"
        );

        return;
    }


    /* ================================================
       ADMIN LOGIN
       ================================================ */

    if (selectedRole === "admin") {

        if (userId === ADMIN_ID) {

            currentUserId = ADMIN_ID;

            currentUser = {
                id: ADMIN_ID,
                role: "admin",
                name: "Administrator"
            };


            showApplication("admin");

            loadAdminDashboard();

            showLoginMessage("", "");

        }

        else {

            showLoginMessage(
                "Invalid Admin ID.",
                "error"
            );

        }

        return;
    }


    /* ================================================
       CUSTOMER LOGIN
       ================================================ */

    if (selectedRole === "customer") {

        try {

            const customer =
                await fetchById(
                    "/customers",
                    userId
                );


            if (!customer) {

                showLoginMessage(
                    "Customer ID not found.",
                    "error"
                );

                return;
            }


            currentUserId = userId;

            currentUser = customer;

            showApplication("customer");

            loadCustomerDashboard();

            showLoginMessage("", "");

        }

        catch (error) {

            console.error(error);

            showLoginMessage(
                "Unable to connect to the backend.",
                "error"
            );

        }

        return;
    }


    /* ================================================
       STAFF LOGIN
       ================================================ */

    if (selectedRole === "staff") {

        try {

            const staff =
                await fetchById(
                    "/staff",
                    userId
                );


            if (!staff) {

                showLoginMessage(
                    "Staff ID not found.",
                    "error"
                );

                return;
            }


            currentUserId = userId;

            currentUser = staff;

            showApplication("staff");

            loadStaffDashboard();

            showLoginMessage("", "");

        }

        catch (error) {

            console.error(error);

            showLoginMessage(
                "Unable to connect to the backend.",
                "error"
            );

        }

    }

}


/*
 * Display login message
 */

function showLoginMessage(message, type) {

    const element =
        document.getElementById("loginMessage");

    if (!element) {
        return;
    }


    element.textContent = message;

    element.style.color =
        type === "error"
            ? "#c0392b"
            : "#2e8b57";

}


/* =========================================================
   APPLICATION SWITCHING
   ========================================================= */

function showApplication(role) {

    const loginPage =
        document.getElementById("loginPage");

    const customerApp =
        document.getElementById("customerApp");

    const staffApp =
        document.getElementById("staffApp");

    const adminApp =
        document.getElementById("adminApp");


    if (loginPage) {
        loginPage.classList.add("hidden");
    }

    if (customerApp) {
        customerApp.classList.add("hidden");
    }

    if (staffApp) {
        staffApp.classList.add("hidden");
    }

    if (adminApp) {
        adminApp.classList.add("hidden");
    }


    if (role === "customer" && customerApp) {

        customerApp.classList.remove("hidden");

    }


    if (role === "staff" && staffApp) {

        staffApp.classList.remove("hidden");

    }


    if (role === "admin" && adminApp) {

        adminApp.classList.remove("hidden");

    }

}


/*
 * Logout
 */

function logout() {

    currentUserId = null;

    currentUser = null;

    selectedRestaurant = null;

    cart = [];


    const loginPage =
        document.getElementById("loginPage");

    const customerApp =
        document.getElementById("customerApp");

    const staffApp =
        document.getElementById("staffApp");

    const adminApp =
        document.getElementById("adminApp");


    if (customerApp) {
        customerApp.classList.add("hidden");
    }

    if (staffApp) {
        staffApp.classList.add("hidden");
    }

    if (adminApp) {
        adminApp.classList.add("hidden");
    }

    if (loginPage) {
        loginPage.classList.remove("hidden");
    }


    const userId =
        document.getElementById("userId");

    if (userId) {

        userId.value = "";

        userId.readOnly = false;

    }


    selectRole("customer");

    updateCartDisplay();

}


/* =========================================================
   GENERIC API FUNCTIONS
   ========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            API_BASE_URL + endpoint,
            {
                ...options,

                headers: {
                    "Content-Type": "application/json",

                    ...(options.headers || {})
                }
            }
        );


    if (!response.ok) {

        let errorMessage =
            `Request failed: ${response.status}`;

        try {

            const errorData =
                await response.json();

            errorMessage =
                errorData.message ||
                errorMessage;

        }

        catch (error) {
            // Ignore JSON parsing error.
        }


        throw new Error(errorMessage);

    }


    const contentType =
        response.headers.get("content-type");


    if (
        contentType &&
        contentType.includes("application/json")
    ) {

        return await response.json();

    }


    return await response.text();

}


/*
 * GET by ID
 */

async function fetchById(
    endpoint,
    id
) {

    try {

        return await apiRequest(
            `${endpoint}/${encodeURIComponent(id)}`
        );

    }

    catch (error) {

        /*
         * A 404 means the ID does not exist.
         */
        if (
            error.message.includes("404")
        ) {

            return null;

        }

        throw error;

    }

}


/* =========================================================
   CUSTOMER NAVIGATION
   ========================================================= */

function showCustomerSection(sectionId) {

    const sections =
        document.querySelectorAll(
            "#customerApp .page-section"
        );


    sections.forEach(function (section) {

        section.classList.add("hidden");

    });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.remove("hidden");

    }


    updateSidebarButtons(
        "#customerApp",
        sectionId
    );


    /*
     * Load data depending on selected page.
     */

    if (
        sectionId ===
        "customerRestaurantsSection"
    ) {

        loadRestaurants();

    }


    if (
        sectionId ===
        "customerCartSection"
    ) {

        renderCart();

    }


    if (
        sectionId ===
        "customerOrdersSection"
    ) {

        loadCustomerOrders();

    }


    if (
        sectionId ===
        "customerProfileSection"
    ) {

        loadCustomerProfile();

    }

}


/* =========================================================
   STAFF NAVIGATION
   ========================================================= */

function showStaffSection(sectionId) {

    const sections =
        document.querySelectorAll(
            "#staffApp .page-section"
        );


    sections.forEach(function (section) {

        section.classList.add("hidden");

    });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.remove("hidden");

    }


    updateSidebarButtons(
        "#staffApp",
        sectionId
    );


    if (
        sectionId ===
        "staffNewOrdersSection"
    ) {

        loadStaffOrders();

    }


    if (
        sectionId ===
        "staffPreparingSection"
    ) {

        loadStaffOrders();

    }


    if (
        sectionId ===
        "staffCompletedSection"
    ) {

        loadStaffOrders();

    }


    if (
        sectionId ===
        "staffProfileSection"
    ) {

        loadStaffProfile();

    }

}


/* =========================================================
   ADMIN NAVIGATION
   ========================================================= */

function showAdminSection(sectionId) {

    const sections =
        document.querySelectorAll(
            "#adminApp .page-section"
        );


    sections.forEach(function (section) {

        section.classList.add("hidden");

    });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.remove("hidden");

    }


    updateSidebarButtons(
        "#adminApp",
        sectionId
    );


    if (
        sectionId ===
        "adminDashboardSection"
    ) {

        loadAdminDashboard();

    }


    if (
        sectionId ===
        "adminRestaurantsSection"
    ) {

        loadAdminRestaurants();

    }


    if (
        sectionId ===
        "adminMenuSection"
    ) {

        loadAdminMenu();

    }


    if (
        sectionId ===
        "adminCustomersSection"
    ) {

        loadAdminCustomers();

    }


    if (
        sectionId ===
        "adminStaffSection"
    ) {

        loadAdminStaff();

    }


    if (
        sectionId ===
        "adminOrdersSection"
    ) {

        loadAdminOrders();

    }

}


/*
 * Sidebar active button
 */

function updateSidebarButtons(
    appSelector,
    sectionId
) {

    const buttons =
        document.querySelectorAll(
            `${appSelector} .sidebar-menu button`
        );


    buttons.forEach(function (button) {

        button.classList.remove("active");

    });


    /*
     * Find the button whose onclick contains
     * the section ID.
     */

    buttons.forEach(function (button) {

        const clickFunction =
            button.getAttribute("onclick") || "";


        if (
            clickFunction.includes(sectionId)
        ) {

            button.classList.add("active");

        }

    });

}


/* =========================================================
   CUSTOMER DASHBOARD
   ========================================================= */

async function loadCustomerDashboard() {

    try {

        await loadRestaurants();

        await loadCustomerOrders();

        loadCustomerProfile();

        updateCartDisplay();

    }

    catch (error) {

        console.error(
            "Customer dashboard error:",
            error
        );

    }

}


/* =========================================================
   RESTAURANTS
   ========================================================= */

async function loadRestaurants() {

    const grid =
        document.getElementById(
            "restaurantGrid"
        );


    if (grid) {

        grid.innerHTML =
            `<div class="loading">
                Loading restaurants...
             </div>`;

    }


    try {

        restaurants =
            await apiRequest(
                "/restaurants"
            );


        if (!Array.isArray(restaurants)) {

            restaurants = [];

        }


        renderRestaurants();


        const count =
            document.getElementById(
                "customerRestaurantCount"
            );


        if (count) {

            count.textContent =
                restaurants.length;

        }

    }

    catch (error) {

        console.error(error);

        if (grid) {

            grid.innerHTML =
                `<div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Unable to load restaurants</h3>
                    <p>
                        Make sure Spring Boot is running
                        on port 8082.
                    </p>
                 </div>`;

        }

    }

}


/*
 * Render restaurant cards
 */

function renderRestaurants(
    list = restaurants
) {

    const grid =
        document.getElementById(
            "restaurantGrid"
        );


    if (!grid) {
        return;
    }


    if (!list.length) {

        grid.innerHTML =
            `<div class="empty-state">
                <div class="empty-state-icon">🍽️</div>
                <h3>No restaurants found</h3>
                <p>
                    No restaurants match your search.
                </p>
             </div>`;

        return;

    }


    grid.innerHTML =
        list.map(function (restaurant) {

            return `
                <div class="restaurant-card">

                    <div class="restaurant-card-image">
                        🍽️
                    </div>

                    <div class="restaurant-card-content">

                        <h3>
                            ${escapeHtml(
                                restaurant.restaurantName
                                || "Restaurant"
                            )}
                        </h3>

                        <p class="restaurant-city">
                            📍
                            ${escapeHtml(
                                restaurant.city
                                || "City not available"
                            )}
                        </p>

                        <button
                            class="primary-button"
                            onclick="openRestaurantMenu('${escapeJs(
                                restaurant.restaurantId
                            )}')">

                            View Menu

                        </button>

                    </div>

                </div>
            `;

        }).join("");

}


/*
 * Restaurant search
 */

function filterRestaurants() {

    const input =
        document.getElementById(
            "restaurantSearch"
        );


    if (!input) {
        return;
    }


    const search =
        input.value
            .toLowerCase()
            .trim();


    const filtered =
        restaurants.filter(function (restaurant) {

            const name =
                String(
                    restaurant.restaurantName || ""
                ).toLowerCase();


            const city =
                String(
                    restaurant.city || ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                city.includes(search)
            );

        });


    renderRestaurants(filtered);

}


/* =========================================================
   RESTAURANT MENU
   ========================================================= */

async function openRestaurantMenu(
    restaurantId
) {

    selectedRestaurant =
        restaurants.find(function (restaurant) {

            return String(
                restaurant.restaurantId
            ) === String(restaurantId);

        });


    if (!selectedRestaurant) {

        alert("Restaurant not found.");

        return;

    }


    const nameElement =
        document.getElementById(
            "selectedRestaurantName"
        );


    if (nameElement) {

        nameElement.textContent =
            `Menu for ${selectedRestaurant.restaurantName}`;

    }


    showCustomerSection(
        "customerMenuSection"
    );


    await loadRestaurantMenu(
        restaurantId
    );

}


/*
 * Load menu items.
 */

async function loadRestaurantMenu(
    restaurantId
) {

    const grid =
        document.getElementById(
            "menuGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML =
        `<div class="loading">
            Loading menu...
         </div>`;


    try {

        /*
         * First get all menu items.
         * The project has restaurant_id on menu_item.
         */

        const data =
            await apiRequest(
                "/menu-items"
            );


        menuItems =
            Array.isArray(data)
                ? data
                : [];


        const restaurantMenu =
            menuItems.filter(
                function (item) {

                    return String(
                        item.restaurantId
                    ) === String(restaurantId);

                }
            );


        renderMenu(
            restaurantMenu
        );

    }

    catch (error) {

        console.error(error);

        grid.innerHTML =
            `<div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Unable to load menu</h3>
                <p>
                    Please check your backend.
                </p>
             </div>`;

    }

}


/*
 * Render menu
 */

function renderMenu(items) {

    const grid =
        document.getElementById(
            "menuGrid"
        );


    if (!grid) {
        return;
    }


    if (!items.length) {

        grid.innerHTML =
            `<div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>No menu items</h3>
                <p>
                    This restaurant has no menu items.
                </p>
             </div>`;

        return;

    }


    grid.innerHTML =
        items.map(function (item) {

            return `
                <div class="menu-card">

                    <div class="menu-icon">
                        🍛
                    </div>

                    <h3>
                        ${escapeHtml(
                            item.itemName
                            || "Menu Item"
                        )}
                    </h3>

                    <div class="menu-price">
                        ₹${formatMoney(
                            item.price
                        )}
                    </div>

                    <button
                        class="primary-button"
                        onclick="addToCart('${escapeJs(
                            item.itemId
                        )}')">

                        Add to Cart

                    </button>

                </div>
            `;

        }).join("");

}


/*
 * Back to restaurants
 */

function backToRestaurants() {

    showCustomerSection(
        "customerRestaurantsSection"
    );

}


/* =========================================================
   CART
   ========================================================= */

function addToCart(itemId) {

    const item =
        menuItems.find(function (menuItem) {

            return String(
                menuItem.itemId
            ) === String(itemId);

        });


    if (!item) {

        alert("Menu item not found.");

        return;

    }


    /*
     * Make sure this item belongs to the
     * currently selected restaurant.
     */

    if (
        selectedRestaurant &&
        String(item.restaurantId) !==
        String(selectedRestaurant.restaurantId)
    ) {

        alert(
            "You can order items from one restaurant at a time."
        );

        return;

    }


    const existing =
        cart.find(function (cartItem) {

            return String(
                cartItem.itemId
            ) === String(itemId);

        });


    if (existing) {

        existing.quantity += 1;

    }

    else {

        cart.push({

            itemId: item.itemId,

            itemName: item.itemName,

            price: Number(item.price),

            restaurantId:
                item.restaurantId,

            quantity: 1

        });

    }


    updateCartDisplay();


    alert(
        `${item.itemName} added to cart.`
    );

}


/*
 * Increase quantity
 */

function increaseCartItem(itemId) {

    const item =
        cart.find(function (cartItem) {

            return String(
                cartItem.itemId
            ) === String(itemId);

        });


    if (item) {

        item.quantity += 1;

    }


    renderCart();

    updateCartDisplay();

}


/*
 * Decrease quantity
 */

function decreaseCartItem(itemId) {

    const item =
        cart.find(function (cartItem) {

            return String(
                cartItem.itemId
            ) === String(itemId);

        });


    if (!item) {
        return;
    }


    item.quantity -= 1;


    if (item.quantity <= 0) {

        cart =
            cart.filter(function (cartItem) {

                return String(
                    cartItem.itemId
                ) !== String(itemId);

            });

    }


    renderCart();

    updateCartDisplay();

}


/*
 * Remove cart item
 */

function removeFromCart(itemId) {

    cart =
        cart.filter(function (item) {

            return String(
                item.itemId
            ) !== String(itemId);

        });


    renderCart();

    updateCartDisplay();

}


/*
 * Render cart
 */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) {
        return;
    }


    if (!cart.length) {

        container.innerHTML =
            `<div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>
                    Add menu items to your cart.
                </p>
             </div>`;


        updateCartSummary();

        return;

    }


    container.innerHTML =
        cart.map(function (item) {

            const subtotal =
                Number(item.price) *
                Number(item.quantity);


            return `
                <div
                    class="cart-row"
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:15px;
                        padding:15px 0;
                        border-bottom:1px solid #eee;
                    ">

                    <div>

                        <strong>
                            ${escapeHtml(
                                item.itemName
                            )}
                        </strong>

                        <div
                            style="
                                color:#6b7280;
                                font-size:13px;
                                margin-top:5px;
                            ">

                            ₹${formatMoney(item.price)}
                            each

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                        ">

                        <button
                            class="secondary-button"
                            onclick="decreaseCartItem('${escapeJs(
                                item.itemId
                            )}')">

                            −

                        </button>


                        <strong>
                            ${item.quantity}
                        </strong>


                        <button
                            class="secondary-button"
                            onclick="increaseCartItem('${escapeJs(
                                item.itemId
                            )}')">

                            +

                        </button>

                    </div>


                    <strong>
                        ₹${formatMoney(subtotal)}
                    </strong>


                    <button
                        class="secondary-button"
                        onclick="removeFromCart('${escapeJs(
                            item.itemId
                        )}')">

                        Remove

                    </button>

                </div>
            `;

        }).join("");


    updateCartSummary();

}


/*
 * Update cart counters
 */

function updateCartDisplay() {

    const count =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity);

            },
            0
        );


    const total =
        cart.reduce(
            function (sum, item) {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            },
            0
        );


    const dashboardCount =
        document.getElementById(
            "customerCartCount"
        );


    const dashboardTotal =
        document.getElementById(
            "customerCartTotal"
        );


    if (dashboardCount) {

        dashboardCount.textContent =
            count;

    }


    if (dashboardTotal) {

        dashboardTotal.textContent =
            `₹${formatMoney(total)}`;

    }


    updateCartSummary();

}


/*
 * Cart summary
 */

function updateCartSummary() {

    const count =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity);

            },
            0
        );


    const total =
        cart.reduce(
            function (sum, item) {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            },
            0
        );


    const countElement =
        document.getElementById(
            "cartItemCount"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (countElement) {

        countElement.textContent =
            count;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${formatMoney(total)}`;

    }

}


/* =========================================================
   PLACE ORDER
   ========================================================= */

async function placeOrder() {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;

    }


    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    if (!selectedRestaurant) {

        alert(
            "Please select a restaurant first."
        );

        return;

    }


    try {

        /*
         * Generate a frontend order ID.
         *
         * Your existing Order entity uses String orderId.
         */

        const orderId = "ORD" + Math.floor(10000 + Math.random() * 90000);


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const orderData = {

            orderId: orderId,

            customerId: currentUserId,

            restaurantId:
                selectedRestaurant.restaurantId,

            orderDate: today

        };


        /*
         * Create order.
         */

        await apiRequest(
            "/orders",
            {
                method: "POST",

                body:
                    JSON.stringify(orderData)
            }
        );


        /*
         * Create order items.
         */

        for (const item of cart) {

            const orderItemData = {

                id: {

                    orderId: orderId,

                    itemId: item.itemId

                },

                quantity:
                    item.quantity

            };


            await apiRequest(
                "/order-items",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            orderItemData
                        )
                }
            );

        }


        alert(
            `Order ${orderId} placed successfully!`
        );


        cart = [];

        updateCartDisplay();

        renderCart();


        showCustomerSection(
            "customerOrdersSection"
        );


        await loadCustomerOrders();

    }

    catch (error) {

        console.error(
            "Place order error:",
            error
        );


        alert(
            "Unable to place order.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   CUSTOMER ORDERS
   ========================================================= */

async function loadCustomerOrders() {

    const table =
        document.getElementById(
            "customerOrdersTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        `<tr>
            <td colspan="4" class="loading">
                Loading orders...
            </td>
         </tr>`;


    try {

        const data =
            await apiRequest(
                "/orders"
            );


        const customerOrders =
            Array.isArray(data)
                ? data.filter(
                    function (order) {

                        return String(
                            order.customerId
                        ) ===
                        String(currentUserId);

                    }
                )
                : [];


        orders =
            customerOrders;


        table.innerHTML =
            customerOrders.length
                ? customerOrders.map(
                    function (order) {

                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        order.orderId
                                    )}
                                </td>

                                <td>
                                    ${getRestaurantName(
                                        order.restaurantId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        order.orderDate
                                        || "-"
                                    )}
                                </td>

                                <td>
                                    <span
                                        class="status-badge status-new">

                                        Order Placed

                                    </span>
                                </td>

                            </tr>
                        `;

                    }
                ).join("")
                :
                `<tr>
                    <td
                        colspan="4"
                        class="empty-state">

                        No orders found.

                    </td>
                 </tr>`;


        const count =
            document.getElementById(
                "customerOrderCount"
            );


        if (count) {

            count.textContent =
                customerOrders.length;

        }

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            `<tr>
                <td colspan="4">
                    Unable to load orders.
                </td>
             </tr>`;

    }

}


/* =========================================================
   CUSTOMER PROFILE
   ========================================================= */

async function loadCustomerProfile() {

    if (!currentUserId) {
        return;
    }


    try {

        const customer =
            await fetchById(
                "/customers",
                currentUserId
            );


        if (!customer) {
            return;
        }


        currentUser =
            customer;


        setText(
            "customerProfileId",
            customer.customerId
        );


        setText(
            "customerProfileName",
            customer.customerName
        );


        setText(
            "customerProfilePhone",
            customer.phone
        );


        setText(
            "customerUserBadge",
            customer.customerName
                || "Customer"
        );

    }

    catch (error) {

        console.error(error);

    }

}


/* =========================================================
   STAFF DASHBOARD
   ========================================================= */

async function loadStaffDashboard() {

    try {

        await loadStaffOrders();

        await loadStaffProfile();

    }

    catch (error) {

        console.error(
            "Staff dashboard error:",
            error
        );

    }

}


/* =========================================================
   STAFF ORDERS
   ========================================================= */

async function loadStaffOrders() {

    try {

        const data =
            await apiRequest(
                "/orders"
            );


        orders =
            Array.isArray(data)
                ? data
                : [];


        renderStaffOrders();

    }

    catch (error) {

        console.error(
            "Staff orders error:",
            error
        );

    }

}


/*
 * Current database does not contain an
 * order_status column.
 *
 * Therefore this frontend does not pretend
 * that the database has real statuses.
 *
 * All current orders are shown as
 * "Order Placed".
 */

function renderStaffOrders() {

    const newTable =
        document.getElementById(
            "staffNewOrdersTableBody"
        );


    const preparingTable =
        document.getElementById(
            "staffPreparingTableBody"
        );


    const completedTable =
        document.getElementById(
            "staffCompletedTableBody"
        );


    const rows =
        orders.map(
            function (order) {

                return `
                    <tr>

                        <td>
                            ${escapeHtml(
                                order.orderId
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                order.customerId
                                || "-"
                            )}
                        </td>

                        <td>
                            ${getRestaurantName(
                                order.restaurantId
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                order.orderDate
                                || "-"
                            )}
                        </td>

                        <td>

                            <span
                                class="status-badge status-new">

                                Order Placed

                            </span>

                        </td>

                    </tr>
                `;

            }
        ).join("");


    if (newTable) {

        newTable.innerHTML =
            rows ||
            `<tr>
                <td colspan="5">
                    No orders found.
                </td>
             </tr>`;

    }


    /*
     * Because the current DB has no status,
     * these sections show an explanatory message.
     */

    if (preparingTable) {

        preparingTable.innerHTML =
            `<tr>
                <td colspan="5">

                    Order status is not currently
                    stored in the database.

                </td>
             </tr>`;

    }


    if (completedTable) {

        completedTable.innerHTML =
            `<tr>
                <td colspan="5">

                    Order status is not currently
                    stored in the database.

                </td>
             </tr>`;

    }


    setText(
        "staffTotalOrders",
        orders.length
    );


    setText(
        "staffNewOrders",
        orders.length
    );


    setText(
        "staffPreparingOrders",
        0
    );


    setText(
        "staffCompletedOrders",
        0
    );

}


/* =========================================================
   STAFF PROFILE
   ========================================================= */

async function loadStaffProfile() {

    if (!currentUserId) {
        return;
    }


    try {

        const staff =
            await fetchById(
                "/staff",
                currentUserId
            );


        if (!staff) {
            return;
        }


        currentUser =
            staff;


        setText(
            "staffProfileId",
            staff.staffId
        );


        setText(
            "staffProfileName",
            staff.staffName
        );


        setText(
            "staffProfileRole",
            staff.role
        );


        setText(
            "staffProfileRestaurant",
            getRestaurantName(
                staff.restaurantId
            )
        );


        setText(
            "staffUserBadge",
            staff.staffName
                || "Staff"
        );

    }

    catch (error) {

        console.error(error);

    }

}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

async function loadAdminDashboard() {

    try {

        const results =
            await Promise.all([

                apiRequest(
                    "/restaurants"
                ),

                apiRequest(
                    "/menu-items"
                ),

                apiRequest(
                    "/customers"
                ),

                apiRequest(
                    "/staff"
                ),

                apiRequest(
                    "/orders"
                )

            ]);


        restaurants =
            Array.isArray(results[0])
                ? results[0]
                : [];


        menuItems =
            Array.isArray(results[1])
                ? results[1]
                : [];


        customers =
            Array.isArray(results[2])
                ? results[2]
                : [];


        staffMembers =
            Array.isArray(results[3])
                ? results[3]
                : [];


        orders =
            Array.isArray(results[4])
                ? results[4]
                : [];


        setText(
            "adminRestaurantCount",
            restaurants.length
        );


        setText(
            "adminMenuCount",
            menuItems.length
        );


        setText(
            "adminCustomerCount",
            customers.length
        );


        setText(
            "adminStaffCount",
            staffMembers.length
        );


        setText(
            "adminOrderCount",
            orders.length
        );

    }

    catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

    }

}


/* =========================================================
   ADMIN RESTAURANTS
   ========================================================= */

async function loadAdminRestaurants() {

    const table =
        document.getElementById(
            "adminRestaurantsTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        `<tr>
            <td colspan="3">
                Loading...
            </td>
         </tr>`;


    try {

        restaurants =
            await apiRequest(
                "/restaurants"
            );


        table.innerHTML =
            restaurants.length
                ? restaurants.map(
                    function (restaurant) {

                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        restaurant.restaurantId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        restaurant.restaurantName
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        restaurant.city
                                    )}
                                </td>

                            </tr>
                        `;

                    }
                ).join("")
                :
                `<tr>
                    <td colspan="3">
                        No restaurants found.
                    </td>
                 </tr>`;

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            `<tr>
                <td colspan="3">
                    Unable to load restaurants.
                </td>
             </tr>`;

    }

}


/*
 * Show / hide Add Restaurant form
 */

function showRestaurantForm() {

    const form =
        document.getElementById(
            "restaurantForm"
        );


    if (!form) {
        return;
    }


    form.classList.toggle("hidden");

}


/*
 * Add restaurant
 */

async function addRestaurant(event) {

    event.preventDefault();


    const restaurant = {

        restaurantId:
            document.getElementById(
                "restaurantIdInput"
            ).value.trim(),

        restaurantName:
            document.getElementById(
                "restaurantNameInput"
            ).value.trim(),

        city:
            document.getElementById(
                "restaurantCityInput"
            ).value.trim()

    };


    if (
        !restaurant.restaurantId ||
        !restaurant.restaurantName ||
        !restaurant.city
    ) {

        alert(
            "Please fill all restaurant fields."
        );

        return;

    }


    try {

        await apiRequest(
            "/restaurants",
            {
                method: "POST",

                body:
                    JSON.stringify(
                        restaurant
                    )
            }
        );


        alert(
            "Restaurant added successfully."
        );


        document.getElementById(
            "restaurantIdInput"
        ).value = "";


        document.getElementById(
            "restaurantNameInput"
        ).value = "";


        document.getElementById(
            "restaurantCityInput"
        ).value = "";


        showRestaurantForm();

        loadAdminRestaurants();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to add restaurant.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   ADMIN MENU
   ========================================================= */

async function loadAdminMenu() {

    const table =
        document.getElementById(
            "adminMenuTableBody"
        );


    if (!table) {
        return;
    }


    try {

        menuItems =
            await apiRequest(
                "/menu-items"
            );


        table.innerHTML =
            menuItems.length
                ? menuItems.map(
                    function (item) {

                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        item.itemId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        item.itemName
                                    )}
                                </td>

                                <td>
                                    ₹${formatMoney(
                                        item.price
                                    )}
                                </td>

                                <td>
                                    ${getRestaurantName(
                                        item.restaurantId
                                    )}
                                </td>

                            </tr>
                        `;

                    }
                ).join("")
                :
                `<tr>
                    <td colspan="4">
                        No menu items found.
                    </td>
                 </tr>`;

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            `<tr>
                <td colspan="4">
                    Unable to load menu items.
                </td>
             </tr>`;

    }

}


/* =========================================================
   ADMIN CUSTOMERS
   ========================================================= */

async function loadAdminCustomers() {

    const table =
        document.getElementById(
            "adminCustomersTableBody"
        );


    if (!table) {
        return;
    }


    try {

        customers =
            await apiRequest(
                "/customers"
            );


        table.innerHTML =
            customers.length
                ? customers.map(
                    function (customer) {

                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        customer.customerId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        customer.customerName
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        customer.phone
                                        || "-"
                                    )}
                                </td>

                            </tr>
                        `;

                    }
                ).join("")
                :
                `<tr>
                    <td colspan="3">
                        No customers found.
                    </td>
                 </tr>`;

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            `<tr>
                <td colspan="3">
                    Unable to load customers.
                </td>
             </tr>`;

    }

}


/* =========================================================
   ADMIN STAFF
   ========================================================= */

async function loadAdminStaff() {

    const table =
        document.getElementById(
            "adminStaffTableBody"
        );


    if (!table) {
        return;
    }


    try {

        staffMembers =
            await apiRequest(
                "/staff"
            );


        table.innerHTML =
            staffMembers.length
                ? staffMembers.map(
                    function (staff) {

                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        staff.staffId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        staff.staffName
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        staff.role
                                    )}
                                </td>

                                <td>
                                    ${getRestaurantName(
                                        staff.restaurantId
                                    )}
                                </td>

                            </tr>
                        `;

                    }
                ).join("")
                :
                `<tr>
                    <td colspan="4">
                        No staff found.
                    </td>
                 </tr>`;

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            `<tr>
                <td colspan="4">
                    Unable to load staff.
                </td>
             </tr>`;

    }

}


/* =========================================================
   ADMIN ORDERS
   ========================================================= */

async function loadAdminOrders() {

    const table =
        document.getElementById(
            "adminOrdersTableBody"
        );


    if (!table) {
        return;
    }


    try {

        orders =
            await apiRequest(
                "/orders"
            );


        table.innerHTML =
            orders.length
                ? orders.map(
                    function (order) {

                        return `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        order.orderId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        order.customerId
                                    )}
                                </td>

                                <td>
                                    ${getRestaurantName(
                                        order.restaurantId
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        order.orderDate
                                        || "-"
                                    )}
                                </td>

                                <td>

                                    <span
                                        class="status-badge status-new">

                                        Order Placed

                                    </span>

                                </td>

                            </tr>
                        `;

                    }
                ).join("")
                :
                `<tr>
                    <td colspan="5">
                        No orders found.
                    </td>
                 </tr>`;

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            `<tr>
                <td colspan="5">
                    Unable to load orders.
                </td>
             </tr>`;

    }

}


/* =========================================================
   REPORTS
   ========================================================= */


/*
 * Helper for report results.
 */

function setReportResult(
    elementId,
    html
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.innerHTML = html;

    }

}


/*
 * Report 1:
 * Restaurant + Menu JOIN
 */

async function loadRestaurantMenuReport() {

    setReportResult(
        "restaurantMenuReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/restaurants/menu"
            );


        setReportResult(
            "restaurantMenuReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "restaurantMenuReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Report 2:
 * Customer + Orders JOIN
 */

async function loadCustomerOrderReport() {

    setReportResult(
        "customerOrderReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/customers/orders"
            );


        setReportResult(
            "customerOrderReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "customerOrderReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Restaurant Sales
 */

async function loadRestaurantSalesReport() {

    setReportResult(
        "restaurantSalesReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/restaurants/sales"
            );


        setReportResult(
            "restaurantSalesReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "restaurantSalesReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Restaurant Statistics
 */

async function loadRestaurantStatisticsReport() {

    setReportResult(
        "restaurantStatisticsReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/restaurants/statistics"
            );


        setReportResult(
            "restaurantStatisticsReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "restaurantStatisticsReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Popular Items
 */

async function loadPopularItemsReport() {

    setReportResult(
        "popularItemsReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/menu-items/popular"
            );


        setReportResult(
            "popularItemsReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "popularItemsReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Above Average Items
 */

async function loadAboveAverageReport() {

    setReportResult(
        "aboveAverageReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/menu-items/above-average"
            );


        setReportResult(
            "aboveAverageReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "aboveAverageReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Most Expensive Item
 */

async function loadMostExpensiveReport() {

    setReportResult(
        "mostExpensiveReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/menu-items/most-expensive"
            );


        setReportResult(
            "mostExpensiveReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "mostExpensiveReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Order Totals
 */

async function loadOrderTotalsReport() {

    setReportResult(
        "orderTotalsReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/orders/totals"
            );


        setReportResult(
            "orderTotalsReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "orderTotalsReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Customer Spending
 */

async function loadCustomerSpendingReport() {

    setReportResult(
        "customerSpendingReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/customers/spending"
            );


        setReportResult(
            "customerSpendingReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "customerSpendingReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Item Sales Summary
 */

async function loadItemSalesReport() {

    setReportResult(
        "itemSalesReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/order-items/sales-summary"
            );


        setReportResult(
            "itemSalesReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "itemSalesReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/*
 * Order Details
 */

async function loadOrderDetailsReport() {

    setReportResult(
        "orderDetailsReportResult",
        "Loading report..."
    );


    try {

        const data =
            await apiRequest(
                "/orders/details"
            );


        setReportResult(
            "orderDetailsReportResult",
            renderReportData(data)
        );

    }

    catch (error) {

        setReportResult(
            "orderDetailsReportResult",
            "Unable to load report."
        );

        console.error(error);

    }

}


/* =========================================================
   REPORT RENDERING
   ========================================================= */

function renderReportData(data) {

    if (
        data === null ||
        data === undefined
    ) {

        return "No data returned.";

    }


    if (
        Array.isArray(data) &&
        data.length === 0
    ) {

        return "No records found.";

    }


    /*
     * Native Spring Data queries returning
     * List<Object[]> normally arrive as arrays.
     */

    if (Array.isArray(data)) {

        return `
            <div style="overflow-x:auto;">

                <table
                    class="data-table"
                    style="min-width:400px;">

                    <tbody>

                        ${data.map(
                            function (row) {

                                if (
                                    Array.isArray(row)
                                ) {

                                    return `
                                        <tr>
                                            ${row.map(
                                                function (value) {

                                                    return `
                                                        <td>
                                                            ${formatReportValue(
                                                                value
                                                            )}
                                                        </td>
                                                    `;

                                                }
                                            ).join("")}
                                        </tr>
                                    `;

                                }


                                return `
                                    <tr>

                                        <td>
                                            ${formatReportValue(
                                                row
                                            )}
                                        </td>

                                    </tr>
                                `;

                            }
                        ).join("")}

                    </tbody>

                </table>

            </div>
        `;

    }


    /*
     * Single object.
     */

    if (
        typeof data === "object"
    ) {

        return `
            <pre
                style="
                    white-space:pre-wrap;
                    margin:0;
                    font-size:12px;
                ">${escapeHtml(
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                )}</pre>
        `;

    }


    return escapeHtml(
        String(data)
    );

}


/*
 * Format values returned from SQL reports.
 */

function formatReportValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "-";

    }


    if (
        typeof value === "number"
    ) {

        return Number.isInteger(value)
            ? value
            : Number(value).toFixed(2);

    }


    return escapeHtml(
        String(value)
    );

}


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */


/*
 * Find restaurant name from restaurant ID.
 */

function getRestaurantName(
    restaurantId
) {

    const restaurant =
        restaurants.find(
            function (item) {

                return String(
                    item.restaurantId
                ) === String(restaurantId);

            }
        );


    return restaurant
        ? restaurant.restaurantName
        : restaurantId || "-";

}


/*
 * Update text safely.
 */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value ?? "-";

    }

}


/*
 * Format money.
 */

function formatMoney(value) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {

        return "0.00";

    }


    return number.toFixed(2);

}


/*
 * Prevent HTML injection when displaying
 * backend values.
 */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/*
 * Escape values used inside onclick strings.
 */

function escapeJs(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', '\\"');

}


/* =========================================================
   END
   ========================================================= */