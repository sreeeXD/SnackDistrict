// ===== Admin Dashboard JS =====

const snackForm = document.getElementById("addSnackForm");
const messageEl = document.getElementById("formMessage");
const snackList = document.getElementById("snackList");

// Handle Add Snack Form
snackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("snackName").value.trim();
  const price = parseFloat(document.getElementById("snackPrice").value);
  const image = document.getElementById("snackImage").value.trim();

  if (!name || !price || !image) {
    messageEl.textContent = "⚠️ Please fill all fields.";
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
      messageEl.textContent = "✅ Snack added successfully!";
      snackForm.reset();
      loadSnacks(); // refresh snack list
    } else {
      messageEl.textContent = "❌ Failed to add snack.";
    }
  } catch (err) {
    console.error("Error adding snack:", err);
    messageEl.textContent = "⚠️ Server error. Try again later.";
  }
});

// Load all snacks
async function loadSnacks() {
  try {
    const res = await fetch("/api/admin/snacks");
    const data = await res.json();

    snackList.innerHTML = "";

    if (!data || data.length === 0) {
      snackList.innerHTML = "<p>No snacks found.</p>";
      return;
    }

    data.forEach((snack) => {
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
    console.error("Error loading snacks:", err);
  }
}

// Handle snack deletion
snackList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    if (!confirm("Are you sure you want to delete this snack?")) return;

    try {
      const res = await fetch(`/api/admin/delete-snack/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        messageEl.textContent = "✅ Snack deleted.";
        loadSnacks();
      } else {
        messageEl.textContent = "❌ Failed to delete snack.";
      }
    } catch (err) {
      console.error("Error deleting snack:", err);
    }
  }
});

// Initial load
loadSnacks();
