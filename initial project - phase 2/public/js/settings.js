// Settings page functionality

document.addEventListener("DOMContentLoaded", function () {
  // Phone form AJAX submission
  const phoneForm = document.getElementById("phoneForm");
  if (phoneForm) {
    phoneForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const mobile_number = formData.get("mobile_number");

      try {
        const response = await fetch("/settings/update-phone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile_number }),
        });

        const data = await response.json();

        if (data.success) {
          // No success message for phone update
        } else {
          showToast(data.message, "error");
        }
      } catch (error) {
        console.error("Error updating phone:", error);
        showToast("Failed to update phone number", "error");
      }
    });
  }

  // Password form AJAX submission
  const passwordForm = document.getElementById("passwordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const currentPassword = formData.get("currentPassword");
      const newPassword = formData.get("newPassword");
      const confirmPassword = formData.get("confirmPassword");

      try {
        const response = await fetch("/settings/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Store success message in session storage
          sessionStorage.setItem("passwordChanged", "true");
          // Redirect to main menu
          window.location.href = "/";
        } else {
          showToast(data.message, "error");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        showToast("Failed to update password", "error");
      }
    });
  }

  // Theme selector functionality (no popup message)
  const themeOptions = document.querySelectorAll(".theme-option");
  themeOptions.forEach((option) => {
    option.addEventListener("click", async function () {
      const selectedTheme = this.getAttribute("data-theme");

      // Update UI immediately
      themeOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Apply theme to body
      if (selectedTheme === "dark") {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }

      try {
        await fetch("/settings/update-theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme: selectedTheme }),
        });
        // No success message for theme change
      } catch (error) {
        console.error("Error updating theme:", error);
        showToast("Failed to update theme", "error");
      }
    });
  });

  // Notification toggle functionality
  const notificationToggle = document.getElementById("notifications");
  if (notificationToggle) {
    notificationToggle.addEventListener("change", async function () {
      const isEnabled = this.checked;

      try {
        const response = await fetch("/settings/update-notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notifications: isEnabled }),
        });

        const data = await response.json();

        if (data.success) {
          showToast(`Notifications ${isEnabled ? "enabled" : "disabled"}!`);
        } else {
          showToast("Failed to update notifications", "error");
          // Revert toggle state
          this.checked = !isEnabled;
        }
      } catch (error) {
        console.error("Error updating notifications:", error);
        showToast("Failed to update notifications", "error");
        // Revert toggle state
        this.checked = !isEnabled;
      }
    });
  }

  // Password confirmation validation
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      const newPassword = newPasswordInput.value;
      const confirmPassword = this.value;

      if (confirmPassword && newPassword !== confirmPassword) {
        this.setCustomValidity("Passwords do not match");
        this.style.borderColor = "#dc3545";
      } else {
        this.setCustomValidity("");
        this.style.borderColor = "";
      }
    });
  }

  // Phone number formatting
  const phoneInput = document.getElementById("mobile_number");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, ""); // Remove non-digits

      // Limit to 11 digits
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      this.value = value;

      // Validate Egyptian phone format
      const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
      if (value.length === 11 && phoneRegex.test(value)) {
        this.style.borderColor = "#28a745";
      } else if (value.length > 0) {
        this.style.borderColor = "#dc3545";
      } else {
        this.style.borderColor = "";
      }
    });
  }

  // Password strength indicator
  if (newPasswordInput) {
    newPasswordInput.addEventListener("input", function () {
      const password = this.value;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

      if (password.length === 0) {
        this.style.borderColor = "";
      } else if (passwordRegex.test(password)) {
        this.style.borderColor = "#28a745";
      } else {
        this.style.borderColor = "#dc3545";
      }
    });
  }

  // Form animations on load
  const settingsCards = document.querySelectorAll(".settings-card");
  settingsCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-20px)";
      setTimeout(() => {
        alert.style.display = "none";
      }, 300);
    }, 5000);
  });
});

// Toast notification function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast show";

  if (type === "error") {
    toast.style.backgroundColor = "#dc3545";
  } else {
    toast.style.backgroundColor = "#8B4513";
  }

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Theme persistence
function applyStoredTheme() {
  const isDarkMode = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// Apply theme on page load
document.addEventListener("DOMContentLoaded", function () {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
});
