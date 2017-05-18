'use strict';

App.Component.Loader = class Loader {

  /**
   * @param {Object} settings
   */
  constructor (settings) {
    this.options = Object.assign({}, settings);
    this.el = $('<div></div>');
    this.el.addClass('c-loader');
    if(this.options.hidden) this.$el.addClass('-hidden');

    this.template = `
<ul>
<li class="title-loader -short"></li>
<li class="title-loader"></li>
<li class="date-loader -medium"></li>
<li class="text-loader -short"></li>
<li class="text-loader"></li>
<li class="text-loader -medium"></li>
<li class="text-loader -medium"></li>
<li class="text-loader"></li>
</ul>`;

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.render();
  }

  /**
   * Toggles visibility of the loader
   */
  toggleVisibility() {
    this.el.toggleClass('-hidden');
  }

  render() {
    this.el.html(this.template);
  }

};
