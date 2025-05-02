function delayScrollAnime() {
	var time = 0.2;
	var value = time;
	$('.delayScroll').each(function () {
		var parent = this;					
		var elemPos = $(this).offset().top;
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		var childs = $(this).children();	
		
		if (scroll >= elemPos - windowHeight && !$(parent).hasClass("play")) {
			$(childs).each(function () {
				
				if (!$(this).hasClass("fadeUp")) {
					$(parent).addClass("play");	
					$(this).css("animation-delay", value + "s");
					$(this).addClass("fadeUp");
					value = value + time;
					
					var index = $(childs).index(this);
					if((childs.length-1) == index){
						$(parent).removeClass("play");
					}
				}
			})
		}else {
			$(childs).removeClass("fadeUp");
			value = time;
		}
	})
    $('.delayScrollRight').each(function () {
        var parent = this;					
        var elemPos = $(this).offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        var childs = $(this).children();	
        
        if (scroll >= elemPos - windowHeight && !$(parent).hasClass("play")) {
            $(childs).each(function () {
                
                if (!$(this).hasClass("fadeRight")) {
                    $(parent).addClass("play");	
                    $(this).css("animation-delay", value + "s");
                    $(this).addClass("fadeRight");
                    value = value + time;
                    
                    var index = $(childs).index(this);
                    if((childs.length-1) == index){
                        $(parent).removeClass("play");
                    }
                }
            })
        }else {
            $(childs).removeClass("fadeRight");
            value = time;
        }
    })

}

	$(window).scroll(function (){
		delayScrollAnime();
	});

	$(window).on('load', function(){
		delayScrollAnime();
	});




// manpage and womenpage


$(function() {
	const CART_KEY = 'jasmineCart';
	const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
	const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
	$('.cart-count').text(totalQty > 0 ? totalQty : '');

	function getCart() {
	  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
	}
  
	function saveCart(cart) {
	  localStorage.setItem(CART_KEY, JSON.stringify(cart));
	  updateCartCount();
	}
  
	function updateCartCount() {
	  const total = getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
	  let $count = $('.cart-count');
	  if (!$count.length) {
		$('.joinus').append('<span class="cart-count">&lbrack0&rbrack</span>');
		$count = $('.cart-count');
	  }
	  $count.text(total);
	}
  
	// Mở overlay chọn size
	$('.add-icon').on('click', function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  let $imgCont = $(this).hasClass('add-icon')
		? $(this).closest('.img-container')
		: $(this).closest('.women-section_img');
	  if ($imgCont.find('.size-overlay').length) return;
	  const overlay = $(
		'<div class="size-overlay">' +
		  '<div class="size-list">' +
			'<div class="size-option">S</div>' +
			'<div class="size-option">M</div>' +
			'<div class="size-option">L</div>' +
			'<div class="size-option">XL</div>' +
			'<div class="size-option">XXL</div>' +
			'<div class="size-advisor">SIZE RECOMMENDER</div>' +
		  '</div>' +
		'</div>'
	  );
	  $imgCont.append(overlay);
	});
  
	// Click ngoài overlay đóng overlay
	$(document).on('click', function(e) {
	  if (!$(e.target).closest('.size-overlay').length) {
		$('.size-overlay').remove();
	  }
	});
  
	// Mở popup tư vấn size
	$(document).on('click', '.size-advisor', function(e) {
	  e.stopPropagation();
	  $('#size-popup').removeClass('hidden');
	});
  
	// Đóng popup tư vấn size
	$('#size-popup .close-popup').on('click', function(e) {
	  e.stopPropagation();
	  $('#size-popup').addClass('hidden');
	});
  
	// Chọn size và thêm vào giỏ
	$(document).on('click', '.size-option', function(e) {
	  e.stopPropagation();
  
	  const size = $(this).text().trim();
	  const $card = $(this).closest('.men-section_list, .women-section_list');
  
	  // Ảnh sản phẩm
	  const image = $card.find('img').attr('src') || '';
  
	  // Tên sản phẩm (Men hoặc Women)
	  const name = (
		$card.find('.product_name h3').text().trim() ||
		''
	  );
  
	  // Lấy text chứa số để xác định giá
	  let priceText = '';
	  $card.find('p').each(function() {
		const txt = $(this).text().trim();
		if (/\d/.test(txt)) {
		  priceText = txt;
		  return false; // break
		}
	  });
	  const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
  
	  // Lấy giỏ hàng, thêm hoặc tăng số lượng
	  const cart = getCart();
	  const idx = cart.findIndex(i => i.name === name && i.size === size);
	  if (idx > -1) {
		cart[idx].qty += 1;
	  } else {
		cart.push({ image, name, price, size, qty: 1 });
	  }
	  saveCart(cart);
	  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
	  $('.cart-count').text(totalQty)
		.stop(true).animate({ fontSize: '1.8rem' }, 100)
		.animate({ fontSize: '1.2rem' }, 100);
  
  
	  // Đóng overlay
	  $card.find('.size-overlay').remove();
	});
	$('.men-section_list, .women-section_list').off('click').on('click', function(e) {
		// Bỏ qua nếu click vào overlay chọn size hoặc dấu cộng
		if ($(e.target).closest('.add-icon, .size-overlay, .size-option, .size-advisor').length) return;
		e.preventDefault();
	  
		const raw = this.getAttribute('data-colors');
		const colorImages = raw ? JSON.parse(raw) : { DEFAULT: $(this).find('img').attr('src') };
		const firstColor = Object.keys(colorImages)[0];
		const defaultImage = colorImages[firstColor];
		const url = window.location.pathname.toLowerCase();
		const category = url.includes('women_index.html') ? 'women' : 'men';
	  
		const product = {
		  name        : $(this).find('.product_name h3').text().trim().replace(/\s*\(.*\)$/, ''),
		  price       : parseInt($(this).find('p').text().replace(/[^\d]/g, ''), 10),
		  colorImages : colorImages,
		  image       : defaultImage
		};
	  
		localStorage.setItem('lastCategory', category);
	  
		localStorage.setItem('jasmineProduct', JSON.stringify(product));
		window.location.href = 'product.html';
	 });
	 
	 $(function(){
		const path = window.location.pathname.toLowerCase();
	  
		if (path.includes('men_page.html') || path.endsWith('/men_page.html')) {
		  localStorage.setItem('lastCategory', 'men');
		} 
		else if (path.includes('women_index.html') || path.endsWith('/women_index.html')) {
		  localStorage.setItem('lastCategory', 'women');
		}
	  });

	  $(function(){
	
	$('.add-icon i').css('transform','scale(1.2)')
	.on('mouseover',function(){
		$(this).stop(true).animate({
			scale:'1.5'
		},300)
	})
	$('.add-icon i').on('mouseout',function(){
		$(this).stop(true).animate({
			scale : '1'
		},300)
	})
})
})

