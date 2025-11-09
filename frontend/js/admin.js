// ===== Admin Login Script =====

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageEl = document.getElementById("message");

  messageEl.textContent = "";

  if (!username || !password) {
    messageEl.textContent = "Please enter both username and password.";
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
      messageEl.style.color = "#4caf50";
      messageEl.textContent = "✅ Login successful! Redirecting...";
      localStorage.setItem("adminToken", data.token || "default");
      setTimeout(() => {
        window.location.href = "/admin/dashboard.html";
      }, 1000);
    } else {
      messageEl.style.color = "#e63946";
      messageEl.textContent = "❌ Invalid username or password.";
    }
  } catch (err) {
    console.error("Login error:", err);
    messageEl.style.color = "#e63946";
    messageEl.textContent = "⚠️ Server error. Please try again later.";
  }
});
