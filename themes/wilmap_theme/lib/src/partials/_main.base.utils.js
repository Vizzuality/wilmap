  /**
   * Utils functions
   *
   * @example
   * App.Utils.isMobile.Any();
   * App.Utils.isMobile.Tablet();
   * App.Utils.isMobile.Phone();
   * App.Utils.isDesktop();
   * App.Utils.Orientation();
   * App.Utils.Slugify( 'HÓLA' );

   */
  App.Utils = {
    /**
     * isMobile Function
     */
    isMobile: {
      /**
       * Configuration
       */
      _configuration: {
        min_device_width:         414,  //From scss _settings.scss
        tablet_device_width:      768,  //From scss _settings.scss
        document_width:          1170,  //From scss _settings.scss
        max_device_width:        2880   //From scss _settings.scss
      },

      Android: function() {
        return navigator.userAgent.match( /Android/i );
      },

      BlackBerry: function() {
        return navigator.userAgent.match( /BlackBerry/i );
      },

      iOS: function() {
        return navigator.userAgent.match( /iPhone|iPad|iPod/i );
      },

      Opera: function() {
        return navigator.userAgent.match( /Opera Mini/i );
      },

      Windows: function() {
        return ( navigator.userAgent.match( /IEMobile/i ) ||
                 navigator.userAgent.match( /Windows Phone/i ) );
      },

      Any: function( arg ) {
        arg = typeof arg !== 'undefined' ? arg : 'device';

        if ( App.Utils.isMobile.BlackBerry() ||
             App.Utils.isMobile.Opera() ||
             App.Utils.isMobile.Windows() ||
             App.Utils.isMobile.Android() ||
             App.Utils.isMobile.iOS() ) {

          return ( App.Utils.isMobile.BlackBerry() ||
                   App.Utils.isMobile.Opera() ||
                   App.Utils.isMobile.Windows() ||
                   App.Utils.isMobile.Android() ||
                   App.Utils.isMobile.iOS() );

        } else {
          if( arg === 'device' ) {
            return false;
          } else {
            return 'desktop';
          }
        }

      },

      Phone: function( arg ) {
        arg = typeof arg !== 'undefined' ? arg : 'device';
        var mediaquery = window.matchMedia(
            '(max-width: ' +
            ( App.Utils.isMobile._configuration.tablet_device_width - 1 ) +
            'px)' ).matches;

        return ( App.Utils.isMobile.Any( arg ) && mediaquery );
      },

      Tablet: function( arg ) {
        arg = typeof arg !== 'undefined' ? arg : 'device';
        var mediaquery = window.matchMedia(
            '(min-width: ' +
            ( App.Utils.isMobile._configuration.tablet_device_width ) +
            'px) and (max-width: ' +
            ( App.Utils.isMobile._configuration.document_width - 1 ) +
            'px)' ).matches;

        return ( App.Utils.isMobile.Any( arg ) && mediaquery );
      }
    },

    /**
     * isDesktop Function
     */
    isDesktop: function() {
      return ( !App.Utils.isMobile.Any() );
    },

    /**
    * Orientation Function
    */
    Orientation: function( arg ) {
      arg = typeof arg !== 'undefined' ? arg : 'device';
      var mediaquery = window.matchMedia( '(orientation: portrait)' ).matches;

      if( App.Utils.isMobile.Any( arg ) ) {
        if ( mediaquery ) {
          return 'portrait';
        } else {
          return 'landscape';
        }
      } else {
        return false;
      }
    },

    /**
     * Responsive body classes
     */
    AddResponsiveBodyClasses: function() {
      var device      = ( App.Utils.isDesktop()?'desktop':'mobile' );
      var responsive  = ( ( App.Utils.isMobile.Phone( 'desktop' ) )?
                          'mobile-phone':( App.Utils.isMobile.Tablet( 'desktop' ) )?
                          'mobile-tablet':'desktop');

      $( 'body' )
        .removeClass( 'orientation-portrait' )
        .removeClass( 'orientation-landscape' )
        .removeClass( 'device-desktop' )
        .removeClass( 'device-mobile' )
        .removeClass( 'responsive-desktop' )
        .removeClass( 'responsive-mobile-tablet' )
        .removeClass( 'responsive-mobile-phone' );

      $( 'body' )
        .addClass( 'orientation-' + App.Utils.Orientation( 'desktop' ) )
        .addClass( 'device-' + device)
        .addClass( 'responsive-' + responsive);
    },

    /**
    * Slugify Function
    */
    Slugify: function( arg ) {
      return arg
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .replace(/[àáâãäåąæā]/g,"a")
        .replace(/[èéêēëėę]/g,"e")
        .replace(/[íïìîįī]/g,"i")
        .replace(/[óºòöôõøœō]/g,"o")
        .replace(/[úüùûū]/g,"u")
        .replace(/[ç,ć,č]/g,"c")
        .replace(/[^\w\-]+/g, "");
    },

    /**
    * ScrollAnimate
    */
    scrollAnimate: function( target, offset ) {
      offset = typeof offset !== 'undefined' ? offset : 0;

      if( $(target).length > 0 ) {
        setTimeout(function(){
          $('html, body').animate({
            scrollTop: ($(target).offset().top + offset)
          }, 500);
        }, 400);
      }
    },

    /**
    * getRandomColor
    */
    getRandomColor: function() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  };
