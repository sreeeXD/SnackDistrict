let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");

function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
  document.getElementById("cart-count").textContent = cart.length;
}

function addToCart(snack) {
  const existing = cart.find(i => i.id === snack.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...snack, qty: 1 });
  saveCart();
}

function openCart() {
  const modal = document.getElementById("cart-modal");
  const itemsDiv = document.getElementById("cart-items");
  itemsDiv.innerHTML = "";

  if (cart.length === 0) {
    itemsDiv.innerHTML = "<p>No items in cart.</p>";
  } else {
    cart.forEach((item, idx) => {
      itemsDiv.innerHTML += `
        <div class='cart-item'>
          ${item.name} x${item.qty} — ₹${item.price * item.qty}
          <button class='btn-secondary' onclick='removeItem(${idx})'>Remove</button>
        </div>`;
    });
  }

  modal.classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  openCart();
}

function showOrderForm() {
  closeCart();
  document.getElementById("order-modal").classList.remove("hidden");
}

function closeOrderForm() {
  document.getElementById("order-modal").classList.add("hidden");
}

document.getElementById("order-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;
  const phone = document.getElementById("phone").value;

  const res = await fetch("http://localhost:5000/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, room, phone, items: cart })
  });

  const data = await res.json();
  if (data.success) {
    alert("Order placed successfully!");
    cart = [];
    saveCart();
    closeOrderForm();
  } else {
    alert("Error placing order.");
  }
});

saveCart();
