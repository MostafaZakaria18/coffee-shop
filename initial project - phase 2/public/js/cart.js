document.addEventListener("DOMContentLoaded", () => {
  // Menu Page
  document.querySelectorAll(".add-to-cart, .add-to-cart-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);

      if (!name || isNaN(price)) return;

      try {
        const res = await fetch("/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, price })
        });

        if (!res.ok) throw new Error(await res.text());

        showToast(`${name} added to cart!`);
      } catch (err) {
        console.error("item cannot be added to cart:", err.message);
      }
    });
  });

  //  Cart Page 
  const cartSection = document.querySelector(".cart-section");
  if (cartSection) {
    document.querySelectorAll(".plus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const name = btn.getAttribute("data-name");
        fetch("/cart/increase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).then(() => location.reload());
      });
    });

    document.querySelectorAll(".minus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const name = btn.getAttribute("data-name");
        fetch("/cart/decrease", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).then(() => location.reload());
      });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const name = btn.getAttribute("data-name");
        fetch("/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).then(() => location.reload());
      });
    });
  }
});

// Toast Notification 
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
// Confirm Order  
const confirmBtn = document.getElementById("confirmOrderBtn");
if (confirmBtn) {
  confirmBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/cart/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(await res.text());

      showToast("Order confirmed!");

      setTimeout(() => {
        window.location.reload(); 
      }, 2000);
    } catch (err) {
      console.error("Order confirmation failed:", err.message);
    }
  });
}

// PopUps 
function showConfirmationPopup() {
  document.getElementById('confirmationPopup').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('confirmationPopup').classList.add('hidden');
}