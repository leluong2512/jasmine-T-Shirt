
$(function () {
	function handleMobileJS() {
	  if ($(window).width() <= 767) {
		$('.openbtn').click(function () {
			$(this).toggleClass('active');
			$('#g-nav').toggleClass('panelactive');
		});
		
		$('#g-nav a').click(function () {
			$('.openbtn').removeClass('active');
			$('#g-nav').removeClass('panelactive');
		});
		$('.header-nav').css('display',('none'));
		$('.top-content_img').css('display',('none'));
		$('.slider').css('display',('block'))

		}else{
			$('.header-nav').css('display',('flex'));
			$('.menu-bar-mobile').css('display',('none'));
			$('.top-content_img').css('display',('grid'));
			$('.slider').css('display',('none'));
			$('.top-content').css('backgroundColor',('none'));


	
		}	  
	}
	function search(){
		$('.open-btn').click(function () {
			$('#search-wrap').addClass('panelactive');
			$('#search-text').focus();
		});
		
		$('.close-btn').click(function () {
			$('#search-wrap').removeClass('panelactive');
		
		});
	}
	
  
	search();
	handleMobileJS(); 
	$(window).resize(search); 
	$(window).resize(handleMobileJS); 

  });
  
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
  
	$(document).on('click', function(e) {
	  if (!$(e.target).closest('.size-overlay').length) {
		$('.size-overlay').remove();
	  }
	});
  
	$(document).on('click', '.size-advisor', function(e) {
	  e.stopPropagation();
	  $('#size-popup').removeClass('hidden');
	});
  
	$('#size-popup .close-popup').on('click', function(e) {
	  e.stopPropagation();
	  $('#size-popup').addClass('hidden');
	});
  
	$(document).on('click', '.size-option', function(e) {
	  e.stopPropagation();
  
	  const size = $(this).text().trim();
	  const $card = $(this).closest('.men-section_list, .women-section_list');
  
	  const image = $card.find('img').attr('src') || '';
  
	  const name = (
		$card.find('.product_name h3').text().trim() ||
		''
	  );
  
	  let priceText = '';
	  $card.find('p').each(function() {
		const txt = $(this).text().trim();
		if (/\d/.test(txt)) {
		  priceText = txt;
		  return false; 
		}
	  });
	  const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
  
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
  
  
	  $card.find('.size-overlay').remove();
	});
	$('.men-section_list, .women-section_list').off('click').on('click', function(e) {
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

