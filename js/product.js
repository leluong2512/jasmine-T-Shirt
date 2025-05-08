$(function () {
  // Hiệu ứng hover nút
  $('.btn-add')
    .on('mouseover', function () {
      $(this).css({
        backgroundColor: '#fff',
        color: '#000',
        border: '1px solid #000'
      });
    })
    .on('mouseout', function () {
      $(this).css({
        backgroundColor: '',
        color: '',
        border: 'none'
      });
    });

    const raw = localStorage.getItem('jasmineProduct');
    if (!raw) {
      if (!sessionStorage.getItem('hasRedirectedToHome')) {
        sessionStorage.setItem('hasRedirectedToHome', 'true');
        console.error('No product data found. Redirecting to homepage...');
        window.location.href = 'index.html';  
      } else {
        console.warn('Redirect prevented to avoid loop');
        document.body.innerHTML = `
          <div style="text-align:center; margin-top:100px;">
            <p>Không có dữ liệu sản phẩm để hiển thị.</p>
            <a href="index.html">Quay về trang chủ</a>
          </div>
        `;
      }
      return;
    }  const product = JSON.parse(raw);
  const { name, price, colorImages } = product;

  const availableColors = Object.keys(colorImages);
  if (!availableColors.length) return;

  const firstColor = availableColors[0];
  let selectedColor = firstColor;
  let selectedSize = '';

  $('#detail-img').attr('src', colorImages[firstColor]);
  $('#detail-name').html(`${name} <span>(${firstColor})</span>`);
  $('#price').html(`<i class="fa-solid fa-yen-sign"></i>${price.toLocaleString()}`);
  $('#selected-color').text(firstColor);
  $('#selected-size').text('-');

  $('.color-opt').each(function () {
    const $opt = $(this);
    const color = $opt.data('color');
    if (colorImages[color]) {
      $opt
        .data('image', colorImages[color])
        .css({ backgroundColor: color.toLowerCase(), cursor: 'pointer' });
    } else {
      $opt.remove();
    }
  });

  $('.color-opt').first().addClass('active');

  $(document).on('click', '.color-opt', function () {
    const $this = $(this);
    const color = $this.data('color');
    const img = $this.data('image');
    $('#detail-img').attr('src', img);
    $('#detail-name span').text(`(${color})`);
    $('#selected-color').text(color);
    selectedColor = color;
    $('.color-opt').removeClass('active');
    $this.addClass('active');
  });

  $('.size-opt').on('click', function () {
    selectedSize = $(this).data('size');
    $('#selected-size').text(selectedSize);
    $('.size-opt').removeClass('active');
    $(this).addClass('active');
  });

  $('.btn-add').on('click', function () {
    if (!selectedSize) return alert('size guide , please');
    if (!selectedColor) return alert('color guide please');

    const CART_KEY = 'jasmineCart';
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const itemName = `${name} (${selectedColor})`;
    const idx = cart.findIndex(i => i.name === itemName && i.size === selectedSize);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({
        image: $('#detail-img').attr('src'),
        name: itemName,
        price,
        size: selectedSize,
        color: selectedColor,
        qty: 1
      });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    $('.cart-count').text(totalQty)
      .stop(true).animate({ fontSize: '1.8rem' }, 100)
      .animate({ fontSize: '1.2rem' }, 100);
  });
});