// $(function(){
// 	// === LIVE FILTER & REDIRECT ===
// 	function filterShop(q) {
// 	  const query = q.toLowerCase();
// 	  $('.men-section_list, .women-section_list').each(function(){
// 		const name = $(this).find('.product_name h3').text().toLowerCase();
// 		$(this).toggle(name.includes(query));
// 	  });
// 	}
// 	function filterCart(q) {
// 	  const query = q.toLowerCase();
// 	  $('#cart-content .cart-item').each(function(){
// 		const name = $(this).find('h3').text().toLowerCase();
// 		$(this).toggle(name.includes(query));
// 	  });
// 	}
// 	// Khởi filter nếu có ?search=…
// 	const params = new URLSearchParams(window.location.search);
// 	const initSearch = params.get('search') || '';
// 	if (initSearch) {
// 	  $('.search').val(initSearch);
// 	  if (/men_page|women_index/.test(location.pathname)) {
// 		filterShop(initSearch);
// 	  } else if (location.pathname.endsWith('cart.html')) {
// 		filterCart(initSearch);
// 	  }
// 	}
// 	// Handle Enter hoặc click icon
// 	$('.search').on('keyup', function(e){
// 	  if (e.key === 'Enter') $('.fa-magnifying-glass').trigger('click');
// 	});
// 	$('.fa-magnifying-glass').on('click', function(){
// 	  const q = $('.search').val().trim();
// 	  if (!q) return;
// 	  // trên shop/cart thì filter live
// 	  if (/men_page|women_index/.test(location.pathname)) {
// 		filterShop(q);
// 	  } else if (location.pathname.endsWith('cart.html')) {
// 		filterCart(q);
// 	  } else {
// 		// trên index/product: redirect kèm param
// 		location.href = `men_page.html?search=${encodeURIComponent(q)}`;
// 	  }
// 	  // thêm vào history
// 	  addHistory(q);
// 	  renderHistory();
// 	});
  
// 	// === SEARCH HISTORY ===
// 	const HISTORY_KEY = 'jasmineSearchHistory', MAX_HISTORY = 5;
// 	function getHistory() {
// 	  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
// 	}
// 	function saveHistory(arr) {
// 	  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, MAX_HISTORY)));
// 	}
// 	function addHistory(term) {
// 	  if (!term) return;
// 	  let hist = getHistory().filter(t => t !== term);
// 	  hist.unshift(term);
// 	  saveHistory(hist);
// 	}
// 	function renderHistory() {
// 	  const $box = $('.search-history').empty();
// 	  const hist = getHistory();
// 	  if (!hist.length) return $box.addClass('hidden');
// 	  hist.forEach(t => $box.append(`<div class="history-item">${t}</div>`));
// 	  $box.append(`<div class="history-clear">Clear history</div>`)
// 		  .removeClass('hidden');
// 	}
// 	// sự kiện
// 	$('.search').on('focus', renderHistory);
// 	$(document).on('click', e => {
// 	  if (!$(e.target).closest('.search, .search-history').length) {
// 		$('.search-history').addClass('hidden');
// 	  }
// 	});
// 	$('.search-history')
// 	  .on('click', '.history-item', function(){
// 		const q = $(this).text();
// 		$('.search').val(q);
// 		$('.fa-magnifying-glass').trigger('click');
// 	  })
// 	  .on('click', '.history-clear', function(){
// 		localStorage.removeItem(HISTORY_KEY);
// 		$('.search-history').addClass('hidden');
// 	  });
//   });
  