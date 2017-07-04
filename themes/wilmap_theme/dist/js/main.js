/*
  Main theme app script
*/
(function ($, Drupal) {

  'use strict';

  // Declare App Objetc
  var App = {};


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
    }
  };


  /**
   * Useful functions for hack default drupal markup/behaviours
   *
   * @example
   * App.DrupalHack.run();
   */
  App.DrupalHack = {

    /**
     * Methods for this module
     */
    methods: {

      /**
       * Contributor detail Page
       */
      contributorDetailPage: function() {
        var runON = 'body.path-user';

        if ($(runON).length > 0) {

          // Add contact modal
          var contactBlock = '#block-contactblock';
          var socialBlock = '.social-media-links--platforms';
          if ($(contactBlock).length > 0 && $(socialBlock).length > 0) {
            var li_mail = '';
            li_mail += '<li>';
            li_mail += '<a href="#" class="switch" gumby-trigger="'+contactBlock+'">';
            li_mail += '<span class="fa fa-email fa-2x"></span>';
            li_mail += '</a>';
            li_mail += '<br>';
            li_mail += '<span><a href="#"></a></span>';
            li_mail += '</li>';

            if (!$('fa-email').length > 0) {
              $(socialBlock).append(li_mail);
            }
          }

          
        }
      },

      /**
       * Entry detail Page
       */
      entryDetailPage: function() {
        var runON = 'body.page-node-type-entry';

        if ($(runON).length > 0) {
          var toplinks = '.entry-top-links';

          if ($(toplinks).length > 0) {
            // Link Go To Country Page
            $('a.gotocountry').attr('href', $(toplinks + '-hidden .field--name-field-location-entry a').attr('href'));

            // Set location and tax-section on title block
            $(toplinks).append($(toplinks + '-hidden').remove().html());
          }
        }
      },

      /**
       * Entry detail Page
       */
      mainNavigationTrail: function() {
        var runON = '#block-mainnavigation';

        if ($(runON).length > 0) {
          var segments = location.pathname.split('/');

          $(runON + ' ul.menu li.menu-item').each(function(i, item) {
            if($(item).find('a').attr('href') === '/' + segments[1]) {
              $(item).find('a').addClass('is-active');
              $(item).addClass('menu-item--active-trail');
            }
          });
        }
      },

      /**
       * Adds lastchild class to all last elements
       */
      // allLastChild: function() {
      //
      //   $( ':last-child' ).not( 'pre :last-child' ).addClass( 'lastchild dph' );
      //
      // },

      /**
       * Shortcodes in wysiwyg texts
       */
      allWysiwygShortcodes: function() {

        $('.text-formatted').each(function(i,a){

          var textOut = $(this).html();

          // Youtube
          textOut = textOut
                        .replace( /\[youtube\](.*?)\[\/youtube\]/ig, function( a ) {
                          var video = a
                                      .replace( /\[youtube\]/ig, '' )
                                      .replace( /\[\/youtube\]/ig, '' )
                                      .split( '=' )[1];

                          return '<div class="row dph"><div class="centered eight columns dph"><div class="video"><iframe width="640" height="360" src="https://www.youtube.com/embed/' + video + '" frameborder="0" allowfullscreen></iframe></div></div></div>';
                        });

          // Iframe
          textOut = textOut
                        .replace( /\[iframe\](.*?)\[\/iframe\]/ig, function( a ) {
                          var iframe = a
                                      .replace( /\[iframe\]/ig, '' )
                                      .replace( /\[\/iframe\]/ig, '' );

                          return '<div class="row dph"><div class="centered eight columns dph"><div class="video"><iframe width="640" height="360" src="' + iframe + '" frameborder="0" allowfullscreen></iframe></div></div></div>';
                        });

          // Image
          textOut = textOut
                        .replace( /\[img\](.*?)\[\/img\]/ig, function( a ) {
                          var image = a
                                      .replace( /\[img\]/ig, '' )
                                      .replace( /\[\/img\]/ig, '' );

                          return '<div class="row dph"><div class="row dph"><div class="centered eight columns dph"><img src="' + image + '" /></div></div></div>';
                        });

          // Google Maps
          textOut = textOut
                        .replace( /\[gmap(.*?)\[\/gmap\]/ig, function( a ) {

                          // If Attributes
                          var attrs = a.substring(a.indexOf('[gmap') + 5, a.indexOf(']'));
                          var textReplace = a;
                          var address = textReplace;

                          if (attrs) {
                            address = address.replace(attrs, '');
                            attrs = attrs.trim();
                            attrs = '{"' + attrs.replace(/\="/ig, '":"').replace(/\" /ig, '","').replace(/\¬/ig, '"').replace(/\&lt;/ig, '<').replace(/\&gt;/ig, '>') + '}';

                            var Attributes = JSON.parse(attrs);
                          }

                          address = address
                                      .replace( /\[gmap\]/ig, '' )
                                      .replace( /\[\/gmap\]/ig, '' );

                          // console.log(address);

                          var latlan = false;
                          var idrand = 'map' + Math.floor((Math.random() * 1000) + 1);
                          var geocoder = new google.maps.Geocoder;
                          geocoder.geocode({'address': address}, function(results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                              if (results[0]) {
                                new Maplace({
                                    map_div: '#'+idrand,
                                    locations: [
                                      {
                                        lat: results[0].geometry.location.lat(),
                                        lon: results[0].geometry.location.lng(),
                                        icon: drupalSettings.path.pathToTheme + '/img/marker.svg',
                                        html: (Attributes !== undefined) ? Attributes.info : '',
                                      },
                                    ],
                                    styles: {
                                        'snazzymaps': [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
                                    },
                                    map_options: {
                                       mapTypeId:google.maps.MapTypeId.ROADMAP,
                                       mapTypeControl: false,
                                       scrollwheel: false,
                                       zoomControl: true,
                                       zoom: 16
                                    },
                                }).Load();
                              } else {
                                $('#'+idran).text('Google Maps: No se ha encontrado la dirección.');
                              }
                            } else {
                              $('#'+idran).text('Geocoder failed due to: ' + status);
                            }
                          });

                         return '<div id="'+idrand+'" class="gmap dph"></div>';
                        });

          // // Box width atributes - TMP
          // textOut = textOut
          //               .replace( /\[box(.*?)\]/ig, function( a ) {
          //                 var attributes = a
          //                                  .replace( /\[box /ig, '' )
          //                                  .replace( /\]/ig, '' );
          //
          //                 return '<div class="six columns dph" ' + attributes + '></div>';
          // });


          // Grid Rows
          textOut = textOut
                        .replace( /\[row\]/ig, '<div class="row dph">' )
                        .replace( /\[\/row\]/ig, '</div>' );


          // Grid Columns
          textOut = textOut
                        .replace( /\[((?!\/))(\S*?)_columns\]/ig, function( a ){
                          var classTag = a
                                      .replace( /\[/g, '' )
                                      .replace( /\]/g, '' )
                                      .replace( /\_/g, ' ' );

                          return '<div class="' + classTag + ' dph">';
                        })
                        .replace( /\[((?=\/))(.*?)_columns\]/ig, '</div>');


          // Return text
          $(this).html(textOut);
        });

      },

    },


    /**
     * Public function for run method
     */
     run: function() {

      if ( !$( 'body' ).hasClass( 'theme-started' ) ) {
        // Execute all functions
        var m = this.methods;
        for ( var key in this.methods ) {
         //console.log(key);
         m[key]();
        }

      }

      // log
      console.log( 'App.DrupalHack Running' );

     }

  };


  /**
   * Initialize Gumby Library and some Gumby UI's
   *
   * @example
   * App.Gumbify.run();
   */
  App.Gumbyfy = {

    /**
     * Methods for this module
     */
    methods: {

      /**
       * Initialize Forms with Gumby UI.
       * Checks body class 'theme-started' for only run once.
       */
      formsUI: function() {

        // Inputs
        $( 'input[type="search"], input[type="text"], input[type="email"], input[type="number"], input[type="password"], input[type="date"], input[type="url"], input[type="tel"]' )
          .addClass( 'input text' )
          .parent().addClass( 'field' );

        // Textareas
        $( 'textarea' )
          .addClass( 'input textarea' )
          .parent().addClass( 'field' );

        // Checkboxes
        $( '.checkbox span' ).remove(); // Remove previous Gumby Checkboxes

        $( 'input[type="checkbox"]' ).each(function(){
          $( this ).appendTo( $( this ).next() ); // Move input into label
        });

        // Add class field to parent
        $( 'input[type="checkbox"]' ).parent().parent().addClass('field');

        // Add class checkbox and insert span element
        $( 'input[type="checkbox"]' ).parent().addClass('checkbox').prepend( '<span></span>' );

        // Show check mark if checked
        $( 'input[type="checkbox"]:checked' ).parent().addClass('checked');
        $( 'input[type="checkbox"]:checked' ).parent().find('span').append('<i class="icon-dot" />');


        // Radiobuttons
        $( '.radio span' ).remove(); // Remove previous Gumby Radiobuttons

        $( 'input[type="radio"]' ).each(function(){
          $( this ).appendTo( $( this ).next() ); // Move input into label
        });

        // Add class field to parent
        $( 'input[type="radio"]' ).parent().parent().addClass('field');

          // Add class radio and insert span element
        $( 'input[type="radio"]' ).parent().addClass('radio').prepend( '<span></span>' );

        // Show check mark if checked
        $( 'input[type="checkbox"]:checked' ).parent().addClass('checked');
        $( 'input[type="checkbox"]:checked' ).parent().find('span').append('<i class="icon-dot" />');


        // links in labels
        $( 'label a').on('click', function(){
          window.open($(this).attr('href'),"_blank");
        });

        // Selects
        $( 'select' )
          .removeClass( 'picker' )
          .wrap( '<div class="picker"></div>' )
          .parent().parent().addClass( 'field' );

        $( '.picker.field' ).removeClass( 'picker' ); //Clean Previous Pickers Selects

        // Submits
       $( 'input[type="submit"]' )
          .removeClass( 'button' )
          .wrap( '<div class="site-btn"></div>' );

        // a.btn & button.btn class
       $( 'a.btn, button.btn' )
          .removeClass( 'btn' )
          .wrap( '<div class="site-btn"></div>' );

      },

      /**
       * Initialize animation in anchor links.
       */
      animatedAnchors: function() {

        $( "a" ).each(function (e, i) {
            var t = '';
            var href = $( this ).attr( 'href' );

            if ( href !== undefined && href.length > 1 &&
                 href.charAt(0) == '#' &&
                 !$( this ).hasClass( 'skip' ) ) {

                    $( this ).addClass( 'skip' )
                      .attr('gumby-update', '')
                      .attr('gumby-duration', 600)
                      .attr('gumby-goto', href);

            }
        });

      },

      /**
       * Stops video when gumby modals close.
       */
      resetVideoModals: function() {

        $( ".modal.modal-video a.close.switch" ).on( "click", function () {
            var src = $(this).parent().find('iframe').attr('src');

            // recharging the video it causes to stop
            $(this).parent().find('iframe').attr('src', src);
        });

      },

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

      // Gumby Events

      // Gumby Init
      Gumby.init();
      Gumby.debugMode = true;
      //Gumby.log('Gumby is ready to go...', Gumby.dump());

      // log
      console.log( 'App.Gumbyfy Running' );

    }

  };


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
       * Big Links Areas. List and grid items.
       */
      bigLinkAreas: function() {
        var linkareas = [
          {
            bigitem: '.block-views-blocktopics-block-1 .views-row .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.block-views-blocklist-entries-block-1 .views-row .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.block-views-blockentries-block-1 .views-row .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.field--name-field-related-entries .field__item .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.block-views-blocknews-block-1 .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.block-views-blockcontributors-block-1 .view-content .views-row',
            ref: '.contributor-info-holder .views-field-name a'
          },
        ];

        $.each(linkareas, function (index, value) {
          if ($(value.bigitem).length > 0) {
            $(value.bigitem).on('click', function (e) {
              window.location.href = $(this).find(value.ref).attr('href');
            });
          }
        });
      },

      /**
       * External links open in blank target
       */
      externalLinks: function() {

        $('a[href^="http://"], a[href^="https://"]').each(function(i, item) {
            $(this).attr('target','_blank');
        });

      },

      /**
       * sticky items
       */
      // stickyItems: function() {
      //
      //   var elementsSticky = [
      //     {
      //       element: 'body.node-type-landing .group-intro-wrap',
      //       off: '#footer',
      //       offset: '0',
      //       onFixed: function(e){
      //         $('.group-header-wrap').css('margin-bottom', $('.group-intro-wrap').data( 'height' ) / 2);
      //       },
      //       onUnfixed: function(e){
      //         $('.group-header-wrap').css('margin-bottom', 0);
      //       },
      //       mobile: false
      //     },
      //     {
      //       element: 'body.node-type-landing .group-form-aside-fix',
      //       off: '.webform-component--forma-de-pago',
      //       offset: '150',
      //       onFixed: '',
      //       onUnfixed: '',
      //       mobile: false
      //     }
      //   ];
      //
      //   var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));
      //
      //   $.each( elementsSticky, function( index, value ) {
      //     var canFix = true;
      //
      //     if( isPhone && !value.mobile ) {
      //       canFix = false;
      //     }
      //
      //     if( canFix ) {
      //       if ( $( value.element ).length > 0 && $( 'body.user-logged-in' ).length === 0 ) {
      //         $( value.element ).attr( 'gumby-fixed', 'top' ).attr( 'gumby-pin', value.off ).attr( 'gumby-offset', value.offset ).data( 'height',  $( value.element ).height());
      //       }
      //
      //       if ( value.onFixed !== '' ) {
      //         $( value.element ).on('gumby.onFixed', function(e) {
      //           value.onFixed(e);
      //         });
      //       }
      //
      //       if ( value.onUnfixed !== '' ) {
      //         $( value.element ).on('gumby.onUnfixed', function(e) {
      //           value.onUnfixed(e);
      //         });
      //       }
      //     }
      //   });
      //
      // },

      /**
       * Main search
       */
      mainSearch: function() {
        var dom = '.search-block-form';
        var bgseparator = '.fake-modal';

        if ($(dom).length > 0) {
          // Hide submit
          $(dom + ' .form-actions').hide();

          // Generate bg separator
          $('body').append('<div class="fake-modal"></div>');

          // Events
          $(dom + ' input[type="search"]').attr('placeholder', 'Search').bind("keypress", function (e) {
            // prevent submit on press enter key
            if (e.keyCode == 13) {
              return false;
            }
          });

          $(dom + ' input[type="search"]').on('focus', function() {
            $(dom).addClass('active');
            $(bgseparator).addClass('active');
          });

          $(dom + ' input[type="search"]').on('blur', function() {
            $(dom).removeClass('active');
            $(bgseparator).removeClass('active');
          });
        }
      },

      /**
       * Sharethis
       */
      shareThis: function() {
        var dom = 'a[data-action="share"]';
        var output = '';
        var url_to_share = escape(window.location.href);
        var title_to_share = document.title;

        console.log(escape(window.location.href));
        console.log(title_to_share);

        if ($(dom).length > 0) {
          output += '<div class="modal" id="modal-share">';
          output += '  <div class="content">';
          output += '    <a class="close switch" gumby-trigger="|#modal-share">CLOSE</a>';
          output += '      <h3>Sharing</h3>';
          output += '      <div class="content-inner">';
          output += '         <section class="tabs">';
          output += '           <ul class="tab-nav">';
          output += '             <li class="active"><a href="#">Share Page</a></li>';
          output += '             <!-- <li><a href="#">Embed map</a></li> -->';
          output += '           </ul>';
          output += '           <div class="tab-content active">';
          //output += '               <script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.9";fjs.parentNode.insertBefore(js, fjs);}(document, \'script\', \'facebook-jssdk\'));</script>';
          //output += '               <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script>';
          output += '             <a class="btn sharebutton fb" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u='+url_to_share+'">Share on facebook</a>';
          output += '             <a class="btn sharebutton twitter" target="_blank" href="https://twitter.com/share?url='+url_to_share+'">Share on twitter</a>';
          output += '           </div>';
          output += '           <div class="tab-content">';
          output += '             <p>Comparte mapa</p>';
          output += '           </div>';
          output += '         </section>';
          output += '      </div>';
          output += '  </div>';
          output += '</div>';

          // Write modal in body
          $('body').append(output);

          // Action in open modal button
          $(dom).addClass('switch').attr('gumby-trigger','#modal-share');

          // Actions in share button
          $('a.sharebutton').on('click', function(e){
            var w = 360;
            var h = 500;
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/2);

            window.open($(this).attr('href'), "wnd", "status = 1, height = " + h + ", width = " + w + ", top = " + top + ", left = " + left + ", resizable = 0");
            e.preventDefault();
          });
        }
      },

      /**
       * headerActive
       */
      headerActive: function() {
        var dom = '.site-header';

        if ($(dom).length > 0) {
          $(dom + ' a.toggle').on(Gumby.click, function(e) {
            if($(dom).hasClass('active')){
              $(dom).removeClass('active');
              $(dom + ' span.str').text('Menu');
            } else {
              $(dom).addClass('active');
              $(dom + ' span.str').text('Close');
            }
          });
        }
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
       * Topics side navigation
       */
      topicsNavigation: function() {
        var dom = '.page-node-type-topics';
        var dom_content = dom + ' .block-system-main-block .content';
        var dom_sidemenu = dom_content + ' .sidemenu .view-content';
        var dom_entries = dom + ' .block-views-blockentries-block-1';
        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

        if ($(dom).length > 0) {

          // Menu holder
          $(dom_content).prepend('<div class="sidemenu"><div class="view-content"></div></div>');

          // Generate anchors and side menu
          var count = 0;
          $(dom_entries + ' h3').each(function(i, item) {
            var offset = (isPhone)?'-10':'-140';
            $(this).addClass('country-block-title').attr('id','countr-block-' + count);
            $(dom_sidemenu).append('<div class="views-row"><a class="skip" gumby-offset="' + offset + '" gumby-duration="600" gumby-goto="#countr-block-' + count + '" href="#countr-block-' + count + '">' + $(this).text() + '</a></div>')
            count++;
          });

          // Mobile side navigation
          if(isPhone) {
            $(dom_sidemenu).slick({
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
            // var active = parseInt($(dom + ' .views-row a.__active').parents('.slick-slide').attr('data-slick-index'));
            // $(dom + ' .view-content').slick('slickGoTo', active);
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



  /**
   * Attach the App code to Drupal.
   *
   */
  Drupal.behaviors.cuentametoledo_theme = {
    attach: function ( context, settings ) {

      // Rock & Roll
      App.DrupalHack.run();

      App.Gumbyfy.run();
      App.Application.run();


      // Flag to avoid DOM modification more than one time
      $( 'body' ).addClass( 'theme-started' );

    }
  };

})(jQuery, Drupal);


// @codekit-prepend 'partials/_main.base.wrapper-first.js'
// @codekit-prepend 'partials/_main.base.utils.js'

// @codekit-prepend 'partials/_main.module.drupal-hack.js'

// @codekit-prepend 'partials/_main.base.gumbyfy.js'
// @codekit-prepend 'partials/_main.base.application.js'
// @codekit-prepend 'partials/_main.base.wrapper-last.js'


