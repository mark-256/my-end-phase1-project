const API_URL = "http://localhost:3000/flowers";

const flowerContainer = document.getElementById("flower-container");
const filterColor = document.getElementById("filter-color");
const toggleThemeBtn = document.getElementById("toggle-theme");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElem = document.getElementById("cart-total");

const orderForm = document.getElementById("order-form");
const customerNameInput = document.getElementById("customer-name");
const customerLocationInput = document.getElementById("customer-location");
const orderConfirmation = document.getElementById("order-confirmation");

let flowers = [];
let cart = {};

// Fetch flowers from JSON server
function fetchFlowers() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      flowers = data;
      renderFlowers(flowers);
    })
    .catch((err) => {
      flowerContainer.innerHTML = "<p>Error loading flowers.</p>";
      console.error(err);
    });
}

// Render flower cards
function renderFlowers(flowerList) {
  flowerContainer.innerHTML = "";

  flowerList.forEach((flower) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${flower.image}" alt="${flower.name}">
      <div class="card-content">
        <h3>${flower.name}</h3>
        <p>Color: ${flower.color}</p>
        <p>Scent: ${flower.scent}</p>
        <p>Price: $${flower.price.toFixed(2)}</p>

        <div class="quantity-container">
          <label for="qty-${flower.id}">Qty:</label>
          <input type="number" min="0" id="qty-${flower.id}" value="${
      cart[flower.id] || 0
    }">
        </div>
      </div>
    `;

    flowerContainer.appendChild(card);

    // Add event listener for quantity input
    const qtyInput = card.querySelector(`#qty-${flower.id}`);
    qtyInput.addEventListener("change", (e) => {
      const qty = Math.max(0, parseInt(e.target.value) || 0);
      if (qty === 0) {
        delete cart[flower.id];
      } else {
        cart[flower.id] = qty;
      }
      updateCart();
    });
  });
}

// Update cart display & total price
function updateCart() {
  cartItemsContainer.innerHTML = "";

  const cartIds = Object.keys(cart);
  if (cartIds.length === 0) {
    cartItemsContainer.textContent = "Cart is empty.";
    cartTotalElem.textContent = "Total: $0.00";
    return;
  }

  let total = 0;

  cartIds.forEach((id) => {
    const flower = flowers.find((f) => f.id == id);
    const qty = cart[id];
    const itemTotal = flower.price * qty;
    total += itemTotal;

    const p = document.createElement("p");
    p.textContent = `${flower.name} x ${qty} = $${itemTotal.toFixed(2)}`;
    cartItemsContainer.appendChild(p);
  });

  cartTotalElem.textContent = `Total: $${total.toFixed(2)}`;
}

// Filter flowers by color
filterColor.addEventListener("change", () => {
  const selectedColor = filterColor.value;
  if (selectedColor === "all") {
    renderFlowers(flowers);
  } else {
    const filtered = flowers.filter((f) => f.color === selectedColor);
    renderFlowers(filtered);
  }
  // Reset cart & cart display on filter change
  cart = {};
  updateCart();
});

// Toggle dark mode
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Handle order submission
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = customerNameInput.value.trim();
  const location = customerLocationInput.value.trim();
  const cartIds = Object.keys(cart);

  if (cartIds.length === 0) {
    alert("Your cart is empty! Please add flowers before ordering.");
    return;
  }
  if (!name || !location) {
    alert("Please fill in your name and location.");
    return;
  }

  // Build order summary
  let orderSummary = `Thank you, ${name}! Your order will be delivered to ${location}.\n\nOrder details:\n`;
  cartIds.forEach((id) => {
    const flower = flowers.find((f) => f.id == id);
    const qty = cart[id];
    orderSummary += `- ${flower.name} x ${qty}\n`;
  });

  alert(orderSummary);

  // Clear cart and form
  cart = {};
  updateCart();
  orderForm.reset();
  orderConfirmation.textContent = "Order placed successfully! 🌸";
  orderConfirmation.classList.remove("hidden");

  setTimeout(() => {
    orderConfirmation.classList.add("hidden");
  }, 5000);
});

// Initialize
fetchFlowers();
updateCart();
