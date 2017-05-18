'use strict';

App.Component.MapAccordion = class MapSidebar {

  /**
   * @param {String|HTMLElement} el
   * @param {Object} settings
   */
  constructor (el, settings) {
    this.options = Object.assign({}, settings);
    this.el = $(el);
    this.el.addClass('c-map-accordion');
    this.current = {};
    this.fetch()
      .then(this.init.bind(this));
  }

  /**
   * Fetches all countries, regions and countries and parses the data as a hierarchy.
   * @returns {Promise}
   */
  fetch() {
    this.data = {};
    return $.getJSON('api/continentsJSON')
      .then((res) => {
        for (let continent of res) {
          if (!continent.nid) continue;
          this.data[continent.nid] = { ...continent, regions: {} };
        }
        return $.getJSON('api/regionsJSON');
      })
      .then((res) => {
        for (let region of res) {
          if (!region.field_continent) continue;
          this.data[region.field_continent].regions = {
            ...this.data[region.field_continent].regions,
            [region.nid]: region
          };
        }
        return $.getJSON('api/countriesJSON');
      })
      .then((res) => {
        for (let country of res) {
          if (!country.field_continent_country || !country.field_region) continue;
          this.data[country.field_continent_country].regions[country.field_region].countries = {
            ...this.data[country.field_continent_country].regions[country.field_region].countries,
            [country.nid]: country
          };
        }
      });
  }

  /**
   * Inits the accordion sections
   */
  init() {
    // Create fragment where we'll render the sections
    this.accordion = $(document.createDocumentFragment());
    Object.keys(this.data).forEach((key) => {
      const continent = this.data[key];
      const continentConfig = {
        className: 'continent',
        childrenClass: 'js-regions',
        title: continent.title,
        nid: continent.nid
      };
      // create a continent lvl section
      const continentSection = MapSidebar.createSection(continentConfig, this.toggleSection.bind(this));

      Object.keys(continent.regions).forEach((key) => {
        const region = continent.regions[key];
        const regionConfig = {
          className: 'region',
          childrenClass: 'js-countries',
          title: region.field_title,
          nid: region.nid
        };
        // create a region lvl section and append it to the continent section previously created
        const regionSection = continentSection.find('.js-regions');
        regionSection.append(MapSidebar.createSection(regionConfig, this.toggleSection.bind(this)));

        Object.keys(region.countries).forEach((key) => {
          const country = region.countries[key];
          const countryConfig = {
            className: 'country',
            title: country.title,
            nid: country.nid
          };
          // create a country section and append it to the region section previously created
          // which has been previusly appended to its continent
          const countriesSection = regionSection.find('.js-countries');
          countriesSection.append(MapSidebar.createSection(countryConfig, this.onSelectLeaf.bind(this)))
        });
      });
      // append the continent section already containing regions and countries to the accordion
      this.accordion.append(continentSection);
    });
    this.render();
  }

  /**
   * Handles the click onn an accordion section
   * @param {Event} e
   */
  toggleSection(e) {
    e.preventDefault();
    e.stopPropagation();

    const section = $(e.target).closest('li');
    const level = section.data('level');
    const nid = parseInt(section.data('nid'));
    this.setCurrent(level, nid);

    if (this.current[level] && section.find('>ul').children().length ) {
      section.toggleClass('-open');
      if(this.hasOpenSection()) return this.el.removeClass('-collapsed');
    }
    if(!section.closest('.-open').length) this.el.addClass('-collapsed');
  }

  /**
   * Updates the current selected section and closes the previously selected one
   * @param {String} level
   * @param {Number} nid
   */
  setCurrent(level, nid) {
    let distinct = true;
    if(typeof this.current[level] !== 'undefined') {
      distinct = this.current[level] !== nid;
      this.resetCurrent(level);
    }
    this.current[level] = distinct ? nid : null;
  }

  /**
   * Resets the current selected sections
   * @param {String} level
   */
  resetCurrent(level) {
    const previous = $(`[data-nid="${this.current[level]}"]`);
    previous.removeClass('-open');

    const openChild = previous.find('.-open');
    openChild.removeClass('-open');
    this.current[level] = null;
    if(openChild.length) this.current[openChild.data('level')] = null;
  }

  /**
   * Tests whether the accordion has an open section
   */
  hasOpenSection() {
    return Object.keys(this.current)
      .some(key => this.current[key] !== null);
  }

  /**
   * Handles the lead
   * @param {Event} e
   */
  onSelectLeaf(e) {
    e.preventDefault();
    e.stopPropagation();

    const country = $(e.target).closest('li').find('>span').text();
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
  static createSection({ className, childrenClass, title, nid }, onClick) {
    const template = `<li>
<span>${title}</span>
</li>`;
    const section = $(template)
      .addClass(className)
      .attr('data-level', className)
      .attr('data-nid', nid)
      .click(onClick);

    if (childrenClass) section.append(`<ul class="${childrenClass}"></ul>`);
    return section;
  }

  render() {
    this.el.html(this.accordion);
  }

};
