document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const descInput = document.getElementById('description');
  const priceInput = document.getElementById('price');
  const categorySelect = document.getElementById('category');
  const imageInput = document.getElementById('image');

  form.addEventListener('submit', (e) => {
    let errors = [];

    if (!nameInput.value.trim()) {
      errors.push('Product name is required.');
    }

    if (!descInput.value.trim()) {
      errors.push('Description is required.');
    }

    const price = parseFloat(priceInput.value);
    if (isNaN(price) || price <= 0) {
      errors.push('Price must be a positive number.');
    }

    if (!categorySelect.value) {
      errors.push('Please select a category.');
    }

    if (!imageInput.files || imageInput.files.length === 0) {
      errors.push('Product image is required.');
    } else {
      const file = imageInput.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        errors.push('Product image must be a JPEG, PNG, GIF, or WEBP file.');
      }
    }

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join('\n'));
    }
  });
});
