(function($) {

  /**
   * Set all elements within the collection to have the same height.
   */
  $.fn.equalHeight = function(){
    var heights = [];
    $.each(this, function(i, element){
      $element = $(element);
      var element_height;
      // Should we include the elements padding in it's height?
      var includePadding = ($element.css('box-sizing') == 'border-box') || ($element.css('-moz-box-sizing') == 'border-box');
      if (includePadding) {
        element_height = $element.innerHeight();
      } else {
        element_height = $element.height();
      }
      heights.push(element_height);
    });
    this.height(Math.max.apply(window, heights));
    return this;
  };

  /**
   * Create a grid of equal height elements.
   */
  $.fn.equalHeightGrid = function(columns){
    var $tiles = this;
    $tiles.css('height', 'auto');
    for (var i = 0; i < $tiles.length; i++) {
      if (i % columns === 0) {
        var row = $($tiles[i]);
        for(var n = 1;n < columns;n++){
          row = row.add($tiles[i + n]);
        }
        row.equalHeight();
      }
    }
    return this;
  };

  /**
   * Detect how many columns there are in a given layout.
   */
  $.fn.detectGridColumns = function() {
    var offset = 0, cols = 0;
    this.each(function(i, elem) {
      var elem_offset = $(elem).offset().top;
      if (offset === 0 || elem_offset == offset) {
        cols++;
        offset = elem_offset;
      } else {
        return false;
      }
    });
    return cols;
  };

  /**
   * Ensure equal heights now, on ready, load and resize.
   */
  $.fn.responsiveEqualHeightGrid = function() {
    var _this = this;
    function syncHeights() {
      var cols = _this.detectGridColumns();
      _this.equalHeightGrid(cols);  
    }
    $(window).bind('resize load', syncHeights);
    syncHeights();
    return this;
  };

})(jQuery);


$(document).ready(function() {
  
  $('.news-item').responsiveEqualHeightGrid();
  $('.resource-item').responsiveEqualHeightGrid();

  var $outerWrapper = $('#outer-wrapper'),
    $productsNav = $('.sub-nav-products'),
    $topicsNav = $('.topics-nav'),
    $logo = $('.logo');


  $logo.add($topicsNav).add('#offscreen-close').on('click', function(e) {
    $outerWrapper.toggleClass('nav-open');

    if ($outerWrapper.hasClass('nav-open')) {
      $outerWrapper.on('click', function() {
        $outerWrapper.off('click');
      });
    } else {
      $outerWrapper.removeClass('sub-nav-open');
      $productsNav.removeClass('nav-open');
    }
  });

  $('.nav-products').on('click', function(e) {
    $outerWrapper.toggleClass('sub-nav-open');
    $productsNav.addClass('nav-open');
  });

  $('.back').on('click', function(e) {
    $outerWrapper.removeClass('sub-nav-open');
    $productsNav.removeClass('nav-open');
  });

  var $whoPrompt = $('.who-prompt'),
      $forPrompt = $('.for-prompt');

  $whoPrompt.find('li').on('click', function() {
      $whoPrompt.addClass('next');
  });


  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('header').outerHeight();

  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
        $('#site-drawer').removeClass('drawn');
        $('.sites').removeClass('active');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
    }
    
    lastScrollTop = st;
  }

  $('.sites').on('click', function() {
    $(this).toggleClass('active');
    $('#site-drawer').toggleClass('drawn');
  });

});
