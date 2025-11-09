const API = "http://localhost:5000/api/admin";

if (location.pathname.endsWith("login.html")) {
  document.getElementById("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem("admin", "true");
      location.href = "dashboard.html";
    } else alert("Invalid credentials!");
  });
}

if (location.pathname.endsWith("dashboard.html")) {
  if (!sessionStorage.getItem("admin")) location.href = "login.html";

  async function loadSnacks() {
    const res = await fetch(`${API}/snacks`);
    const snacks = await res.json();
    const list = document.getElementById("snack-list");
    list.innerHTML = snacks.map(s => `
      <div>${s.name} — ₹${s.price}
        <button class="btn-secondary" onclick="deleteSnack(${s.id})">Delete</button>
      </div>`).join("");
  }

  async function loadOrders() {
    const res = await fetch(`${API}/orders`);
    const orders = await res.json();
    const list = document.getElementById("order-list");
    list.innerHTML = orders.map(o => `
      <div class="order">
        <b>${o.student_name}</b> (Room: ${o.room_no})<br/>
        Items: ${JSON.parse(o.items).map(i => `${i.name}x${i.qty}`).join(", ")}<br/>
        Total: ₹${o.total} <hr/>
      </div>`).join("");
  }

  document.getElementById("add-snack").addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("snack-name").value;
    const price = document.getElementById("snack-price").value;
    const image = document.getElementById("snack-image").value;
    await fetch(`${API}/snack`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, image })
    });
    loadSnacks();
  });

  async function deleteSnack(id) {
    await fetch(`${API}/snack/${id}`, { method: "DELETE" });
    loadSnacks();
  }

  loadSnacks();
  loadOrders();
}
