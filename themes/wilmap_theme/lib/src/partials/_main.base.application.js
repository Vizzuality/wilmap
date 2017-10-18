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

        App.Application.Maps.Functions.resetActiveMap = function() {
          App.Application.Maps.Functions.activeContinent('none');
          App.Application.Maps.Functions.activeCountry('none');
          App.Application.Maps.Config.wilmap.closePopup(App.Application.Maps.Config.popup);
        };

        App.Application.Maps.Functions.showPopup = function(iso2, layer, coord) {
          if (App.Application.Maps.Data[iso2]) {
            var goto_button = (App.Application.Maps.Data[iso2].path)?'<a class="btn" href="' + App.Application.Maps.Data[iso2].path + '">GO TO COUNTRY PAGE</a>':'';
            var info_popup = '<p><strong>' + App.Application.Maps.Data[iso2].title + '</strong></p><p></p>';
            var output = '<div class="popup-inner"><div class="popup-inner-left"><span>00</span>Articles</div><div class="popup-inner-right"><div class="popup-info">' + info_popup + '</div><div class="popup-actions">' + goto_button + '</div></div></div>';

            App.Application.Maps.Config.popup = L.popup();
            App.Application.Maps.Config.popup.setLatLng(coord);
            App.Application.Maps.Config.popup.setContent(output);
            App.Application.Maps.Config.popup.openOn(App.Application.Maps.Config.wilmap);
          }
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
                  App.Application.Maps.Config.wilmap.fitBounds(layer.getBounds());
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
                  App.Application.Maps.Config.wilmap.fitBounds(layer.getBounds());
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
          var redraw = typeof redraw !== 'undefined' ? redraw : false;

          App.Application.Maps.Config.curr_layer_active = (layer === 'none')?null:layer;

          //Style layer color -- random temporally - FAKE
          var style = 'style' + (Math.floor(Math.random() * Object.keys(App.Application.Maps.Config.color_styles).length) + 1);
          var color_base = App.Application.Maps.Config.color_styles[style];


          $.each(geoCountries.features, function(index, value) {
            if(layer === 'none') {
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
        var api_countries = '/api/map/browse';

        if ($(dom).length > 0) {
          $(dom).attr('id','mapid');

          if (App.Application.Maps.Config.is_embed) {
            $(dom).width('100%');
            $(dom).height($(window).height());
          } else {
            $(dom).width($(window).width() - 349);
            $(dom).height($(window).height() - 78);
            $('.ui-autocomplete.ui-widget.ui-widget-content').height($(window).height() - 249);
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

          App.Application.Maps.Functions.loadLayer('none', false);


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
          if (!App.Application.Maps.Config.is_embed) {
            $(dom).append('<div class="actions"></div>');
            $(dom + ' .actions').append('<a href="#" class="btn" id="randomcolor">SIMULATE LOAD LAYER COLOR</a>');
            $(dom + ' .actions').append('<a href="#" class="btn" id="resetcolor">REMOVE COLOR</a>');

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

          }



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
                  output += '<li class="country-list-item region"><a href="' + vr.path + '">' + vr.title + '</a>';
                });
              }

              // Countries
              if (Object.keys(val.countries).length) {
                $.each( val.countries, function( kc, vc ) {
                  output += '<li class="country-list-item country"><a data-iso2="' + vc.iso2 + '" href="' + vc.path + '">' + vc.title + '</a>';
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
          $(dom_autocomplete + ' .continent-list-drawer .country-list-item').show();
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

                if(val.length > 2) {
                  App.Application.ListMaps.Functions.activeContinent('none');

                  $(dom_autocomplete + ' .continent-list-drawer').addClass('active');
                  $(dom_autocomplete + ' .continent-list-drawer .country-list-item').hide();

                  $(dom_autocomplete + ' .continent-list-drawer .country-list-item.country').filter(':contains("'+val+'")').show();
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
