'use strict';

(function ($) {
  // *******************************************************
  // FUNCTIONS FOR ALL PAGES
  // *******************************************************

  $('.search-box').click(function () {
    $('.search-modal').css('display', 'block');
    $('.search-back').css('display', 'block');
    setTimeout(function () {
      $('.search-modal').addClass('-visible');
      $('.search-back').addClass('-visible');
    }, 10);
  });

  $('.search-back').click(function () {
    $('.search-modal').removeClass('-visible');
    $('.search-back').removeClass('-visible');
    setTimeout(function () {
      $('.search-modal').css('display', 'none');
      $('.search-back').css('display', 'none');
    }, 201);
  });

  $('.search-box').keypress(function () {
    // const value = $('.search-box').val();
    $.ajax({
      url: 'api/topicsJSON',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/hal+json'
      },
      success: function searchTerm(data, status, xhr) {
        // here the magic
      }
    });
  });
})(jQuery);