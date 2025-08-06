function isUserLoggedIn() {
  return !!localStorage.getItem("user");
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function updateNavbarAuthState() {
  const authArea = document.getElementById("auth-area");
  const cartArea = document.getElementById("cart-area");
  const hamburgerContainer = document.getElementById("hamburger-container");
  const user = getLoggedInUser();

  if (user) {
    authArea.innerHTML = `
      <span>Hello, <strong>${user.name}</strong></span>
      <button id="logoutBtn">Logout</button>
    `;
    cartArea.style.display = "inline-block";

    if (hamburgerContainer) {
      hamburgerContainer.style.display = "inline-block"; // Show for logged in
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("user");
      updateNavbarAuthState();
    });
  } else {
    authArea.innerHTML = `<button id="loginBtn">Login</button>`;
    cartArea.style.display = "none";

    if (hamburgerContainer) {
      hamburgerContainer.style.display = "none"; // Hide when logged out
    }

    document.getElementById("loginBtn").addEventListener("click", () => {
      const username = prompt("Username:");
      const password = prompt("Password:");

      if (username === dummyUser.email && password === dummyUser.password) {
        localStorage.setItem("user", JSON.stringify(dummyUser));
        updateNavbarAuthState();
      } else {
        alert("Invalid credentials.");
      }
    });
  }
}

function initHamburgerMenu() {
  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("hamburger-menu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
});
