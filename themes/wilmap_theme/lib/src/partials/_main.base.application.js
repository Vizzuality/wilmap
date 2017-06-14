  /**
   * Generic module with Application functions and initializations
   *
   * @example
   * App.Application.run();
   */
  App.Application = {

    /**
     * Methods for this module
     */
    methods: {

      /**
       * External links open in blank target
       */
      externalLinks: function() {

        $('a[href^="http://"], a[href^="https://"]').each(function(i, item) {
            $(this).attr('target','_blank');
        });

      },

      /**
       * News Navigation
       */
      newsNavigation: function() {

        if ($( '.node-news .block-views-blockcontinent-block-continents' ).length > 0) {
          var dom = '.node-news .block-views-blockcontinent-block-continents';
          var default_item = 'continent=all';
          var uri = location.href.split('/news?')[1];
              uri = ( uri == undefined || ( uri.indexOf('continent') == -1 && uri.indexOf('transnational') == -1 ) ) ? default_item : uri;


          $(dom + ' .views-row a').each(function(i, item) {
              var target = $(item).attr('href').split('?')[1];

              if ( target.indexOf(uri) != -1 ) {
                $(item).addClass('__active');
              }
          });

        }

      }

    },


    /**
     * Public function for run method
     */
    run: function() {

      // Execute all functions
      var m = this.methods;
      for ( var key in this.methods ) {
        //console.log(key);
        m[key]();
      }

      // log
      console.log( 'App.Application Running' );

    }

  };
