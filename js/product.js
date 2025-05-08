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

  // 1. Lấy dữ liệu sản phẩm từ localStorage
  const raw = localStorage.getItem('jasmineProduct');
  const product = JSON.parse(raw);
  const { name, price, colorImages } = product;

  const availableColors = Object.keys(colorImages);
  if (!availableColors.length) return;

  const firstColor = availableColors[0];
  let selectedColor = firstColor;
  let selectedSize = '';

  // 2. Gán dữ liệu ban đầu
  $('#detail-img').attr('src', colorImages[firstColor]);
  $('#detail-name').html(`${name} <span>(${firstColor})</span>`);
  $('#price').html(`<i class="fa-solid fa-yen-sign"></i>${price.toLocaleString()}`);
  $('#selected-color').text(firstColor);
  $('#selected-size').text('-');

  // 3. Hiển thị và lọc các màu hợp lệ
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

  // 4. Click chọn màu
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

  // 5. Chọn size
  $('.size-opt').on('click', function () {
    selectedSize = $(this).data('size');
    $('#selected-size').text(selectedSize);
    $('.size-opt').removeClass('active');
    $(this).addClass('active');
  });

  // 6. Thêm vào giỏ hàng
  $('.btn-add').on('click', function () {
    if (!selectedSize) return alert('Select a size');
    if (!selectedColor) return alert('Select a color');

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
