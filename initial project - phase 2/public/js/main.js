document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    setupSignupForm();
  }
});

function setupSignupForm() {
  const signupForm = document.getElementById("signupForm");
  const loggedInBtn = document.getElementById("loggedInBtn");
  const hideLastNameBtn = document.getElementById("hideLastNameBtn");

  // Prevent default form submition
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); //prevent reload
    validateForm();
  });

  // Reset button
  signupForm.addEventListener("reset", function () {
    const lastNameContainer = document.getElementById("lastNameContainer");
    const errorDiv = document.getElementById("errorMessages");
    const welcome = document.getElementById("signupTitle");

    if (lastNameContainer) lastNameContainer.style.display = "block";

    // Disable and grey out Logged In button
    if (loggedInBtn) {
      loggedInBtn.disabled = true;
      loggedInBtn.classList.remove("enabled");
    }

    // Clear errors and reset welcome
    errorDiv.innerHTML = "";
    welcome.textContent = "Welcome Guest";
  });

  hideLastNameBtn.addEventListener("click", hideLastName);

  loggedInBtn.addEventListener("click", goToHome);
}

function validateForm() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const mobile = document.getElementById("mobile").value.trim();
  const loggedInBtn = document.getElementById("loggedInBtn");
  const errorDiv = document.getElementById("errorMessages");

  const errors = [];

  // Clear previous errors
  errorDiv.innerHTML = "";

  // Validation rules
  if (!firstName) errors.push("• First name is required.");
  if (!lastName) errors.push("• Last name is required.");
  
  if (!gender) errors.push("• Please select a gender.");
  if (!email) errors.push("• Email is required.");
  if (!password) errors.push("• Password is required.");
  if (!mobile) errors.push("• Mobile number is required.");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email)) {
    errors.push("• Email format is invalid.");
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  if (password && !passwordPattern.test(password)) {
    errors.push("• Password must include uppercase, lowercase, number, symbol, and be at least 8 characters.");
  }

  if (mobile && !/^\d{11}$/.test(mobile)) {
    errors.push("• Mobile number must be exactly 11 digits.");
  }

  if (errors.length > 0) {
    errorDiv.innerHTML = errors.join("<br>");
    return;
  }

  // Success
  errorDiv.innerHTML = "";
  const welcome = document.getElementById("signupTitle");
  if (welcome) welcome.textContent = `Welcome ${firstName}`;

  alert("Sign up successful!");

  if (loggedInBtn) {
    loggedInBtn.disabled = false;
    loggedInBtn.classList.add("enabled");
  }
}

function hideLastName() {
  const container = document.getElementById("lastNameContainer");
  if (container) container.style.display = "none";
}

function goToHome() {
  window.location.href = "../html/index.html";
}
