'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

App.Component.CardGallery = function () {

  /**
   * @param {String|HTMLElement} el
   * @param {Object} settings
   */
  function CardGallery(el, settings) {
    _classCallCheck(this, CardGallery);

    this.options = Object.assign({}, settings);
    this.el = $(el);
    this.el.addClass('c-card-gallery');
    this.fetch().then(this.init.bind(this));
  }

  /**
   * Fetches the gallery cards data from the give endpoint
   * @returns {Promise}
   */


  _createClass(CardGallery, [{
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      return $.getJSON(this.options.endpoint).then(function (data) {
        _this.data = data;
      });
    }

    /**
     * Initializes the gallery
     */

  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.template = $(document.createDocumentFragment());
      this.data.forEach(function (topic) {
        var config = _this2.options.card;
        var card = new App.Component.Card({
          extended: config.extended,
          heading: topic[config.headingName],
          subheading: topic[config.subheadingName],
          details: topic[config.detailsName],
          location: topic[config.locationName],
          content: topic[config.contentName]
        });
        _this2.template.append(card.el);
      });

      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      this.el.html(this.template);
    }
  }]);

  return CardGallery;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

App.Component.Card = function () {

  /**
   * @param {Object} settings
   */
  function Card(settings) {
    _classCallCheck(this, Card);

    this.options = Object.assign({}, settings);
    this.el = $('<div class="c-card ' + (this.options.extended ? '-extended' : '') + '"></div>');

    this.template = '\n<p class="card-location">' + (this.options.location || 'location') + '</p>\n<h3 class="card-heading">' + (this.options.heading || 'heading') + '</h3>\n<h4 class="card-subheading">' + (this.options.subheading || 'subheading') + '</h4>\n<p class="card-details">' + (this.options.details || 'details') + '</p>\n<div class="card-content">' + this.options.content + '</div>\n';

    this.render();
  }

  _createClass(Card, [{
    key: 'render',
    value: function render() {
      this.el.html(this.template);
    }
  }]);

  return Card;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

App.Component.Loader = function () {

  /**
   * @param {Object} settings
   */
  function Loader(settings) {
    _classCallCheck(this, Loader);

    this.options = Object.assign({}, settings);
    this.el = $('<div></div>');
    this.el.addClass('c-loader');
    if (this.options.hidden) this.$el.addClass('-hidden');

    this.template = '\n<ul>\n<li class="title-loader -short"></li>\n<li class="title-loader"></li>\n<li class="date-loader -medium"></li>\n<li class="text-loader -short"></li>\n<li class="text-loader"></li>\n<li class="text-loader -medium"></li>\n<li class="text-loader -medium"></li>\n<li class="text-loader"></li>\n</ul>';

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.render();
  }

  /**
   * Toggles visibility of the loader
   */


  _createClass(Loader, [{
    key: 'toggleVisibility',
    value: function toggleVisibility() {
      this.el.toggleClass('-hidden');
    }
  }, {
    key: 'render',
    value: function render() {
      this.el.html(this.template);
    }
  }]);

  return Loader;
}();
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

App.Component.MapAccordion = function () {

  /**
   * @param {String|HTMLElement} el
   * @param {Object} settings
   */
  function MapSidebar(el, settings) {
    _classCallCheck(this, MapSidebar);

    this.options = Object.assign({}, settings);
    this.el = $(el);
    this.el.addClass('c-map-accordion');
    this.current = {};
    this.fetch().then(this.init.bind(this));
  }

  /**
   * Fetches all countries, regions and countries and parses the data as a hierarchy.
   * @returns {Promise}
   */


  _createClass(MapSidebar, [{
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      this.data = {};
      return $.getJSON('api/continentsJSON').then(function (res) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var continent = _step.value;

            if (!continent.nid) continue;
            _this.data[continent.nid] = _extends({}, continent, { regions: {} });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return $.getJSON('api/regionsJSON');
      }).then(function (res) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = res[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var region = _step2.value;

            if (!region.field_continent) continue;
            _this.data[region.field_continent].regions = _extends({}, _this.data[region.field_continent].regions, _defineProperty({}, region.nid, region));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return $.getJSON('api/countriesJSON');
      }).then(function (res) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = res[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var country = _step3.value;

            if (!country.field_continent_country || !country.field_region) continue;
            _this.data[country.field_continent_country].regions[country.field_region].countries = _extends({}, _this.data[country.field_continent_country].regions[country.field_region].countries, _defineProperty({}, country.nid, country));
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      });
    }

    /**
     * Inits the accordion sections
     */

  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      // Create fragment where we'll render the sections
      this.accordion = $(document.createDocumentFragment());
      Object.keys(this.data).forEach(function (key) {
        var continent = _this2.data[key];
        var continentConfig = {
          className: 'continent',
          childrenClass: 'js-regions',
          title: continent.title,
          nid: continent.nid
        };
        // create a continent lvl section
        var continentSection = MapSidebar.createSection(continentConfig, _this2.toggleSection.bind(_this2));

        Object.keys(continent.regions).forEach(function (key) {
          var region = continent.regions[key];
          var regionConfig = {
            className: 'region',
            childrenClass: 'js-countries',
            title: region.field_title,
            nid: region.nid
          };
          // create a region lvl section and append it to the continent section previously created
          var regionSection = continentSection.find('.js-regions');
          regionSection.append(MapSidebar.createSection(regionConfig, _this2.toggleSection.bind(_this2)));

          Object.keys(region.countries).forEach(function (key) {
            var country = region.countries[key];
            var countryConfig = {
              className: 'country',
              title: country.title,
              nid: country.nid
            };
            // create a country section and append it to the region section previously created
            // which has been previusly appended to its continent
            var countriesSection = regionSection.find('.js-countries');
            countriesSection.append(MapSidebar.createSection(countryConfig, _this2.onSelectLeaf.bind(_this2)));
          });
        });
        // append the continent section already containing regions and countries to the accordion
        _this2.accordion.append(continentSection);
      });
      this.render();
    }

    /**
     * Handles the click onn an accordion section
     * @param {Event} e
     */

  }, {
    key: 'toggleSection',
    value: function toggleSection(e) {
      e.preventDefault();
      e.stopPropagation();

      var section = $(e.target).closest('li');
      var level = section.data('level');
      var nid = parseInt(section.data('nid'));
      this.setCurrent(level, nid);

      if (this.current[level] && section.find('>ul').children().length) {
        section.toggleClass('-open');
        if (this.hasOpenSection()) return this.el.removeClass('-collapsed');
      }
      if (!section.closest('.-open').length) this.el.addClass('-collapsed');
    }

    /**
     * Updates the current selected section and closes the previously selected one
     * @param {String} level
     * @param {Number} nid
     */

  }, {
    key: 'setCurrent',
    value: function setCurrent(level, nid) {
      var distinct = true;
      if (typeof this.current[level] !== 'undefined') {
        distinct = this.current[level] !== nid;
        this.resetCurrent(level);
      }
      this.current[level] = distinct ? nid : null;
    }

    /**
     * Resets the current selected sections
     * @param {String} level
     */

  }, {
    key: 'resetCurrent',
    value: function resetCurrent(level) {
      var previous = $('[data-nid="' + this.current[level] + '"]');
      previous.removeClass('-open');

      var openChild = previous.find('.-open');
      openChild.removeClass('-open');
      this.current[level] = null;
      if (openChild.length) this.current[openChild.data('level')] = null;
    }

    /**
     * Tests whether the accordion has an open section
     */

  }, {
    key: 'hasOpenSection',
    value: function hasOpenSection() {
      var _this3 = this;

      return Object.keys(this.current).some(function (key) {
        return _this3.current[key] !== null;
      });
    }

    /**
     * Handles the lead
     * @param {Event} e
     */

  }, {
    key: 'onSelectLeaf',
    value: function onSelectLeaf(e) {
      e.preventDefault();
      e.stopPropagation();

      var country = $(e.target).closest('li').find('>span').text();
      console.info(country);
    }

    /**
     * Creates an accordion section
     * @param className - css class of the section
     * @param childrenClass - css class of the subsections
     * @param title - section title
     * @param nid - section unique id
     * @param onClick - click callback
     * @returns {*|jQuery}
     */

  }, {
    key: 'render',
    value: function render() {
      this.el.html(this.accordion);
    }
  }], [{
    key: 'createSection',
    value: function createSection(_ref, onClick) {
      var className = _ref.className,
          childrenClass = _ref.childrenClass,
          title = _ref.title,
          nid = _ref.nid;

      var template = '<li>\n<span>' + title + '</span>\n</li>';
      var section = $(template).addClass(className).attr('data-level', className).attr('data-nid', nid).click(onClick);

      if (childrenClass) section.append('<ul class="' + childrenClass + '"></ul>');
      return section;
    }
  }]);

  return MapSidebar;
}();