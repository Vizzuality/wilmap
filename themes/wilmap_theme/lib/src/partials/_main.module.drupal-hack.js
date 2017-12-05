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
       * Beta
       */
      betaVersion: function() {
        var runON = '.site-name';

        if ($(runON).length > 0) {
          $(runON).append('<span class="beta">Beta</span>');
        }
      },

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

        //Init
        App.DrupalHack.entriesFilterList = {};
        App.DrupalHack.entriesFilterList.advancedChanges = [];
        App.DrupalHack.entriesFilterList.last_active_checkbox_in_advanced = false;

        App.DrupalHack.entriesFilterList.checkLastActiveCheckbox = function() {
          var out_total = $(runON + ' .views-exposed-form .form--advanced .content .advanced-tag[data-type="checkbox"]').length;
          var in_total = $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input[type="checkbox"]:checked').length;

          if (in_total === 0 && out_total !== 0) {
            App.DrupalHack.entriesFilterList.last_active_checkbox_in_advanced = true;
          }

        }

        App.DrupalHack.entriesFilterList.autoSubmit = function() {
          if(App.DrupalHack.entriesFilterList.last_active_checkbox_in_advanced) {
            console.log('Recarga Form');

            // Reload url for preventing bug of last item in advanced search.
            $('body').after($('<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>'));
            location.href = App.DrupalHack.entriesFilterList.serializeForm();
          } else {
            console.log('Hace submit');

            // Auto submit
            $(runON + ' .views-exposed-form input.form-submit').click();
          }
        }

        App.DrupalHack.entriesFilterList.serializeForm = function(href) {
          var href = typeof href !== 'undefined' ? href : location.href.split('?')[0];
          var serialize = $(runON + ' .views-exposed-form').serialize();
          var out = href + '?' + serialize;

          return out;
        }

        App.DrupalHack.entriesFilterList.closeAdvancedFilters = function() {

        }

        App.DrupalHack.entriesFilterList.updateAdvancedFilters = function() {
          var advancedDOM = runON + ' .views-exposed-form .form--advanced';
          var advancedContentDOM = advancedDOM + ' .content';
          var cont = 0;

console.log('in updateAdvancedFilters');

          // Check if is last active checkbox in advanced form
          App.DrupalHack.entriesFilterList.checkLastActiveCheckbox();

          // Reset contents
          $(advancedContentDOM).empty();
          $(runON + ' .views-exposed-form .form--modal .content-inner details.form-item summary').text('NONE SELECTED');

          // Update contents
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input').each(function(item, value) {
            var v_text = "";
            var v_target = "";
            var v_type = "";
            var ok = false;
            var template_button = '<div data-type="[v_type]" data-target="[v_target]" class="advanced-tag btn">[v_text] <a href="#" class="delete">X</a></div>';

            switch ($(value).attr('type')) {
              case 'text':
                if($(value).val() !== '') {
                  ok = true;
                  v_text = $(value).parent().find('label').text() + ': ' + $(value).val();
                  v_target = $(value).attr('id');
                  v_type = $(value).attr('type');
                  break;
                }
              case 'checkbox':
                if($(value).is(':checked')) {
                  ok = true;
                  console.log($(value).parents('label'));
                  v_text = $(value).parents('label').text();
                  v_target = $(value).attr('id');
                  v_type = $(value).attr('type');

                  //update summary info in modal
                  var summary_dom = $(this).parents('details.form-item').find('summary');
                  var comma = (summary_dom.text() === 'NONE SELECTED') ? '':' - ';
                  var output = (summary_dom.text() === 'NONE SELECTED') ? '':summary_dom.text();
                  output = output + comma + v_text;

                  $(this).parents('details.form-item').find('summary').text(output);

                  break;
                }
              default:
                ok = false;
                break;
            }

            if(ok){
              $(advancedContentDOM).append(template_button.replace(/\[v_text\]/g, v_text).replace(/\[v_target\]/g, v_target).replace(/\[v_type\]/g, v_type));
              cont++;
            }
          });

          // Events
          $(advancedContentDOM + ' .advanced-tag a.delete').on('click', function(e){
            e.preventDefault();

            var type = $(this).parent().data('type');
            var target = $(this).parent().data('target')

            // console.log('#'+target, type);
            // console.log($('#'+target).parent());

            switch (type) {
              case 'text':
                $('#'+target).val('');
                break;
              case 'checkbox':
                $('#'+target).prop('checked', false).removeAttr('checked');
                $('#'+target).parent().removeClass('checked');
                $('#'+target).parent().find('span i').remove();
                break;
              default:
                break;
            }

            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();

            // Submit
            App.DrupalHack.entriesFilterList.autoSubmit();
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

              // Clone first option
              $(this).find('select option:first').text('All');
              $(this).find('select').prepend($(this).find('select option:first').clone());

              // Label in option
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
            $(runON + ' .views-exposed-form .form--bottom').append($(runON + ' #show-map').remove().wrap());
            $(runON + ' .views-exposed-form .form--bottom').append($(runON + ' .views-exposed-form .form-actions').remove().wrap());
          }

          // DOM processed
          $(runON).addClass('__processed');

          setTimeout(function(){
            // First Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();
          }, 100);


          // Events
          // checkboxes
          // $(runON + ' .views-exposed-form .form--modal .content-inner details .form-type-checkbox').on('click', function(){
          //   var advancedContentDOM = runON + ' .views-exposed-form .form--advanced .content';
          //   App.DrupalHack.entriesFilterList.active_checkbox_in_advanced = $(advancedContentDOM + ' .advanced-tag[data-type="checkbox"]').length;
          //
          //   // Update
          //   App.DrupalHack.entriesFilterList.updateAdvancedFilters();
          // });

          // Inputs
          // $(runON + ' .views-exposed-form .form--modal input.form-text').on('blur', function(t){
          //   // Update
          //   App.DrupalHack.entriesFilterList.updateAdvancedFilters();
          // });

          // Selects
          $(runON + '  .views-exposed-form .form--inline .form--filter select, ' + runON + '  .views-exposed-form .form--inline .form--sort select').on('change', function(t){
            // aqui tendré que sincronizar la selección con el select de la modal

            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();

            // AutoSubmit
            App.DrupalHack.entriesFilterList.autoSubmit();
          });


          // close modal button
          $(runON + ' .views-exposed-form .form--modal a.close').on('click', function(e){
            e.preventDefault();
            console.log('cierra advanced');
          });

          // done button
          $(runON + ' .views-exposed-form .form--modal a.modal-done').on('click', function(e){
            e.preventDefault();

            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();

            // Close modal
            $(runON + ' .views-exposed-form .form--modal a.close').click();

            // AutoSubmit
            App.DrupalHack.entriesFilterList.autoSubmit();
          });

          // submit
          $(runON + ' .views-exposed-form input.form-submit').on('click', function(e){
            var out = App.DrupalHack.entriesFilterList.serializeForm();
            console.log('SUBMIT -> ' + out);

            App.Utils.setBrowserURL(out);
          });

          // show in map button
          $(runON + ' .views-exposed-form .form--bottom a#show-map').on('click', function(e){
            e.preventDefault();

            var serialize = App.DrupalHack.entriesFilterList.serializeForm('/map');
            var styles = ['blue','green','olive','bronze','maroon','purple','forest'];

            //add fromform, random style, title and desc
            serialize = serialize + '&layerid=fromform';
            serialize = serialize + '&layerstyle='+styles[Math.floor(Math.random()*styles.length)];
            serialize = serialize + '&layertitle=Explore in Map';
            serialize = serialize + '&layerdesc=';

            //Clean serialize
            //?claim=56&document=All&country=28278&sort_by=changed&fromyear=1900&toyear=&region=All&title=&layerid=fromform
            serialize = serialize.replace('claim=All&','');
            serialize = serialize.replace('country=All&','');
            serialize = serialize.replace('document=All&','');
            serialize = serialize.replace('fromyear=&','');
            serialize = serialize.replace('toyear=&','');
            serialize = serialize.replace('region=All&','');
            serialize = serialize.replace('sort_by=changed&','');
            serialize = serialize.replace('title=&','');

            location.href = serialize;
          });

          // pagination
          $('nav.pager .pager__item a').on('click', function(e){
            var serialize = App.DrupalHack.entriesFilterList.serializeForm();
            var page = $(this).attr('href').split('page=')[1];

            var out = serialize + '&page=' + page;
            console.log('PAGINATION -> ' + out);

            App.Utils.setBrowserURL(out);
          });
        }

        console.log(App.DrupalHack.entriesFilterList);
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
          var target = ($(toplinks + '-hidden .field--name-field-region').length > 0) ? 'region' : 'none';
          target = ($(toplinks + '-hidden .field--name-field-location-entry').length > 0) ? 'country' : target;
          var target_class = (target === 'region') ? 'field--name-field-region' : 'field--name-field-location-entry';
          var text = $('a.gotocountry').text().replace('#target#', target);

          if ($(toplinks).length > 0) {
            if(target !== 'none') {
              // Link Go To Page
              $('a.gotocountry').attr('href', $(toplinks + '-hidden .' + target_class + ' a').attr('href')).text(text).removeAttr('style');
            }

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

      /**
       * Google translator
       */
      google_translator: function() {
        var dom = '#block-googletranslate';
        var dom_google = '#google_translate_element';
        var dom_google_picker = dom + ' .picker';
        var dom_google_select = dom_google + ' select.goog-te-combo';

        //Init
        App.DrupalHack.google_translator = {};
        App.DrupalHack.google_translator.show = function(arg) {
          if (arg === true) {
            $(dom).removeClass('__hide').addClass('__show');
          } else {
            $(dom).removeClass('__show').addClass('__hide');
          }
        };

        App.DrupalHack.google_translator.setData = function(arg) {
          var classes = ['__small', '__big'];
          var select_text = '';
          var original_text = '';
          var option = '';
          var out = false;

          if (arg === '') {
            option = $(dom_google_select + ' option:first-child');
            select_text = 'eng';
            original_text = 'language';
            out = classes[0];
          } else {
            option = $(dom_google_select + ' option[value="' + arg + '"]');
            select_text = option.text().substring(0, 3);
            original_text = option.text();
            out = classes[0];
          }

          $(option).attr('data-original', original_text).text(select_text);

          return out;
        };

        if($(dom).length > 0) {
          $(dom_google).wrap('<div class="picker"></div>');

          setTimeout(function(){
            if($(dom_google).length > 0) {
              var idlang = ($(dom_google_select + ' option:first-child').attr('value') === '')?'':google.translate.TranslateElement().c;
              var css_class = App.DrupalHack.google_translator.setData(idlang);

              $(dom_google_picker).addClass(css_class);
              $(dom).addClass('__processed').addClass('__show');

              //Event
              $(dom_google_select).on('focus', function(){
                var idlang = ($(dom_google_select + ' option:first-child').attr('value') === '')?'':google.translate.TranslateElement().c;
                var option = (idlang === '')?$(dom_google_select + ' option:first-child'):$(dom_google_select + ' option[value="' + idlang + '"]');

                option.text(option.data('original'));

                $(dom_google_picker).removeClass('__small').addClass('__big');
              });

              $(dom_google_select).on('blur', function(e){
                var idlang = ($(dom_google_select + ' option:first-child').attr('value') === '')?'':google.translate.TranslateElement().c;
                var option = (idlang === '')?$(dom_google_select + ' option:first-child'):$(dom_google_select + ' option[value="' + idlang + '"]');

                if(idlang === '') {
                  option.text('eng');
                } else {
                  option.text(option.data('original').substring(0, 3));
                }

                $(dom_google_picker).removeClass('__big').addClass('__small');
              });

              $(dom_google_select).on('change', function(e){
                setTimeout(function(){
                  var idlang = google.translate.TranslateElement().c;
                  var css_class = App.DrupalHack.google_translator.setData(idlang);

                  $(dom_google_picker).removeClass('__small').removeClass('__big').addClass(css_class);
                }, 2000);
              });
            }
          }, 10000);
        }

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
      } else {
        // If page reload
        this.methods.contributorFilterList();
        this.methods.entriesFilterList();
        App.DrupalHack.entriesFilterList.updateAdvancedFilters();
      }

      // log
      console.log( 'App.DrupalHack Running' );

     }

  };
