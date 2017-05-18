'use strict';

(function ($, settings) {
  var nodeid = settings.path.currentPath.split('/').pop();
  var categoryId = '';
  $('.node-pages').addClass('news-detail-page');
  changeMenuOption('news');

  $.ajax({
    url: '/api/newsJSON?nid=' + nodeid,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/hal+json'
    },
    success: function showDetail(data) {
      categoryId = data[0].field_category;
      $('.title-news-detail').html(data[0].title);
      $('.date-news-detail').html(data[0].field_date_published);
      $('.content-news-detail').html(data[0].field_summary);

      $.ajax({
        url: '/api/newsJSON?field_category_target_id=' + categoryId,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/hal+json'
        },
        success: function success(dataRelated) {
          for (var i = 0; i < 2; i += 1) {
            var randomValue = Math.floor(Math.random() * dataRelated.length + 1);
            var boxRelated = '<a href="' + dataRelated[randomValue].path + '" class="news-info">\n                    <strong class="related-title">' + dataRelated[randomValue].title + '</strong>\n                    <span class="related-date">' + dataRelated[randomValue].field_date_published + '</span>\n                    <div class="text paragraph">\n                        ' + dataRelated[randomValue].field_summary + '\n                    </div>\n                    <div class="shadow"></div>\n                  </a>';
            $('.gallery-news-related').append(boxRelated);
          }
        }
      });
    }
  });
})(jQuery, drupalSettings);