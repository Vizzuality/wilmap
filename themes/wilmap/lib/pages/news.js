'use strict';

(function () {
  const gallerynews = document.querySelector('.gallery-scroll');
  let totalPages = 0;
  const category = 'all';
  const loaders = [];

  function initLoaders() {
    for (let i = 0; i < 3; i += 1) {
      loaders[i] = new App.Component.Loader();
      $(gallerynews).append(loaders[i].el);
    }
  }

  function showNewsGallery(page, categoryFilter) {
    $(gallerynews).html('');
    initLoaders();
    var numbersPager = '';
    var urlJSON = '';
    if (categoryFilter !== 'all') {
      urlJSON = 'api/newsJSON?field_category_target_id=' + categoryFilter + '&items_per_page=3&page=' + page;
    } else {
      urlJSON = 'api/newsJSON?items_per_page=3&page=' + page;
    }
    $.ajax({
      url: '' + urlJSON,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/hal+json'
      },

      success: function showNews(data) {
        if (data.length === 0) {
        } else {
          $(gallerynews).html('');
        }
        for (var i = 0; i < data.length; i += 1) {
          var contentbox = '<div data-category="' + data[i].field_category + '" class="info-news">\n                <h2>' + data[i].title + '</h2>\n                <span class="date">' + data[i].field_date_published + '</span>\n                <div class="text">' + data[i].field_summary + '</div>\n                <a class="butn -primary" href="' + data[i].path + '">read more</a>\n                </div>';
          $(gallerynews).append(contentbox);
        }
        if (page > 1) {
          numbersPager += '<li class="butn -primary numberPagerClick" data-value="' + (page - 1) + '">back</li>';
        }
        // previous pages
        for (var j = page - 4; j < page; j += 1) {
          if (j < 1) continue;

          if (j === page - 4 && j >= 2) {
            numbersPager += '<li class="numberPagerClick" data-value="1">1</li>';
            numbersPager += '<li class="numberPagerClick" data-value="' + j + '">\u2026</li>';
            continue;
          }

          if (j <= totalPages) {
            if (j < page) {
              numbersPager += '<li class="numberPagerClick" data-value="' + j + '">' + j + '</li>';
            }
          }
        }
        // next pages
        for (var _j = page; _j < page + 5; _j += 1) {
          if (_j <= totalPages) {
            if (_j === page) {
              numbersPager += '<li class="-selected numberPagerClick" data-value="' + _j + '">' + _j + '</li>';
              continue;
            }

            if (_j < page + 4) {
              numbersPager += '<li class="numberPagerClick" data-value="' + _j + '">' + _j + '</li>';
            }

            if (_j === page + 4) {
              numbersPager += '<li class="numberPagerClick" data-value="' + _j + '">\u2026</li>';
              numbersPager += '<li class="numberPagerClick" data-value="' + totalPages + '">' + totalPages + '</li>';
            }
          }
        }
        if (page < totalPages) {
          numbersPager += '<li class="butn -primary numberPagerClick" data-value="' + (page + 1) + '">next</li>';
        }

        $('.pager-numbers').html(numbersPager);
        $('.numberPagerClick').click(function () {
          showNewsGallery($(this).data('value'), category);
        });
      }
    });
  }

  function getPager(categoryPager) {
    var urlJSON = '';
    if (categoryPager !== 'all') {
      urlJSON = 'api/newsJSON?field_category_target_id=' + categoryPager +'&items_per_page=3';
    } else {
      urlJSON = 'api/newsJSON';
    }
    $.ajax({
      url: '' + urlJSON,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/hal+json'
      },
      success: function success(dataNewsCount) {
        totalPages = parseInt(dataNewsCount.length / 3);
        showNewsGallery(0, categoryPager);
      }
    });
  }

  function getCategories () {
    $.getJSON('api/categoriesJSON', function (data) {
      for (var i = 0; i < data.length; i += 1) {
        var contentFilter = '<li data-value="' + data[i].nid + '" class="option-category">' + data[i].title + '</li>';
        $('.list-categories').append(contentFilter);
      }
      $('.option-category').click(function clickCategory () {
        $('.option-category').removeClass('-selected');
        var dataValue = $(this).data('value');
        var offset = $(this).offset().top - $('.nav-categories').parent().offset().top;
        $('.small-bar').css('top', offset - 10 + 'px');
        $('.small-bar').css('height', $(this).height() + 20 + 'px');
        $(this).addClass('-selected');
        getPager(dataValue);
      });
    });
  }

  function init () {
    initLoaders();
    getCategories();
    // Call pager function then call show data function
    getPager(category);
  }

  init();

})();
