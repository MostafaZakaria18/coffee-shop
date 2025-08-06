const dummyUser = {
  email: "coffee_lover@email.com",
  password: "espresso123",
  name: "Mostafa",
};

function isUserLoggedIn() {
  return !!localStorage.getItem("user");
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function updateNavbarAuthState() {
  const authArea = document.getElementById("auth-area");
  const cartArea = document.getElementById("cart-area");
  const user = getLoggedInUser();

  if (user) {
    authArea.innerHTML = `
      <span>Hello, <strong>${user.name}</strong></span>
      <button id="logoutBtn">Logout</button>
    `;
    cartArea.style.display = "inline-block";

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("user");
      updateNavbarAuthState();
    });
  } else {
    authArea.innerHTML = `<button id="loginBtn">Login</button>`;
    cartArea.style.display = "none";

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

document.addEventListener("DOMContentLoaded", updateNavbarAuthState);
