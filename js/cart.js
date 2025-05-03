// cart.js
$(function() {
  const CART_KEY = 'jasmineCart';

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function updateCartCount() {
    const total = getCart().reduce((sum, i) => sum + i.qty, 0);
    let $count = $('.cart-count');
    if (!$count.length) {
      $('.joinus').append('<span class="cart-count">0</span>');
      $count = $('.cart-count');
    }
    $count.text(total);
  }

  function renderCart() {
    const cart = getCart();
    const $grid = $('#cart-content').empty();

    if (!cart.length) {
      $grid.html('<p class="empty">YOUR BASKET IS EMPTY</p>');
      $('#cart-summary').addClass('hidden');
      return;
    }

    cart.forEach((item, idx) => {
      const rawSrc = item.image || '';
      const imgSrc = rawSrc.replace(/^(\.\.\/)+/, '');
      const priceValue = typeof item.price === 'number' ? item.price : 0;
      const priceFormatted = priceValue.toLocaleString();

      $grid.append(`
        <div class="cart-item" data-index="${idx}">
          <img src="${imgSrc}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>Size: ${item.size}</p>
          <p><i class="fa-solid fa-yen-sign"></i>${priceFormatted}</p>
          <div class="quantity-controls">
            <div class="decrease"><i class="fa-solid fa-minus"></i></div>
            <span class="qty">${item.qty}</span>
            <div class="increase"><i class="fa-solid fa-plus"></i></div>
          </div>
          <div class="remove-btn"><i class="fa-solid fa-trash"></i></div>
        </div>
      `);
    });

    updateSummary();
    $('#cart-summary').removeClass('hidden');
  }

  function updateSummary() {
    const total = getCart().reduce((sum, i) => {
      const p = typeof i.price === 'number' ? i.price : 0;
      return sum + p * i.qty;
    }, 0);
    $('#total-price').html(
      `TOTAL: <i class="fa-solid fa-yen-sign"></i>${total.toLocaleString()}`
    );
  }

  $('#cart-content').on('click', '.increase, .decrease', function() {
    const idx = +$(this).closest('.cart-item').data('index');
    const cart = getCart();
    if ($(this).hasClass('increase')) cart[idx].qty += 1;
    else if (cart[idx].qty > 1) cart[idx].qty -= 1;
    saveCart(cart);
    renderCart();
  });
  $('#cart-content').on('click', '.remove-btn', function() {
    const idx = +$(this).closest('.cart-item').data('index');
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  });

  $('#continue-shopping').on('click', function(){
    const cat = localStorage.getItem('lastCategory');
    if (cat === 'women') {
      window.location.href = 'women_index.html';
    } else {
      window.location.href = 'men_page.html';
    }
  });
  renderCart();
  updateCartCount();
});
