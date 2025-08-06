document.addEventListener("DOMContentLoaded", () => {
  function updateQtyDisplay(name, qty) {
    const id = `qty-${name.replace(/\s+/g, "-")}`;
    const span = document.getElementById(id);
    if (span) {
      span.textContent = qty > 0 ? qty : 0;
    }
  }
  // Menu Page
  document
    .querySelectorAll(".add-to-cart, .add-to-cart-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        if (!name || isNaN(price)) return;

        try {
          const res = await fetch("/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price }),
          });

          if (!res.ok) throw new Error(await res.text());

          const data = await res.json();

          showToast(`${name} added to cart!`);
          updateCartCount(data.totalItems);
          updateQtyDisplay(name, data.updatedItemQty);
        } catch (err) {
          console.error("item cannot be added to cart:", err.message);
        }
      });
    });

  document.querySelectorAll(".minus-cart").forEach((button) => {
    button.addEventListener("click", async () => {
      const name = button.dataset.name;

      if (!name) return;

      try {
        const res = await fetch("/cart/decrease", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();

        showToast(`${name} removed from cart!`);
        updateCartCount(data.totalItems);
        updateQtyDisplay(name, data.updatedItemQty);
      } catch (err) {
        console.error("item cannot be removed from cart:", err.message);
      }
    });
  });

  //  Cart Page
  const cartSection = document.querySelector(".cart-section");
  if (cartSection) {
    document.querySelectorAll(".plus").forEach((btn) => {
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

    document.querySelectorAll(".minus").forEach((btn) => {
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

    document.querySelectorAll(".remove-btn").forEach((btn) => {
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

  fetch("/cart/count")
    .then((res) => res.json())
    .then((data) => {
      updateCartCount(data.total || 0); // fallback to 0
    })
    .catch((err) => {
      console.error("Failed to load cart count:", err);
    });
});
//update Cart
function updateCartCount(count) {
  const countElement = document.getElementById("cart-count");

  if (!countElement) return;

  if (count > 0) {
    countElement.textContent = count;
    countElement.style.display = "inline-block";
  } else {
    countElement.style.display = "none";
  }
}

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
  document.getElementById("confirmationPopup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("confirmationPopup").classList.add("hidden");
}
