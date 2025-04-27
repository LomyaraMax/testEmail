// Инициализация emailJS (заменить USER_ID на свой позже)
emailjs.init("f9gI0d6zYeyiBnGL-");

const cartItemsContainer = document.getElementById('cart-items');
const addToCartButton = document.getElementById('add-to-cart');
const submitOrderButton = document.getElementById('submit-order');
let cart = [];

// Добавить товар в корзину
addToCartButton.addEventListener('click', () => {
  const size = document.getElementById('size-select').value;
  const existingItem = cart.find(item => item.size === size);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: "Футболка 'Лучший стиль'", price: 500, size, quantity: 1 });
  }

  renderCart();
});

// Показать корзину
function renderCart() {
  cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      ${item.name} - 
      <select onchange="changeSize(${index}, this.value)">
        <option ${item.size === "XS" ? "selected" : ""}>XS</option>
        <option ${item.size === "S" ? "selected" : ""}>S</option>
        <option ${item.size === "M" ? "selected" : ""}>M</option>
        <option ${item.size === "L" ? "selected" : ""}>L</option>
        <option ${item.size === "XL" ? "selected" : ""}>XL</option>
      </select>
      <input type="number" min="1" value="${item.quantity}" onchange="changeQuantity(${index}, this.value)">
    `;
    cartItemsContainer.appendChild(div);
  });
}

// Изменение размера
function changeSize(index, newSize) {
  cart[index].size = newSize;
}

// Изменение количества
function changeQuantity(index, newQuantity) {
  cart[index].quantity = parseInt(newQuantity);
}

// Отправка заказа
submitOrderButton.addEventListener('click', () => {
  const phone = document.getElementById('phone').value.trim();
  const comment = document.getElementById('comment').value.trim();

  if (!phone) {
    alert("Пожалуйста, введите номер телефона.");
    return;
  }

  if (cart.length === 0) {
    alert("Ваша корзина пуста!");
    return;
  }

  const orderDetails = cart.map(item => {
    return `${item.name} | Размер: ${item.size} | Кол-во: ${item.quantity}`;
  }).join('\n');

  const templateParams = {
    phone,
    comment,
    order: orderDetails
  };

  emailjs.send('service_lsff3bq', 'template_c2j8btb', templateParams)
    .then(response => {
      alert('Заказ отправлен успешно!');
      cart = [];
      renderCart();
      document.getElementById('phone').value = '';
      document.getElementById('comment').value = '';
    }, error => {
      console.error('Ошибка отправки', error);
      alert('Ошибка при отправке заказа.');
    });
});
