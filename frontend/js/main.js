// === Elements ===
const adminLoginBtn = document.getElementById("adminLoginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");
const snackGrid = document.getElementById("snackGrid");
const adminDashboard = document.getElementById("adminDashboard");
const addSnackForm = document.getElementById("addSnackForm");
const snackList = document.getElementById("snackList");
const formMessage = document.getElementById("formMessage");

let isAdmin = false;

// === Login Modal Controls ===
adminLoginBtn.addEventListener("click", () => loginModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => loginModal.classList.add("hidden"));

// === Admin Login ===
loginBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    loginMessage.textContent = "⚠️ Please fill in both fields.";
    return;
  }

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      loginMessage.textContent = "✅ Login successful!";
      isAdmin = true;
      loginModal.classList.add("hidden");
      adminDashboard.classList.remove("hidden");
      loadAdminSnacks();
    } else {
      loginMessage.textContent = "❌ Invalid credentials.";
    }
  } catch (err) {
    loginMessage.textContent = "⚠️ Server error.";
    console.error(err);
  }
});

// === Add Snack ===
addSnackForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("snackName").value.trim();
  const price = parseFloat(document.getElementById("snackPrice").value);
  const image = document.getElementById("snackImage").value.trim();

  if (!name || !price || !image) {
    formMessage.textContent = "⚠️ Please fill all fields.";
    return;
  }

  try {
    const res = await fetch("/api/admin/add-snack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, image }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      formMessage.textContent = "✅ Snack added!";
      addSnackForm.reset();
      loadAdminSnacks();
    } else {
      formMessage.textContent = "❌ Failed to add snack.";
    }
  } catch (err) {
    formMessage.textContent = "⚠️ Server error.";
    console.error(err);
  }
});

// === Load Public Snacks ===
async function loadSnacks() {
  try {
    const res = await fetch("/api/admin/snacks");
    const data = await res.json();

    snackGrid.innerHTML = "";
    if (!data.length) {
      snackGrid.innerHTML = "<p>No snacks available.</p>";
      return;
    }

    data.forEach(snack => {
      const card = document.createElement("div");
      card.classList.add("snack-card");
      card.innerHTML = `
        <img src="${snack.image}" alt="${snack.name}">
        <h3>${snack.name}</h3>
        <p>₹${snack.price}</p>
      `;
      snackGrid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// === Load Admin Snacks ===
async function loadAdminSnacks() {
  try {
    const res = await fetch("/api/admin/snacks");
    const data = await res.json();
    snackList.innerHTML = "";

    data.forEach(snack => {
      const card = document.createElement("div");
      card.classList.add("snack-card");
      card.innerHTML = `
        <img src="${snack.image}" alt="${snack.name}">
        <h3>${snack.name}</h3>
        <p>₹${snack.price}</p>
        <button class="delete-btn" data-id="${snack.id}">Delete</button>
      `;
      snackList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// === Delete Snack ===
snackList.addEventListener("click", async e => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    if (!confirm("Delete this snack?")) return;

    const res = await fetch(`/api/admin/delete-snack/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) loadAdminSnacks();
  }
});

loadSnacks();
