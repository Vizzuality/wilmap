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
       * Map
       */
      Map: function() {
        var dom = '.block-wilmap-map .wilmap';

        if ($(dom).length > 0) {
          $(dom).attr('id','mapid');
          $(dom).width($(window).width() - 300);
          $(dom).height($(window).height());

          var wilmap = L.map('mapid');
          wilmap.setView([51.505, -0.09], 3);

          // wilmap.createPane('labels');

          var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

          var geojson = L.geoJson(geoCountries, {style: {fillColor: '#e4dfd3', fillOpacity: 1, color: 'white', weight: 1}}).addTo(wilmap);
          geojson.eachLayer(function (layer) {
            layer.bindPopup(layer.feature.properties.iso2);
          });

        	// var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        	// 	attribution: cartodbAttribution
        	// }).addTo(wilmap);

        	var positron_labels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        		attribution: cartodbAttribution
        	}).addTo(wilmap);

          //wilmap.getPane('labels').style.zIndex = 1000;
          // wilmap.getPane('labels').style.pointerEvents = 'none';

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
          {
            bigitem: '.block-views-blockcontributions-block-1 .view-content .views-row',
            ref: '.node__title a'
          },
          {
            bigitem: '.item-list .search-results li',
            ref: '.search-result__title a'
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
      * Main search
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
       * Sharethis
       */
      shareThis: function() {
        var dom = 'a[data-action="share"]';
        var output = '';
        var url_to_share = escape(window.location.href);
        var title_to_share = document.title;

        // console.log(escape(window.location.href));
        // console.log(title_to_share);

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
          output += '             <a class="btn sharebutton fb" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u='+url_to_share+'">Share on facebook</a>';
          output += '             <a class="btn sharebutton twitter" target="_blank" href="https://twitter.com/share?url='+url_to_share+'">Share on twitter</a>';
          output += '             <br /><br />';
          output += '             <div class="copy-url append field">';
          output += '               <input class="input" type="text" value="'+unescape(url_to_share)+'" />';
          output += '               <a class="btn" href="#">COPY</a>';
          output += '               <div class="result"></div>';
          output += '             </div>';
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

          $(dom).on('click', function(){
            $('.copy-url .result').text('').removeClass('success').removeClass('error');
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
            try {
              $('.copy-url .input').select();
              document.execCommand("copy");
              $('.copy-url .result').text('Page URL copied!').addClass('success');
            } catch(err) {
              $('.copy-url .result').text('Page URL not copied. Please select and copy with your keyboard.').addClass('error');
            }

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
          var default_item = 'continent=all';
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
                setTimeout(function(){
                  $(item).click();
                }, 1000);

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

        var elementsSticky = [
          {
            element: '.content-sidenav .block-views',
            off: '#footer',
            offset: '150',
            pinoffset: 'auto',
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
