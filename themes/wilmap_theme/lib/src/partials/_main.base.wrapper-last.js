
  /**
   * Attach the App code to Drupal.
   *
   */
  Drupal.behaviors.wilmap_theme = {
    attach: function ( context, settings ) {

      // Rock & Roll
      App.DrupalHack.run();

      App.Gumbyfy.run();
      App.Application.run();

console.log('aplica theme-started');
      // Flag to avoid DOM modification more than one time
      $( 'body' ).addClass( 'theme-started' );

    }
  };

})(jQuery, Drupal);
