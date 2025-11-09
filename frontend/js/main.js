async function fetchSnacks() {
  const res = await fetch("http://localhost:5000/api/snacks");
  const snacks = await res.json();
  const container = document.getElementById("snacks-container");

  snacks.forEach(snack => {
    const div = document.createElement("div");
    div.className = "snack-card";
    div.innerHTML = `
      <img src="${snack.image}" alt="${snack.name}">
      <h3>${snack.name}</h3>
      <p>₹${snack.price}</p>
      <button class="btn" onclick='addToCart(${JSON.stringify(snack)})'>Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

fetchSnacks();
