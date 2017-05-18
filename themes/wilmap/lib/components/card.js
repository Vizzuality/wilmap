'use strict';

App.Component.Card = class Card {

  /**
   * @param {Object} settings
   */
  constructor(settings) {
    this.options = Object.assign({}, settings);
    this.el = $(`<div class="c-card ${this.options.extended ? '-extended' : ''}"></div>`);

    this.template = `
<p class="card-location">${this.options.location || 'location'}</p>
<h3 class="card-heading">${this.options.heading || 'heading'}</h3>
<h4 class="card-subheading">${this.options.subheading || 'subheading'}</h4>
<p class="card-details">${this.options.details || 'details'}</p>
<div class="card-content">${this.options.content}</div>
`;

    this.render();
  }

  render() {
    this.el.html(this.template);
  }

};
