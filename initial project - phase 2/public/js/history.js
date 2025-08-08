// History page functionality

function toggleOrder(index) {
  const details = document.getElementById(`details-${index}`);
  const toggleIcon = document.getElementById(`toggle-${index}`);

  if (details.classList.contains("expanded")) {
    details.classList.remove("expanded");
    toggleIcon.classList.remove("rotated");
  } else {
    details.classList.add("expanded");
    toggleIcon.classList.add("rotated");
  }
}

// Add smooth scroll animation when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Animate order cards on load
  const orderCards = document.querySelectorAll(".order-card");
  orderCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });

  // Add click animation feedback
  const orderHeaders = document.querySelectorAll(".order-header");
  orderHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      toggleOrder(this.dataset.index);
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });
});
