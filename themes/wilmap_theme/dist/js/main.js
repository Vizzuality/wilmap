/*
  Main theme app script
*/
(function ($, Drupal) {

  'use strict';

  // Declare App Objetc
  window.App = {};


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
    * isIframe
    */
    isIframe: function() {
      try {
        return window.self !== window.top;
      } catch (e) {
          return true;
      }
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
    },

    /**
    * shadeColor
    * shadeColor("#63C6FF",40); //lighten
    * shadeColor("#63C6FF",-40); //darken
    */
    shadeColor: function(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    },

    /**
    * setBrowserURL
    */
    setBrowserURL: function(href, title) {
      window.history.pushState(href, title, href);
    },

    /**
    * getUrlVars
    */
    getUrlVars: function(){
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },

    getUrlVar: function(name){
      return App.Utils.getUrlVars()[name];
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
       * Contributor/s Field profiles
       */
      contributorFieldProfile: function() {
        var runON = '.field--name-field-contributors';

        if ($(runON).length > 0) {
          var text_output   = '';
          var thumb_output  = '';
          var num_contrib   = $(runON + '> .field__item');
          var date_on_page  = $('body .node-date');
          var class_ttip = (num_contrib.length > 1)?' ttip':'';
          var class_single = (num_contrib.length > 1)?'':' single';

          // Num authors
          if ( num_contrib.length > 1) {
            text_output = '<div class="authors">' + num_contrib.length + ' Authors</div>';
          } else {
            text_output = '<div class="authors">' + $(runON + ' .field__item .field--name-field-first-name').text() + ' ' + $(runON + ' .field__item .field--name-field-last-name').text() + '</div>';
          }

          // Date
          if (date_on_page.length > 0) {
            text_output = text_output + date_on_page.wrap().html();
            date_on_page.remove();
          }

          // Thumbnails
          num_contrib.each(function(item, value){
            thumb_output += '<div class="profile' + class_ttip + '" data-tooltip="' + $(value).find('.field--name-field-first-name').text() + ' ' + $(value).find('.field--name-field-last-name').text() + '">';
            thumb_output += '  <a href="' + $(value).find('article').attr('about') + '">';
            thumb_output += '   <div class="profile-picture"><img src="' + $(value).find('img').attr('src') + '" width="100" height="100" typeof="foaf:Image" class="image-style-thumbnail"></div>';
            thumb_output += '  </a>';
            thumb_output += '</div>';

          });

          if(!$(runON + '.dph').lenght > 0) {
            $(runON).empty().addClass('dph');
            $(runON).append('<div class="thumbnails' + class_single + '">' + thumb_output + '</div><div class="info">' + text_output + '</div>');
          }
        }
      },

      /**
       * Contributor Filter List
       */
      contributorFilterList: function() {
        var runON = '.view-id-contributors .view-filters';

        if ($(runON).length > 0) {
          if (!$(runON + ' .tit').length > 0) {
            $(runON).prepend('<fieldset class="tit"><legend>Filter by:</legend></fieldset>');
          }

          // Selects
          $(runON + ' .js-form-type-select').each(function(item, value){
            var label = $(this).find('label').text();

            $(this).find('select option:first').text(label);
          });

          // Name
          var label_name = $(runON + ' .js-form-item-name label').text();
          $(runON + ' .js-form-item-name input').attr('placeholder', label_name);

          // DOM processed
          $(runON).addClass('__processed');
        }
      },

      /**
       * Entries Filter List
       */
      entriesFilterList: function() {
        var runON = '.view-list-entries .view-filters';

        this.updateAdvancedFilters = function() {
          var advancedDOM = runON + ' .views-exposed-form .form--advanced';
          var advancedContentDOM = advancedDOM + ' .content';
          var cont = 0;

          $(advancedContentDOM).empty();
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input').each(function(item, value) {
            var v_text = "";
            var v_id = "";
            var template_button = '<div class="advanced-tag btn">[v_text] <a href="#" class="delete">X</a></div>';

            switch ($(value).attr('type')) {
              case 'text':
                if($(value).val() !== '') {
                  v_text = $(value).parent().find('label').text() + ': ' + $(value).val();

                  $(advancedContentDOM).append(template_button.replace(/\[v_text\]/g, v_text));
                  cont++;
                }

                break;
              case 'checkbox':
                if($(value).is(':checked')) {
                  v_text = $(value).parents('label').text();

                  $(advancedContentDOM).append(template_button.replace(/\[v_text\]/g, v_text));
                  cont++;
                }

                break;
              default:
                break;
            }
          });

          // Events
          $(advancedContentDOM + ' .advanced-tag a.delete').on('click', function(e){
            e.preventDefault();
            $(this).parent().remove();

            if($(advancedContentDOM + ' .advanced-tag').length === 0) {
              $(advancedDOM).hide();
            }

            //
            //App.DrupalHack.methods.updateAdvancedFilters();
          });

          if(cont) {
            $(advancedDOM).show();
          } else {
            $(advancedDOM).hide();
          }
        };

        if ($(runON).length > 0) {
          if(!$(runON + ' .form--modal').length > 0) {
            $(runON + ' .views-exposed-form').append('<div id="modal-advanced-filter" class="form--modal modal"><div class="content"><a class="close switch" gumby-trigger="|#modal-advanced-filter">CLOSE</a><h3>Advanced - Search</h3><div class="content-inner"><div class="date-selectors"></div></div><div class="modal-actions"><a href="#" class="btn modal-done">APPLY</a></div></div></div>');
            $(runON + ' .views-exposed-form').append('<div class="form--advanced" style="display: none;"><fieldset><legend>Advanced filters:</legend></fieldset><div class="content"></div></div>');


            $(runON + ' .views-exposed-form .form--modal .content-inner').append($(runON + ' .form--inline > .js-form-item').remove().wrap());
            $(runON + ' .views-exposed-form .form--modal .content-inner').append($(runON + ' .form--inline > details.form-item').remove().wrap());
            $(runON + ' .views-exposed-form .form--modal .content-inner .date-selectors').append($(runON + ' .views-exposed-form .js-form-item-fromyear').remove().wrap());
            $(runON + ' .views-exposed-form .form--modal .content-inner .date-selectors').append($(runON + ' .views-exposed-form .js-form-item-toyear').remove().wrap());

            $(runON + ' .views-exposed-form .form--modal .content-inner details.form-item').each(function (item, value) {
              var summary_text = $(value).find('summary').text();
              $(value).find('summary').text('NONE SELECTED');
              $('<label>' + summary_text + '</label>').insertBefore(value);
            });
          }

          if(!$(runON + ' .form--inline .form--filter').length > 0) {
            $(runON + ' .views-exposed-form .form--inline').append('<div class="form--filter"><fieldset class="tit"><legend>Filter by:</legend></fieldset></div>');
            $(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-claim').remove().wrap());
            $(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-document').remove().wrap());
            $(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-country').remove().wrap());
            $(runON + ' .views-exposed-form .form--inline .form--filter').append('<a href="#" class="switch btn" gumby-trigger="#modal-advanced-filter">Advanced</a></p>');

            // Selects
            $(runON + '  .views-exposed-form .form--inline .form--filter .js-form-type-select').each(function(item, value){
              var label = $(this).find('label').text();

              $(this).find('select option:first').text(label);
            });
          }

          if(!$(runON + ' .form--inline .form--sort').length > 0) {
            $(runON + ' .views-exposed-form .form--inline').append('<div class="form--sort"></div>');
            $(runON + ' .views-exposed-form .form--inline .form--sort').append($(runON + ' .views-exposed-form .js-form-item-sort-by').remove().wrap());
          }

          if(!$(runON + ' .form--bottom').length > 0) {
            $(runON + ' .views-exposed-form').append('<div class="form--bottom"></div>');
            $(runON + ' .views-exposed-form .form--bottom').append($(runON + ' .views-exposed-form .js-form-item-title').remove().wrap());
            $(runON + ' .views-exposed-form .form--bottom').append($(runON + ' .views-exposed-form .form-actions').remove().wrap());
          }

          // DOM processed
          $(runON).addClass('__processed');

          // Events
          // checkboxes
          $(runON + ' .views-exposed-form .form--modal .content-inner details .form-type-checkbox').on('click', function(){
            var txt = '';
            var output = '';

            $(this).parents('.details-wrapper').find('.form-type-checkbox input:checked').each(function(i, value) {

              var comma = (txt == '') ? '':' - ';
              txt +=  comma + $(value).parent().text();
            });


            output = (txt == '')?'NONE SELECTED':txt;
            $(this).parents('details.form-item').find('summary').text(output);

            //
            App.DrupalHack.methods.updateAdvancedFilters();
          });

          // Inputs
          $(runON + ' .views-exposed-form .form--modal input.form-text').on('blur', function(t){
            //
            App.DrupalHack.methods.updateAdvancedFilters();
          });


          // done button
          $(runON + ' .views-exposed-form .form--modal a.modal-done').on('click', function(e){
            e.preventDefault();

            App.DrupalHack.methods.updateAdvancedFilters();
            $(runON + ' .views-exposed-form .form--modal a.close').click();
            $(runON + ' .views-exposed-form input.form-submit').click();
          })

        }
      },

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

            if (!$('.fa-email').length > 0) {
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
          var toplinks = '.node-top';

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

      //if ( !$( 'body' ).hasClass( 'theme-started' ) ) {
        // Execute all functions
        var m = this.methods;
        for ( var key in this.methods ) {
         //console.log(key);
         m[key]();
        }

      //}

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
       * Main search
       */
      mainSearch: function() {
        var dom = '.site-header .search-block-form';
        var bgseparator = '.fake-modal';
        var dom_autocomplete = 'ul.ui-autocomplete.ui-widget.ui-widget-content';

        if ($(dom).length > 0) {

          // Hide submit
          $(dom + ' .form-actions').hide();

          // Generate bg separator
          if (!$('.fake-modal').length > 0) {
            $('body').append('<div class="fake-modal"></div>');
          }

          // DOM processed
          $(dom).addClass('__processed');

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
            $(dom_autocomplete).removeClass('__kill');
          });

          $(dom + ' input[type="search"]').on('blur', function() {
            $(dom).removeClass('active');
            $(bgseparator).removeClass('active');
          });
        }
      },

      /**
      * page search
      */
      pageSearch: function() {
        var dom = '.content-content .search-page-form';
        var dom_autocomplete = 'ul.ui-autocomplete.ui-widget.ui-widget-content';

        if ($(dom).length > 0) {

          $(dom).parent().find('h2').addClass('title-result');

          $(dom + ' input[type="search"]').on('focus', function() {
            $(dom_autocomplete).addClass('__kill');
          });

          // DOM processed
          $(dom).addClass('__processed');
        }

      },

      /**
       * Map
       */
      Map: function() {
        // Init
        App.Application.Maps = {};
        App.Application.Maps.Config = {};
        App.Application.Maps.Functions = {};
        App.Application.Maps.Data = {};
        App.Application.Maps.ContinentData = {};
        App.Application.Maps.Config.wilmap                      = null;
        App.Application.Maps.Config.popup                       = null;
        App.Application.Maps.Config.basemapcontinents           = null;
        App.Application.Maps.Config.basemapcountries            = null;
        App.Application.Maps.Config.basemapcolor                = null;
        App.Application.Maps.Config.linecontinentmap            = null;
        App.Application.Maps.Config.interactivemap              = null;
        App.Application.Maps.Config.positron_labels             = null;
        App.Application.Maps.Config.curr_continent_active       = null;
        App.Application.Maps.Config.curr_country_active         = null;
        App.Application.Maps.Config.curr_layer_active           = null;
        App.Application.Maps.Config.color_active                = '#b3001e';
        App.Application.Maps.Config.color_border                = '#f7f6f2';
        App.Application.Maps.Config.color_inactive              = '#e4dfd3';
        App.Application.Maps.Config.bounds                      = new L.LatLngBounds(new L.LatLng(83.6567687988283, 180.00000000000034), new L.LatLng(-90, -179.99999999999994));
        App.Application.Maps.Config.initial_view                = [51.505, -0.09];
        App.Application.Maps.Config.is_embed                    = (window.location.href.indexOf('/widgets/map' || App.Utils.isIframe()) > -1)
        App.Application.Maps.Config.color_styles                = {'style1':'#035e7e','style2':'#325735','style3':'#484d0c','style4':'#554324','style5':'#5b1717','style6':'#31244a'}
        // App.Application.Maps.Config.color_styles                = {'blue':'#035e7e','green':'#325735','olive':'#484d0c','bronze':'#554324','maroon':'#5b1717','purple':'#31244a'}
        App.Application.Maps.Config.click_on_map                = false;

        App.Application.Maps.Functions.choropleth = function(color, currVal, minVal, maxVal, steps) {
          var steps = typeof steps !== 'undefined' ? steps : 5;

          // calculates the percent of value
          var percentValue = Math.floor((currVal - minVal) / (maxVal - minVal) * 100);

          // calculates the percent of color steps
          var incrementStep = 100/steps;
          var percentColor = incrementStep;

          while (percentColor < 100) {
              if(percentValue >= percentColor - incrementStep && percentValue < percentColor) {
                break;
              }

              percentColor = percentColor+incrementStep;
          }

          //sets lighten
          console.log("cl: " + percentValue + ' | ' + percentColor);
          return App.Utils.shadeColor(color, percentColor)
        };

        App.Application.Maps.Functions.centerMap = function(coord) {
          var is_coord = typeof coord === 'string' ? false : true

          if ( is_coord ) {
            App.Application.Maps.Config.wilmap.fitBounds(coord);
          } else {
            var continent = App.Application.Maps.ContinentData[coord];
            App.Application.Maps.Config.wilmap.setView([continent.centroid[1],continent.centroid[0]], continent.zoom, {animation: true});
          }
        };

        App.Application.Maps.Functions.resetActiveMap = function() {
          App.Application.Maps.Functions.activeContinent('none');
          App.Application.Maps.Functions.activeCountry('none');
          App.Application.Maps.Config.wilmap.closePopup(App.Application.Maps.Config.popup);
        };

        App.Application.Maps.Functions.generateLayerModal = function() {
          var DOM = 'modal-maplayer';
          var API = '/api/layers';
          var output_layers = '';
          var output = '';
          var layer_in_url = (window.location.href.indexOf('layerid=') > -1) ? App.Utils.getUrlVar('layerid') : false;

          // get Layers
          $.getJSON( API, function( data ) {
            console.log("LAYERS::::::::::::::");
            console.log(data);

            output_layers += '<ul>';
            $.each( data, function( key, val ) {
              var checked = (layer_in_url && layer_in_url == val.nid[0].value)? ' checked':'';

              output_layers += '<li class="layer-item field">';
              output_layers += '<label class="checkbox" for="layer-item-'+key+'" data-layerid="'+val.nid[0].value+'" data-layer-style="'+val.field_style[0].value+'" data-layer-title="'+val.title[0].value+'" data-layer-desc="'+val.body[0].value+'"><input type="checkbox" id="layer-item-'+key+'" name="layer-item[]" value="'+val.nid[0].value+'"' + checked + '><span></span> '+val.title[0].value+'</label>';
              output_layers += '</li>';
            });
            output_layers += '</ul>';

            if ( !$('#' + DOM).length > 0 ) {
              output += '<div class="modal" id="'+DOM+'">';
              output += '  <div class="content">';
              output += '    <a class="close switch" gumby-trigger="|#modal-maplayer">CLOSE</a>';
              output += '      <h3>Layers</h3>';
              output += '      <div class="content-inner">';
              output += '         <section>';
              output += output_layers;
              output += '         </section>';
              output += '         <div class="modal-actions"><a href="#" class="btn modal-done">APPLY</a></div>';
              output += '      </div>';
              output += '  </div>';
              output += '</div>';

              // Write modal in body
              $('body').append(output);
              $(dom + ' .actions').append('<a class="btn switch" href="#" gumby-trigger="#modal-maplayer">Layers</a>');

              // Events
              //App.Gumbyfy.methods.formsUI();
              $('#' + DOM + ' label.checkbox').on('click', function(e) {
                e.preventDefault();

                if ( !$(this).hasClass('checked') ) {
                  $('#' + DOM + ' label.checkbox.checked i.icon-check').remove();
                  $('#' + DOM + ' label.checkbox.checked input').prop('checked', false); ;
                  $('#' + DOM + ' label.checkbox.checked').removeClass('checked');
                }
              });

              // done button
              $('#' + DOM + ' .modal-actions a.modal-done').on('click', function(e) {
                e.preventDefault();
                var layer = ($('#' + DOM + ' label.checkbox.checked').length > 0) ? $('#' + DOM + ' label.checkbox.checked input').val() : 'none';

                App.Application.Maps.Functions.resetActiveMap()
                App.Application.Maps.Functions.loadLayer(layer, true);

                $('#' + DOM + '  a.close').click();
              });
            };
          });
        };

        App.Application.Maps.Functions.showLegend = function(show, title, subtitle) {

        };

        App.Application.Maps.Functions.showPopup = function(iso2, layer, coord) {
          var API = '/api/country/data/iso2/' + iso2;

          if(App.Application.Maps.Config.curr_layer_active !== null) {
            API = API + '?' + App.Application.Maps.Config.curr_layer_active.query;
          }

// try to know coordinates for popup orientation
console.log(coord, App.Application.Maps.Config.wilmap.getBounds()['_southWest'], coord.lng - App.Application.Maps.Config.wilmap.getBounds()['_southWest'].lng);
console.log(coord.lng - App.Application.Maps.Config.wilmap.getBounds()['_southWest'].lng);


          if (App.Application.Maps.Data[iso2]) {
            $.getJSON( API, function( data ) {
              var total = 0;
              var goto_button = (App.Application.Maps.Data[iso2].path)?'<a class="btn" href="' + App.Application.Maps.Data[iso2].path + '">GO TO COUNTRY PAGE</a>':'';
              var info_popup = '<p><strong>' + App.Application.Maps.Data[iso2].title + '</strong></p><ul>';


              $.each( data.values, function( key, val ) {
                console.log(val);

                total = total + parseInt(val.count);
                info_popup += '<li><span class="count">' + val.count + '</span> ' + val.label + '</li>';
              });

              info_popup += '</ul>';

              total = (total < 10) ? '0' + total : total;
              var output = '<div class="popup-inner"><div class="popup-inner-left"><span>'+total+'</span>Entries</div><div class="popup-inner-right"><div class="popup-info">' + info_popup + '</div><div class="popup-actions">' + goto_button + '</div></div></div>';

              App.Application.Maps.Config.popup = L.popup();
              App.Application.Maps.Config.popup.setLatLng(coord);
              App.Application.Maps.Config.popup.setContent(output);
              App.Application.Maps.Config.popup.openOn(App.Application.Maps.Config.wilmap);
            });
          };
        };

        App.Application.Maps.Functions.activeContinent = function(continent, visually, center) {
          var visually = typeof visually !== 'undefined' ? visually : true;
          var center = typeof center !== 'undefined' ? center : false;

          if (continent === 'none') {
            App.Application.Maps.Config.curr_continent_active = null;

            App.Application.Maps.Config.linecontinentmap.setStyle({
              color: App.Application.Maps.Config.color_border,
              weight: 0,
              opacity: 0
            });
          } else {
            App.Application.Maps.Functions.activeContinent('none');
            App.Application.Maps.Config.curr_continent_active = continent;

            var visually = (App.Application.Maps.Config.curr_layer_active !== null)?false:visually;
            App.Application.Maps.Config.linecontinentmap.eachLayer(function (layer) {
              if(layer.feature.properties.CONTINENT === continent) {
                if (visually) {
                  layer.setStyle({
                    color: App.Application.Maps.Config.color_active,
                    weight: 2,
                    opacity: 1
                  });
                }

                if (center){
                  // App.Application.Maps.Functions.centerMap(layer.getBounds());
                  App.Application.Maps.Functions.centerMap(continent);
                }
              }
            });
          }

          // Update list
          if(!App.Application.Maps.Config.is_embed) {
            App.Application.ListMaps.Functions.activeContinent(continent);
          }
        };

        App.Application.Maps.Functions.activeCountry = function(country, visually, center) {
          var visually = typeof visually !== 'undefined' ? visually : true;
          var center = typeof center !== 'undefined' ? center : false;

          if (country === 'none') {
            App.Application.Maps.Config.curr_country_active = null;

            App.Application.Maps.Config.interactivemap.setStyle({
              fillColor: 'transparent',
              fillOpacity: 0,
              color: 'transparent',
              weight: 0,
              opacity: 0
            });
          } else {
            App.Application.Maps.Functions.activeCountry('none');
            App.Application.Maps.Config.curr_country_active = country;

            var visually = (App.Application.Maps.Config.curr_layer_active !== null)?false:visually;
            App.Application.Maps.Config.interactivemap.eachLayer(function (layer) {
              if(layer.feature.properties.iso2 === country) {
                layer.setStyle({
                  fillColor: App.Application.Maps.Config.color_active,
                  fillOpacity: (visually)?1:0,
                  color: App.Application.Maps.Config.color_active,
                  weight: 2,
                  opacity: 1
                });

                if (center){
                  // App.Application.Maps.Functions.centerMap(layer.getBounds());
                  App.Application.Maps.Functions.centerMap(continent);
                }

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                 layer.bringToFront();
                }
              }
            });
          }

          // Update list
          if(!App.Application.Maps.Config.is_embed) {
            App.Application.ListMaps.Functions.activeHoverCountry(country, 'active');
          }
        };

        App.Application.Maps.Functions.hoverCountry = function(country, action) {
          if (country === 'none') {
            App.Application.Maps.Config.interactivemap.eachLayer(function (layer) {
              layer.setStyle({
                color: 'transparent',
                weight: 0,
                opacity: 0
              });
            });
          } else {
            App.Application.Maps.Config.interactivemap.eachLayer(function (layer) {
              if(layer.feature.properties.iso2 === country) {
                if (action === 'on') {
                  layer.setStyle({
                    color: App.Application.Maps.Config.color_active,
                    weight: 2,
                    opacity: 1
                  });
                } else {
                  layer.setStyle({
                    color: 'transparent',
                    weight: 0,
                    opacity: 0
                  });
                }

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                 layer.bringToFront();
                }
              }
            });
          }

          // Update list
          if(!App.Application.Maps.Config.is_embed) {
            country = (action === 'off') ? 'none':country;
            App.Application.ListMaps.Functions.activeHoverCountry(country, 'hover');
          }
        };

        App.Application.Maps.Functions.loadLayer = function(layer, redraw) {
          var API_LAYER = '/api/layer/' + layer + '/filters';
          var API_QUERY = '/api/countries/entries/count?';
          var DOM_LAYERS = '#modal-maplayer';

          var redraw = typeof redraw !== 'undefined' ? redraw : false;

          if (layer !== 'none') {
            layer = { layerid:layer, query:'', title:'', description:'', style:'' };
            App.Application.Maps.Config.curr_layer_active = layer;

            if (App.Application.Maps.Config.curr_layer_active.layerid === 'frommap') {
              var url = window.location.href;

              App.Application.Maps.Config.curr_layer_active.title = (url.indexOf('layertitle') > -1) ? App.Utils.getUrlVar('layertitle') : '';
              App.Application.Maps.Config.curr_layer_active.description = (url.indexOf('layerdesc') > -1) ? App.Utils.getUrlVar('layerdesc') : '';
              App.Application.Maps.Config.curr_layer_active.style = (url.indexOf('layerstyle') > -1) ? App.Utils.getUrlVar('layerstyle') : '';
              App.Application.Maps.Config.curr_layer_active.query = url.split('?')[1];

              App.Application.Maps.Functions.applyLayerOverMap(redraw);
            } else {
              var l = $(DOM_LAYERS + ' label[data-layerid="' + App.Application.Maps.Config.curr_layer_active.layerid + '"]');

              App.Application.Maps.Config.curr_layer_active.title = l.data('layer-title');
              App.Application.Maps.Config.curr_layer_active.description = l.data('layer-desc');
              App.Application.Maps.Config.curr_layer_active.style = l.data('layer-style');

              // Change URL
              App.Utils.setBrowserURL('?layerid=' + App.Application.Maps.Config.curr_layer_active.layerid, document.title);

              // Get query
              $.getJSON( API_LAYER, function( data ) {
                console.log(data);
                App.Application.Maps.Config.curr_layer_active.query = data.query;

                App.Application.Maps.Functions.applyLayerOverMap(redraw);
              });
            }
          } else {
            if (App.Application.Maps.Config.curr_layer_active !== null) {
              // Change URL
              App.Utils.setBrowserURL('/map', document.title);
            }

            App.Application.Maps.Config.curr_layer_active = null;
            App.Application.Maps.Functions.applyLayerOverMap(redraw);
          }
        };

        App.Application.Maps.Functions.applyLayerOverMap = function(style, redraw) {
          var redraw = typeof redraw !== 'undefined' ? redraw : false;
          var style = typeof style !== 'undefined' ? style : 'none';

console.log(">>>>>>>");
console.log(App.Application.Maps.Config);

          //Style layer color -- random temporally - FAKE
          if (style !== 'none') {
            style = 'style' + (Math.floor(Math.random() * Object.keys(App.Application.Maps.Config.color_styles).length) + 1);
            var color_base = App.Application.Maps.Config.color_styles[style];
          }

          $.each(geoCountries.features, function(index, value) {
            if(style === 'none') {
              value.properties.color = 'transparent';
            } else {
              //density FAKE
              var maxVal = 1500;
              var minVal = 0;
              var currVal = Math.floor(Math.random() * maxVal);

              value.properties.color = App.Application.Maps.Functions.choropleth(color_base, currVal, minVal, maxVal);
            }
          });

          if(redraw) {
            App.Application.Maps.Config.basemapcolor.eachLayer(function (layer) {
              layer.setStyle({
                fillColor: layer.feature.properties.color
              });
            });
          }
        };

        App.Application.Maps.Functions.drawLabelsMap = function() {
          var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

          App.Application.Maps.Config.wilmap.createPane('labels');
          App.Application.Maps.Config.wilmap.getPane('labels').style.zIndex = 640;
          App.Application.Maps.Config.wilmap.getPane('labels').style.pointerEvents = 'none';

          App.Application.Maps.Config.positron_labels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
            attribution: cartodbAttribution,
            pane: 'labels'
          }).addTo(App.Application.Maps.Config.wilmap);
        };

        App.Application.Maps.Functions.drawBaseMap = function() {
          App.Application.Maps.Config.basemapcontinents = L.geoJson(geoContinents,
          {
            style: function(feature) {
              return {
                fillColor: App.Application.Maps.Config.color_inactive,
                fillOpacity: 1,
                color: App.Application.Maps.Config.color_inactive,
                weight: 1,
                opacity: 1
              }
            }
          }).addTo(App.Application.Maps.Config.wilmap);

          App.Application.Maps.Config.basemapcountries = L.geoJson(geoCountries,
          {
            style: function(feature) {
              return {
                fillColor: App.Application.Maps.Config.color_inactive,
                fillOpacity: 1,
                color: App.Application.Maps.Config.color_border,
                weight: 2,
                opacity: 0.5
              }
            }
          }).addTo(App.Application.Maps.Config.wilmap);

          App.Application.Maps.Config.basemapcolor = L.geoJson(geoCountries,
          {
            style: function(feature) {
              return {
                fillColor: feature.properties.color,
                fillOpacity: 0.5,
                color: App.Application.Maps.Config.color_border,
                weight: 0.5,
                opacity: 0.3
              }
            }
          }).addTo(App.Application.Maps.Config.wilmap);
        };

        App.Application.Maps.Functions.drawCountriesMap = function(layer) {
          App.Application.Maps.Config.linecontinentmap = L.geoJson(geoContinents,
          {
            style: function(feature) {
              return {
                fillColor: 'transparent',
                fillOpacity: 0,
                color: 'transparent',
                weight: 0,
                opacity: 0
              }
            }
          }).addTo(App.Application.Maps.Config.wilmap);

          App.Application.Maps.Config.interactivemap = L.geoJson(geoCountries,
          {
            style: function(feature) {
              return {
                fillColor: feature.properties.color,
                fillOpacity: 0,
                color: 'transparent',
                weight: 1,
                opacity: 1
              }
            },
            onEachFeature: function(feature, layer){
              layer.on({
               mouseover: function(e) {
                 var l = e.target;

                 if (l.feature.properties.iso2 !== App.Application.Maps.Config.curr_country_active) {
                   App.Application.Maps.Functions.hoverCountry(l.feature.properties.iso2, 'on');
                 }
               },
               mouseout: function(e) {
                 var l = e.target;

                 if (l.feature.properties.iso2 !== App.Application.Maps.Config.curr_country_active) {
                   App.Application.Maps.Functions.hoverCountry(l.feature.properties.iso2, 'off');
                 }
               },
               click: function (e) {
                 var l = e.target;
                 if (App.Application.Maps.Data[l.feature.properties.iso2]) {
                   App.Application.Maps.Config.click_on_map = true;

                   App.Application.Maps.Functions.activeContinent(App.Application.Maps.Data[l.feature.properties.iso2].continent, true, true);
                   App.Application.Maps.Functions.activeCountry(l.feature.properties.iso2, true, false);
                   App.Application.Maps.Functions.showPopup(l.feature.properties.iso2, '', e.latlng);
                 }
               }
             });
            }
          }).addTo(App.Application.Maps.Config.wilmap);
        };

        var dom = '.block-wilmap-map .wilmap';
        var dom_sidebar = '.ui-autocomplete.ui-widget-content';
        var dom_footer = '.site-footer';
        var dom_header = '.site-header';
        var api_countries = '/api/map/browse';

        if ($(dom).length > 0) {
          $(dom).attr('id','mapid');

          if (App.Application.Maps.Config.is_embed) {
            $(dom).width('100%');
            $(dom).height($(window).height());
          } else {
            $(dom).width($(window).width() - $(dom_sidebar).width());
            $(dom).height($(window).height() - $(dom_footer).height());
            $(dom_sidebar).height($(window).height() - $(dom_footer).height() - $(dom_header).height() - 116);
          }

          // Init map
          App.Application.Maps.Config.wilmap = L.map('mapid', {
            center: App.Application.Maps.Config.bounds.getCenter(),
            zoom: 5,
            minZoom: 2,
            maxZoom: 7,
            maxBounds: App.Application.Maps.Config.bounds,
            maxBoundsViscosity: 0.75
          });

          App.Application.Maps.Config.wilmap.setView(App.Application.Maps.Config.initial_view, 3);

          // Preparing Initial Data
          $.getJSON( api_countries, function( data ) {
            $.each( data, function( key, val ) {
              var continent = val.title;

              // Countries
              if (Object.keys(val.countries).length) {
                $.each( val.countries, function( kc, vc ) {
                  var obj = {'id':kc,'title':vc.title,'path':vc.path,'continent':continent};
                  App.Application.Maps.Data[vc.iso2] = obj;
                });
              }
            });
          });

          // Continents
          $.each( geoContinents.features, function ( key, val ) {
            var v = val.properties;
            var obj = {'id':key,'title':v.CONTINENT,'centroid':v.centroid,'zoom':v.zoom};
            App.Application.Maps.ContinentData[v.CONTINENT] = obj;
          });

          // Firs load
          var first_layer_load = (window.location.href.indexOf('layerid=') > -1) ? App.Utils.getUrlVar('layerid') : false;
          first_layer_load = (!first_layer_load) ? 'none' : first_layer_load;

console.log('first_layer_load -> ' + first_layer_load);

          App.Application.Maps.Functions.loadLayer(first_layer_load, false);

          // Vector maps
          App.Application.Maps.Functions.drawBaseMap();
          App.Application.Maps.Functions.drawCountriesMap(); // Interactive Map

          // Tiles labels
          App.Application.Maps.Functions.drawLabelsMap();

          // Events
          // Map click
          App.Application.Maps.Config.wilmap.on('click', function(e) {
            // click on water
            if(!App.Application.Maps.Config.click_on_map) {
              App.Application.Maps.Functions.resetActiveMap();
            }

            App.Application.Maps.Config.click_on_map = false;
          });

          // Layer buttons
          var style_actions = (App.Application.Maps.Config.is_embed) ? ' style="display:none;"' : ' style="display:block;"';
          $(dom).append('<div class="actions"' + style_actions + '></div>');
//            $(dom + ' .actions').append('<a href="#" class="btn" id="randomcolor">SIMULATE LOAD LAYER COLOR</a>');
//            $(dom + ' .actions').append('<a href="#" class="btn" id="resetcolor">REMOVE COLOR</a>');
          $(dom + ' .actions').append('<a class="btn" href="#" data-action="share" data-embed="true">Share</a>');

          // Generate Layer modal
          App.Application.Maps.Functions.generateLayerModal();

          $('#randomcolor').on('click', function(e){
            App.Application.Maps.Functions.resetActiveMap()
            App.Application.Maps.Functions.loadLayer('lala', true);
            e.preventDefault();
          });

          $('#resetcolor').on('click', function(e){
            App.Application.Maps.Functions.resetActiveMap()
            App.Application.Maps.Functions.loadLayer('none', true);
            e.preventDefault();
          });

          $('.actions .btn').on('mouseover click', function(e){
            App.Application.Maps.Config.wilmap.doubleClickZoom.disable();
          });

          $('.actions .btn').on('mouseout', function(e){
            App.Application.Maps.Config.wilmap.doubleClickZoom.enable();
          });




          console.log(App.Application.Maps);
          console.log(geoCountries);
          console.log(geoContinents);
        }
      },

      /**
       * Field Datasheet
       */
      fieldDatasheet: function() {
        var dom = '.fields-datasheet';
        var items_group = 2;

        if ($(dom).length > 0) {
          // Reset field
          $(dom + ' .field').removeClass().addClass('field');

          // Group fields
          if (!$(dom + ' .fields-group').length > 0) {
            var fields = $(dom + ' > .field');
            for(var i = 0; i < fields.length; i += items_group) {
              fields.slice(i, i + items_group).wrapAll("<div class='fields-group'></div>");
            }
          }

          // fields groups adjustements
          var num_fieldsgruop = $(dom + ' > .fields-group').length;
          $.each($(dom + ' > .fields-group'), function (index, value) {
            if(index == 0) {
              $(this).addClass('__show');
            } else {
              $(this).addClass('__hide');
            }
          });

          // button show more
          if (!$(dom + ' .datasheet-actions').length > 0) {
            if(num_fieldsgruop > 1) {
              $(dom).append('<div class="datasheet-actions"><a href="#" class="btn">Show more</a></div>');
            }
          }

          // Events
          $(dom + ' .datasheet-actions a').on('click', function(e){
            e.preventDefault();

            $(dom + ' .datasheet-actions').hide();
            $(dom + ' .fields-group.__hide').removeClass('__hide').addClass('__show');
          });

          // DOM processed
          $(dom).addClass('__processed');
        }
      },

      /**
       * country list
       */
      countryListMap: function() {
        var dom = 'body.node-map .ui-autocomplete';
        var api = '/api/map/browse';

        // Init
        App.Application.ListMaps = {};
        App.Application.ListMaps.Functions = {};

        App.Application.ListMaps.Functions.activeContinent = function(continent) {
          $(dom).scrollTop(0);

          if (continent === 'none') {
            $('.continent-list-item a.continent').removeClass('active');
            $('.continent-list-item .continent-list-drawer').removeClass('active');
          } else {
            $('.continent-list-item a.continent').each(function (k, v){
              var t = continent;
              console.log($(this).text() + ' - ' + t);
              if($(this).text() !== t) {
                $(this).removeClass('active');
                $(this).parent().find('.continent-list-drawer').removeClass('active');
              } else {
                $(this).addClass('active');
                $(this).parent().find('.continent-list-drawer').addClass('active');
              }
            });
          }
        };

        App.Application.ListMaps.Functions.activeHoverCountry = function(country, action) {
          $('.continent-list-item .country a').removeClass(action);

          if(country !== 'none') {
            $('.continent-list-item .country a[data-iso2="'+country+'"]').addClass(action);

            if(action === 'active') {
              setTimeout(function(){
                $(dom).scrollTop(($('.continent-list-item .country a[data-iso2="'+country+'"]').offset().top) - 200);
              }, 300)

            }
          }
        };

        if ($(dom).length > 0) {
          $.getJSON( api, function( data ) {
            console.log(data);
            var output = '';
            $.each( data, function( key, val ) {
              output += '<li class="continent-list-item" id="continent-list-item-' + key + '"><a class="continent toggle" gumby-trigger="#countries-continent-' + key + '" href="#">' + val.title + '</a>';
              output += '<ul class="continent-list-drawer drawer" id="countries-continent-' + key + '">';

              // Regions
              if (Object.keys(val.regions).length) {
                $.each( val.regions, function( kr, vr ) {
                  output += '<li class="country-list-item region"><a data-original="' + vr.title + '" href="' + vr.path + '">' + vr.title + '</a>';
                });
              }

              // Countries
              if (Object.keys(val.countries).length) {
                $.each( val.countries, function( kc, vc ) {
                  output += '<li class="country-list-item country"><a data-original="' + vc.title + '" data-iso2="' + vc.iso2 + '" href="' + vc.path + '">' + vc.title + '</a>';
                });
              }

              output += '</ul>';
              output += '</li>';
            });

            $(dom).append(output);

            // Events
            Gumby.init();

            $('.continent-list-item a.continent').on('click', function (e) {
              var target = $(this).text();

              if ($(this).hasClass('active')){
                App.Application.Maps.Functions.resetActiveMap();
                App.Application.Maps.Functions.activeContinent(target, true, true);
              } else {
                App.Application.Maps.Functions.resetActiveMap();
              }
            });

            $('.continent-list-item .country-list-item.country a').on('mouseover', function (e) {
              App.Application.Maps.Functions.hoverCountry($(this).data('iso2'), 'on');
            });

            $('.continent-list-item .country-list-item.country a').on('mouseout', function (e) {
              App.Application.Maps.Functions.hoverCountry($(this).data('iso2'), 'off');
            });

          });
        }
      },

      /**
      * country search
      */
      countrySearchMap: function() {
        var dom = 'body.node-map .site-header .search-block-form';
        var dom_autocomplete = 'ul.ui-autocomplete.ui-widget.ui-widget-content';

        // Init
        App.Application.countrySearchMaps = {};
        App.Application.countrySearchMaps.Functions = {};

        App.Application.countrySearchMaps.Functions.resetList = function() {
          $(dom_autocomplete + ' .continent-list-drawer .country-list-item').each(function(k, v){
              $(v).show().find('a').text($(v).find('a').data('original'));
          });

        };

        App.Application.countrySearchMaps.Functions.initSearch = function() {
          if ($(dom).length > 0) {
            $(dom + ' input[type="search"]').hide();

            if (!$(dom + ' .country-search').length > 0) {
              $(dom + ' .form-item.form-type-search').append('<input class="country-search input text" type="text" value="" size="15" maxlength="128" placeholder="Search for a country">');

              // Events
              $(dom + ' input[type="text"]').bind("keypress", function (e) {
                // prevent submit on press enter key
                if (e.keyCode == 13) {
                  return false;
                }
              });

              $(dom + ' input[type="text"]').bind("keyup", function (e) {
                var val = $(this).val();

                if(val.length > 0) {
                  App.Application.ListMaps.Functions.activeContinent('none');

                  $(dom_autocomplete + ' .continent-list-drawer').addClass('active');
                  $(dom_autocomplete + ' .continent-list-drawer .country-list-item').hide();

                  $(dom_autocomplete + ' .continent-list-drawer .country-list-item').each(function(k, v){
                    var re = new RegExp( "(" + val + ")", "gi" );
                    var template = '<span class="highlight">$1</span>';
                    var html = $(v).text().replace( re, template );

                    if ($(v).text().match(re)) {
                      $(v).show().find('a').html(html);
                    }
                  });
                } else {
                  App.Application.ListMaps.Functions.activeContinent('none');
                  App.Application.countrySearchMaps.Functions.resetList();
                }

              });

              $(dom + ' input[type="text"]').on('focus', function() {
                $(dom).addClass('active');
                $(dom_autocomplete).removeClass('__kill');
              });

              $(dom + ' input[type="text"]').on('blur', function() {
                App.Application.ListMaps.Functions.activeContinent('none');
                App.Application.countrySearchMaps.Functions.resetList();
                $(this).val('');
                $(dom).removeClass('active');
              });
            }
          }
        };

        App.Application.countrySearchMaps.Functions.initSearch();
      },

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
            bigitem: '.block-views-blocknews-block-2 .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.block-views-blocknews-block-3 .node',
            ref: '.node__title a'
          },
          {
            bigitem: '.block-views-blockcontributors-block-1 .view-content .views-row',
            ref: '.contributor-info-holder .views-field-name a'
          },
          {
            bigitem: '.block-views-blockcontributions-block-1 .view-content .views-row',
            ref: '.node__title a'
          },
          {
            bigitem: '.view-contributors.view-id-contributors .view-content .views-row',
            ref: '.contributor-info-holder .views-field-name a'
          },
          {
            bigitem: '#block-activecontributors .content .views-row',
            ref: '.views-field-name a'
          },
          {
            bigitem: '.item-list .search-results li',
            ref: '.search-result__title a'
          },
          {
            bigitem: '.panel-block .view-content .views-row',
            ref: '.node__title a'
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
       * Suggest edit footer
       */
      suggestEditFooter: function() {

        var ref = window.location.href;

        $('.site-footer .footer_second_wrap .block-menu li').each(function(i, item) {
          if ($(item).text().toLowerCase().indexOf('suggest') != -1) {
            $(item).find('a').attr('href', $(item).find('a').attr('href') + '/?r=' + ref);
          }
        });

      },


      /**
       * Sharethis
       */
      shareThis: function() {
        var dom = 'a[data-action="share"]';
        var embed = ($(dom).attr('data-embed') !== 'undefined' && $(dom).attr('data-embed') === 'true') ? true : false;
        var embed_style = (embed) ? '' : ' style="display:none"';
        var output = '';
        var url_to_share = window.location.href;
        var facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' + escape(url_to_share);
        var twitter_url = 'https://twitter.com/share?url=' + escape(url_to_share);
        var url_to_embed = 'http://dev-wilmap.pantheonsite.io/widgets/map/' + ((url_to_share.indexOf('?') > -1) ? '?' + url_to_share.split('?')[1] : '');
        var embed_code = '<iframe width="600" height="400" src="'+ url_to_embed +'"></iframe>';
        var title_to_share = document.title;

        console.log(url_to_share);
        console.log(url_to_embed);
        // console.log(title_to_share);
        // console.log(embed);

        if ($(dom).length > 0) {
          output += '<div class="modal" id="modal-share">';
          output += '  <div class="content">';
          output += '    <a class="close switch" gumby-trigger="|#modal-share">CLOSE</a>';
          output += '      <h3>Sharing</h3>';
          output += '      <div class="content-inner">';
          output += '         <section class="tabs">';
          output += '           <ul class="tab-nav">';
          output += '             <li class="active"><a href="#">Share Page</a></li>';
          output += '             <li' + embed_style + '><a href="#">Embed map</a></li>';
          output += '           </ul>';
          output += '           <div class="tab-content active">';
          output += '             <a class="btn sharebutton fb" target="_blank" href="' + facebook_url + '">Share on facebook</a>';
          output += '             <a class="btn sharebutton twitter" target="_blank" href="' + twitter_url + '">Share on twitter</a>';
          output += '             <br /><br />';
          output += '             <div id="share-input" class="copy-url append field">';
          output += '               <input class="input" type="text" value="' + url_to_share + '" />';
          output += '               <a class="btn" href="#">COPY</a>';
          output += '               <div class="result"></div>';
          output += '             </div>';
          output += '           </div>';
          output += '           <div class="tab-content">';
          output += '             <p>' + Drupal.t('Copy and Paste this code in your website in the HTML editor view.') + '</p>';
          output += '             <div id="share-textarea" class="copy-url field">';
          // output += '               <textarea class="js-text-full text-full form-textarea input textarea"><iframe width="600" height="400" src="http://dev-wilmap.pantheonsite.io/widgets/map/?'+unescape(url_to_share.split('%3Fck')[1])+'"></iframe></textarea><br />';
          output += '               <textarea class="js-text-full text-full form-textarea input textarea">'+ embed_code +'</textarea><br />';
          output += '               <a class="btn" href="#">COPY EMBED CODE</a>';
          output += '               <div class="result"></div>';
          output += '             </div>';
          output += '           </div>';
          output += '         </section>';
          output += '      </div>';
          output += '  </div>';
          output += '</div>';

          // Write modal in body
          $('body').append(output);

          // Action in open modal button
          $(dom).addClass('switch').attr('gumby-trigger','#modal-share');

          $(dom).on('click', function(){
            var modal = '#modal-share';

            // Refresh data
            var url_to_share = window.location.href;
            var facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' + escape(url_to_share);
            var twitter_url = 'https://twitter.com/share?url=' + escape(url_to_share);
            var url_to_embed = 'http://dev-wilmap.pantheonsite.io/widgets/map/' + ((url_to_share.indexOf('?') > -1) ? '?' + url_to_share.split('?')[1] : '');
            var embed_code = '<iframe width="600" height="400" src="'+ url_to_embed +'"></iframe>';

            $(modal + ' .sharebutton.fb').attr('href', facebook_url);
            $(modal + ' .sharebutton.twitter').attr('href', twitter_url);
            $(modal + ' #share-input input.input').val(url_to_share);
            $(modal + ' #share-textarea textarea.input').val(embed_code);

            $(modal + '.copy-url .result').text('').removeClass('success').removeClass('error').removeClass('empty');
          });

          $('#modal-share .tab-nav li a').on('click', function(){
            $('.copy-url .result').text('').removeClass('success').removeClass('error').removeClass('empty');
          });

          // Actions in share button
          $('a.sharebutton').on('click', function(e){
            var w = 360;
            var h = 500;
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/2);

            window.open($(this).attr('href'), "wnd", "status = 1, height = " + h + ", width = " + w + ", top = " + top + ", left = " + left + ", resizable = 0");
            e.preventDefault();
          });

          // Copy URL to clipboard
          $('.copy-url a.btn').on('click', function(e){
            $('.copy-url .result').text('').removeClass('success').removeClass('error').removeClass('empty');

            try {
              $('.copy-url .input').select();
              document.execCommand("copy");
              $('.copy-url .result').text('Page URL copied!').addClass('success');
            } catch(err) {
              $('.copy-url .result').text('Page URL not copied. Please select and copy with your keyboard.').addClass('error');
            }

            setTimeout(function(){
              $('.copy-url .result').addClass('empty');
            }, 2000);

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
       * Sidenav mobile
       */
      sidenavMobile: function() {
        var dom_sidemenu = '.content-sidenav .view-content';
        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

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
        }
      },

      /**
       * News Navigation
       */
      newsNavigation: function() {
        var dom = '.node-news .block-views-blockcontinent-block-continents';
        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

        if ($(dom).length > 0) {
          var default_item = 'show=all';
          var uri = location.href.split('/news?')[1];
              uri = ( uri == undefined || ( uri.indexOf('continent') == -1 && uri.indexOf('transnational') == -1 ) ) ? default_item : uri;

          // Active current element
          $(dom + ' .views-row a').each(function(i, item) {
              var target = $(item).attr('href').split('?')[1];

              if (uri.indexOf(target) != -1) {
                $(dom + ' .views-row a').removeClass('__active');
                $(item).addClass('__active');

                if(isPhone) {
                  // Nav to active item
                  var active = parseInt($(item).parents('.slick-slide').attr('data-slick-index'));
                  $(dom + ' .view-content').slick('slickGoTo', active);
                }
              }
          });
        }
      },

      /**
       * Topics side navigation
       */
      topicsNavigation: function() {
        var dom = '.page-node-type-topics';
        var dom_sidemenu = '.content-sidenav';
        var dom_entries = dom + ' .block-views-blockentries-block-1';
        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));
        var uri = location.href.split('#')[1];
            uri = (uri === undefined) ? '' : uri;

        if ($(dom).length > 0) {

          // Generate anchors and side menu
          var count = 0;
          var sidemenu = '';
          sidemenu += '<section class="views-element-container block block-views fake-view" id="custom-sidenav">';
          sidemenu += '  <div class="content">';
          sidemenu += '    <div>';
          sidemenu += '      <div class="view view-continent">';
          sidemenu += '        <div class="view-content">';
          sidemenu += '          <div class="views-row"><a class="skip" gumby-duration="600" gumby-goto="top" href="#">Description</a></div>';

          $(dom_entries + ' h3').each(function(i, item) {
            var offset = (isPhone)?'-10':'-140';
            var slug = App.Utils.Slugify($(this).text());

            $(this).addClass('country-block-title').attr('id','entry-block-' + slug);
            sidemenu += '          <div class="views-row"><a class="skip" gumby-offset="' + offset + '" gumby-duration="600" gumby-goto="#entry-block-' + slug + '" href="#entry-block-' + slug + '">' + $(this).text() + '</a></div>';

            count++;
          });

          sidemenu += '        </div>';
          sidemenu += '      </div>';
          sidemenu += '    </div>';
          sidemenu += '  </div>';
          sidemenu += '</section>';

          // Print sidemenu
          if(!$(dom_sidemenu + ' .view-content').length > 0) {
            $(dom_sidemenu).append(sidemenu);
            App.Application.methods.sidenavMobile();
          }

          // Click Event
          $(dom_sidemenu + ' .view-content .views-row a').on('click touchend', function() {
            $(dom_sidemenu + ' .view-content .views-row a').removeClass('__active');
            $(this).addClass('__active');

            window.history.pushState($(this).attr('href'), document.title, $(this).attr('href'));
          });

          // Active current element when first load
          $(dom_sidemenu + ' .view-content .views-row a').each(function(i, item) {
              var target = $(item).attr('href').split('#')[1];

              if (uri.indexOf(target) != -1) {
                $(dom_sidemenu + ' .view-content .views-row a').removeClass('__active');
                $(item).addClass('__active');

                //Scroll content
                // setTimeout(function(){
                //   $(item).click();
                // }, 1000);

                if(isPhone) {
                  // Nav to active item
                  var active = parseInt($(item).parents('.slick-slide').attr('data-slick-index'));
                  $(dom_sidemenu + ' .view-content').slick('slickGoTo', active);
                }
              };
          });
        }
      },

      /**
       * Anchor pagination
       */
      anchorPagination: function() {

        var anchor_str = 'anchor-content';
        var elementsAnchors = [
          {
            el_content: '.path-user .block-views-blockcontributions-block-1',
            el_pager: '.path-user .block-views-blockcontributions-block-1 .pager',
            offset: -150,
          }
        ];

        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

        $.each( elementsAnchors, function( index, value ) {
          if ( $(value.el_content).length > 0 && $(value.el_pager ).length > 0 ) {
            // Anchor url?
            var jump = ((window.location.href).indexOf('#' + anchor_str) !== -1)?true:false;

            // Insert Anchor
            $(value.el_content).addClass(anchor_str);

            // Modify pager
            $(value.el_pager + ' .pager__item--next a').attr('href', $(value.el_pager + ' .pager__item--next a').attr('href') + '#' + anchor_str);
            $(value.el_pager + ' .pager__item--previous a').attr('href', $(value.el_pager + ' .pager__item--previous a').attr('href') + '#' + anchor_str);

            // Scroll
            if(jump){
              App.Utils.scrollAnimate('.' + anchor_str, value.offset);
            }
          }
        });
      },


      /**
       * country and region prepare content + navigation
       */
      countryAndRegionContentNavigation: function() {
        var dom = '.page-node-type-country, .page-node-type-region';
        var dom_sidemenu = '.content-sidenav';
        var dom_content =  '.region-content';
        var dom_contentsections =  dom_content + ' > section';
        var nid = $('.node-id').text();
        var api_section_list = '/api/section';
        var node_type = $(dom).hasClass('page-node-type-region')?'region':'country';
        var api_section = '/api/' + node_type + '-entries/' + node_type + '/' + nid + '/section/';
        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));
        var uri = location.href.split('#')[1];
            uri = (uri === undefined) ? '' : uri;

        if ($(dom).length > 0) {
          // Prepare sidenav
          var sidemenu = '';
          sidemenu += '<section class="views-element-container block block-views fake-view" id="custom-sidenav">';
          sidemenu += '  <div class="content">';
          sidemenu += '    <div>';
          sidemenu += '      <div class="view view-continent">';
          sidemenu += '        <div class="view-content">';

          var enabled = ($('article.node').hasClass('node--empty'))?'__disabled':'__enabled';
          sidemenu += '          <div class="views-row '+enabled+'"><a class="skip" gumby-duration="600" gumby-goto="top" href="#description">Description</a></div>';

          sidemenu += '        </div>';
          sidemenu += '      </div>';
          sidemenu += '    </div>';
          sidemenu += '  </div>';
          sidemenu += '</section>';

          // Print sidemenu and active tabs
          if(!$(dom_sidemenu + ' .view-content').length > 0) {
            $(dom_sidemenu).append(sidemenu);
          }

          // fix active contributos image
          $('#block-activecontributors .views-field-user-picture').each(function(k,v){
            var img = $(v).find('.field--name-user-picture').remove().text();
            $(v).css('background-image', 'url('+img+')');
          });

          // Prepare static content
          $.each($(dom_contentsections), function(i, k){

            if(i === 0){
              $(k).attr('id','panel-description');
            } else {
              $(k).attr('id', 'panel-' + App.Utils.Slugify($(k).find('h2').first().text()));
              $(dom_sidemenu + ' .view-content').append('<div class="views-row __enabled"><a class="skip" gumby-duration="600" gumby-goto="top" href="#'+App.Utils.Slugify($(k).find('h2').first().text())+'">'+$(k).find('h2').first().text()+'</a></div>');
            }

            $(k).addClass('panel-block');
          });

          // load ajax content
          $.get(api_section_list, function() {})
            .done(function( data ) {

              var count = 0;
              var data_clone = data;
              $.each(data_clone.reverse(), function(k, v){
                // console.log(v.tid, v.name);

                $(dom_sidemenu + ' .views-row').first().after('<div class="views-row __enabled"><a class="skip" gumby-duration="600" gumby-goto="top" href="#'+App.Utils.Slugify(v.name)+'">'+v.name+'</a></div>');
                $(dom_content + ' .block-system-main-block').after('<section id="panel-' + App.Utils.Slugify(v.name) + '" class="panel-block block-topics"><h2 class="title-section">'+v.name+'</h2><div class="content"></div></div>');

                // when all sections loaded
                count++;
                if(count == data_clone.length) {

                  // Events
                  $(dom_sidemenu + ' .view-content a').on('click', function(e){
                    if(!$(this).hasClass('__active')) {
                      $(dom_contentsections).removeClass('__active');
                      $(dom_sidemenu + ' .view-content a').removeClass('__active');

                      var id = '#panel-' + $(this).addClass('__active').attr('href').split('#')[1];
                      $(dom_contentsections+id).addClass('__active');

                      $(dom_sidemenu + ' .block-views').removeClass('fixed').removeClass('pinned');

                      App.Utils.setBrowserURL($(this).attr('href'), document.title);
                    }
                  });


                  // Active current/first content
                  var id = '';
                  if(uri === '') {
                    id = '#panel-' + $(dom_sidemenu + ' .views-row.__enabled').first().find('a').addClass('__active').attr('href').split('#')[1];
                    console.log(id);
                  } else {
                    id = '#panel-'+uri;
                    $(dom_sidemenu + ' .views-row a[href="#'+uri+'"]').addClass('__active');
                  }

                  $(dom_contentsections+id).addClass('__active');
                  Gumby.init();

                  if(isPhone) {
                    App.Application.methods.sidenavMobile();

                    // Nav to active item
                    var active = parseInt($(dom_sidemenu + ' .view-content a.__active').parents('.slick-slide').attr('data-slick-index'));
                    $(dom_sidemenu + ' .view-content').slick('slickGoTo', active);
                  }
                }

                // Load ajax content
                $.get(api_section + v.tid, function() {})
                  .done(function( data2 ) {
                    var el = $(data2).find('.region-content section .content > div');
                    var id = '#panel-' + App.Utils.Slugify(v.name);

                    $(dom_contentsections+id+' .content').html($(el).unwrap());
                    App.Application.methods.bigLinkAreas();
                  });
              });
            });
        }
      },


      /**
       * title + map country/region detail
       */
      countryAndRegionHeader: function() {
        var dom = '.page-node-type-country, .page-node-type-region';

        if ($(dom).length > 0 && !$('#block-pagetitle .node-top').length > 0) {
          // country name
          var country = ($('body').hasClass('page-node-type-country')) ? $('.field--name-field-continent-country').text():$('.field--name-field-continent').text();
          $('#block-pagetitle').prepend('<div class="node-top"><div class="field--name-field-tax-section">'+country+'</div></div>');

          // goto map
          $('#block-pagetitle').prepend('<a href="/map" class="btn">Go to Map</a>');

          // map

        }
      },


      /**
       * Lists Switch
       */
      listSwitch: function() {

        var switch_class = 'listswitch';
        var switch_onoff = '_switch-';
        var outputHTML   = '';
        var elementsSwitch = [
          {
            element: '.block-views-blocklist-entries-block-1',
            insert_dom: '.block-views-blocklist-entries-block-1 .view-filters form .form--bottom',
            insert_position: 'bottom', // top or bottom
            strings: 'List|Grid',
            default_active: 'off', //on is first position, off second position
          }
        ];

        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

        $.each( elementsSwitch, function( index, value ) {
          if ( $(value.element).length > 0 && $(value.insert_dom).length > 0 ) {
            var active_off = (value.default_active === 'off')? 'class="_active" ' : '';
            var active_on = (value.default_active === 'on')? 'class="_active" ' : '';

            outputHTML += '<div class="' + switch_class + '">';
            outputHTML += '<a href="#" ' + active_on + 'data-switch="on" data-target="' + value.element + '">' + value.strings.split('|')[0] + '</a>';
            outputHTML += ' / ';
            outputHTML += '<a href="#" ' + active_off + 'data-switch="off" data-target="' + value.element + '">' + value.strings.split('|')[1] + '</a>';
            outputHTML += '</div>';

            if(!$(value.insert_dom + ' .' + switch_class).length > 0) {
              if(value.insert_position === 'top') {
                $(value.insert_dom).prepend(outputHTML);
              } else {
                $(value.insert_dom).append(outputHTML);
              }
            }

            $(value.element).addClass(switch_onoff + value.default_active);
          }
        });

        // Events
        $('.' + switch_class + ' a').on('click', function(e) {
          if(!$(this).hasClass('_active')) {
            $(this).parent().find('a').removeClass('_active');
            $(this).addClass('_active');

            $($(this).data('target')).removeClass(switch_onoff + 'on').removeClass(switch_onoff + 'off');
            $($(this).data('target')).addClass(switch_onoff + $(this).data('switch'));
          }

          e.preventDefault();
        });
      },

      /**
       * sticky items
       */
      stickyItems: function() {
        var offDOM = ($('#prefooter').length > 0)?'#prefooter':'#footer';
        var pinoffset = ($('#prefooter').length > 0)?'700':'auto';

        var elementsSticky = [
          {
            element: '.content-sidenav .block-views',
            off: offDOM,
            offset: '150',
            pinoffset: pinoffset,
            onFixed: '',
            onUnfixed: '',
            mobile: false
          }
        ];

        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

        $.each( elementsSticky, function( index, value ) {
          var canFix = true;

          if( isPhone && !value.mobile ) {
            canFix = false;
          }

          if( canFix ) {
            if ( $(value.element ).length > 0 && $( 'body.user-logged-in' ).length === 0 ) {
              var pinoffset_value = (value.pinoffset === 'auto')?($(value.element).height() + $(value.off).height()) - 20:value.pinoffset;

              $( value.element ).attr( 'gumby-fixed', 'top' ).attr( 'gumby-pin', value.off ).attr( 'gumby-offset', value.offset ).attr( 'gumby-pinoffset', pinoffset_value ).data( 'height',  $( value.element ).height());
            }

            if ( value.onFixed !== '' ) {
              $( value.element ).on('gumby.onFixed', function(e) {
                value.onFixed(e);
              });
            }

            $( value.element ).on('gumby.onPinned', function(e) {
              console. log(e.target.style.top + ' !important;');
              $(value.element).attr('style', 'top: ' + e.target.style.top + ' !important;');
            });

            if ( value.onUnfixed !== '' ) {
              $( value.element ).on('gumby.onUnfixed', function(e) {
                value.onUnfixed(e);
              });
            }
          }
        });
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


