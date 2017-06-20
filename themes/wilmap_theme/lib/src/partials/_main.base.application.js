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

//console.log(uri + ' || ' + target + ' || ' + (uri.indexOf(target)));


              if ( uri.indexOf(target) != -1 ) {
                $(item).addClass('__active');
              }
          });

          var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));
          if(isPhone) {
            $(dom + ' .view-content').slick({
              dots: false,
              arrows: false,
              infinite: false,
              speed: 300,
              variableWidth: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              swipeToSlide: true,
              centerMode: true,
              focusOnSelect: true
            });

            // Nav to active item
            var active = parseInt($(dom + ' .views-row a.__active').parents('.slick-slide').attr('data-slick-index'));
            $(dom + ' .view-content').slick('slickGoTo', active);
          }
        }

      },

      /**
       * Resize and orientation triggers
       */
      resizeAndOrientation: function() {

        // Add inital responsive classes
        App.Utils.AddResponsiveBodyClasses();
        App.curResponsiveClass  = ( ( App.Utils.isMobile.Phone( 'desktop' ) )?
                                  'responsive-mobile-phone':( App.Utils.isMobile.Tablet( 'desktop' ) )?
                                  'responsive-mobile-tablet':'responsive-desktop');


        // Resize trigger
        $( window ).on( 'resize', function(){
          App.Utils.AddResponsiveBodyClasses();
          var nextResponsiveClass  = ( ( App.Utils.isMobile.Phone( 'desktop' ) )?
                                     'responsive-mobile-phone':( App.Utils.isMobile.Tablet( 'desktop' ) )?
                                     'responsive-mobile-tablet':'responsive-desktop');


          // If Desktop resize, reload page for initialize mobile
          if( App.Utils.isDesktop() && App.curResponsiveClass !== nextResponsiveClass ) {
            location.reload();
            console.log('Responsive Reloaded')
          }
        });

        // Orientarion trigger
        $( window ).on( "orientationchange", function() {
          App.Utils.AddResponsiveBodyClasses();
        });

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
