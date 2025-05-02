// // men_main.js
// $(function() {
//     // Lấy hoặc khởi tạo giỏ hàng từ localStorage
//     function getCart() {
//       return JSON.parse(localStorage.getItem('jasmineCart') || '[]');
//     }
//     function saveCart(cart) {
//       localStorage.setItem('jasmineCart', JSON.stringify(cart));
//       updateCartCount();
//     }
//     // Cập nhật số lượng tổng lên header
//     function updateCartCount() {
//       let total = getCart().reduce((sum, item) => sum + item.qty, 0);
//       let $count = $('.cart-count');
//       if (!$count.length) {
//         // nếu chưa có span.cart-count, thêm vào
//         $('.joinus').append('<span class="cart-count"></span>');
//         $count = $('.cart-count');
//       }
//       $count.text(total);
//     }
  
//     // Hiển thị overlay chọn size
//     $('.add-icon').on('click', function() {
//       // nếu đã có overlay trên container này thì không add again
//       let $cont = $(this).closest('.img-container');
//       if ($cont.find('.size-overlay').length) return;
  
//       const overlay = $(`
//         <div class="size-overlay">
//           <div class="size-list">
//             <div class="size-option">S</div>
//             <div class="size-option">M</div>
//             <div class="size-option">L</div>
//             <div class="size-option">XL</div>
//             <div class="size-option">XXL</div>
//             <div class="size-advisor">Tư vấn chọn size</div>
//           </div>
//         </div>`);
//       $cont.append(overlay);
//     });
  
//     // Đóng popup tư vấn size
//     $('#size-popup .close-popup').on('click', function() {
//       $('#size-popup').addClass('hidden');
//     });
  
//     // Click vào "Tư vấn chọn size"
//     $(document).on('click', '.size-advisor', function() {
//       $('#size-popup').removeClass('hidden');
//     });
  
//     // Khi chọn size, thêm product vào giỏ
//     $(document).on('click', '.size-option', function() {
//       const size = $(this).text();
//       const $cont = $(this).closest('.men-section_list');
//       const image = $cont.find('img').attr('src');
//       const name = $cont.find('.men-section_name h3').text();
//       // chuyển giá 2,990 thành số 2990
//       const priceText = $cont.find('p').text().replace(/[^\d]/g, '');
//       const price = parseInt(priceText, 10);
  
//       let cart = getCart();
//       // kiểm tra xem đã có item (same name+size) chưa
//       const idx = cart.findIndex(i => i.name === name && i.size === size);
//       if (idx > -1) {
//         cart[idx].qty += 1;
//       } else {
//         cart.push({ image, name, price, size, qty: 1 });
//       }
//       saveCart(cart);
//       // gỡ overlay chọn size
//       $cont.find('.size-overlay').remove();
//     });
  
//     // Khởi tạo đếm khi load trang
//     updateCartCount();
//   });
  