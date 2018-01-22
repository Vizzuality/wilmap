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

            // click on fake-modal to close filters
            $(".fake-modal").on('click', function(e){
              App.DrupalHack.entriesFilterList.separatorLayerShow(false);
            });
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
            App.DrupalHack.entriesFilterList.separatorLayerShow(false);

            $(dom).addClass('active');
            $(bgseparator).addClass('active');
            $(dom_autocomplete).removeClass('__kill');

            // hide google translator
            App.DrupalHack.google_translator.show(false);
          });

          $(dom + ' input[type="search"]').on('blur', function() {
            $(dom).removeClass('active');
            $(bgseparator).removeClass('active');

            // show google translator
            App.DrupalHack.google_translator.show(true);
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
        App.Application.Maps.CountryData = {};
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
        App.Application.Maps.Config.count_entries               = {min:0, max:0, counts:{}};
        App.Application.Maps.Config.color_active                = '#b3001e';
        App.Application.Maps.Config.color_border                = '#f7f6f2';
        App.Application.Maps.Config.color_inactive              = '#e4dfd3';
        App.Application.Maps.Config.bounds                      = new L.LatLngBounds(new L.LatLng(83.6567687988283, 180.00000000000034), new L.LatLng(-90, -179.99999999999994));
        App.Application.Maps.Config.initial_view                = [51.505, -0.09];
        App.Application.Maps.Config.is_embed                    = (window.location.href.indexOf('/widgets/map' || App.Utils.isIframe()) > -1);
        App.Application.Maps.Config.color_styles                = {'blue':'#035e7e','forest':'#325735','olive':'#484d0c','bronze':'#554324','maroon':'#5b1717','purple':'#31244a','base':'#676156'};
        App.Application.Maps.Config.click_on_map                = false;
        App.Application.Maps.Config.isPhone                     = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));
        App.Application.Maps.Config.isTable                     = (App.Utils.isMobile.Tablet() || App.Utils.isMobile.Tablet( 'desktop' ));
        App.Application.Maps.Config.sidebar_offset_v            = 116;
        App.Application.Maps.Config.sidebar_offset_h            = 90;
        App.Application.Maps.Config.sidebar_offset_h_tablet     = 15;


        App.Application.Maps.Functions.choropleth = function(color, currVal, minVal, maxVal, steps) {
          var steps = typeof steps !== 'undefined' ? steps : 5;
          var output_color = '';

console.log(color, currVal, minVal, maxVal, steps);

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

          // Invert color scale. Lighten is less value.
          percentColor = 100 - parseInt(percentColor);

          // Adjust colors/contrast
          var adjustPercent = percentColor;

          switch (adjustPercent) {
            case 80:
              adjustPercent = 100;
              break;
            default:
              adjustPercent = adjustPercent * 1.25;
              break;
          }

          //sets lighten
          output_color = App.Utils.shadeColor(color, adjustPercent);

          // save color scale
          App.Application.Maps.Config.curr_layer_active.colorscale[percentColor] = output_color;

          console.log("cl: " + currVal + ' | '  + percentValue + ' | ' + percentColor + ' | ' + color + ' | ' + output_color);

          //If value is 0 set color transparent;
          if(currVal == 0){
            output_color = 'transparent';
          }

          return output_color
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
              var layerid = val.nid[0].value;
              var style = (val.field_style.length > 0)?val.field_style[0].value:'forest';
              var title = (val.title.length > 0)?App.Utils.CleanHTML(val.title[0].value):'';
              var desc = (val.body.length > 0)?App.Utils.CleanHTML(val.body[0].value):'';;

              output_layers += '<li class="layer-item field">';
              output_layers += '<label class="checkbox" for="layer-item-'+key+'" data-layerid="'+layerid+'" data-layer-style="'+style+'" data-layer-title="'+title+'" data-layer-desc="'+desc+'"><input type="checkbox" id="layer-item-'+key+'" name="layer-item[]" value="'+layerid+'"' + checked + '><span></span> '+title+'</label>';
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
              output += '      </div>';
              output += '      <div class="modal-actions"><a href="#" class="btn modal-clear">Clear</a><a href="#" class="btn modal-done">Apply</a></div>';
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

              //Close
              $('#' + DOM + ' a.close').on('click', function(e) {
                var layerid = App.Utils.getUrlVar('layerid');


                if(layerid !== 'fromform' || layerid !== '') {
                  $('#' + DOM + ' label.checkbox[data-layerid="'+layerid+'"] input').prop('checked', true);
                  $('#' + DOM + ' label.checkbox[data-layerid="'+layerid+'"] span').append('<i class="icon-check"></i>');
                  $('#' + DOM + ' label.checkbox[data-layerid="'+layerid+'"]').addClass('checked');
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

              // clear button
              $('#' + DOM + ' .modal-actions a.modal-clear').on('click', function(e) {
                e.preventDefault();

                //clear
                $('#' + DOM + ' label.checkbox.checked i.icon-check').remove();
                $('#' + DOM + ' label.checkbox.checked input').prop('checked', false); ;
                $('#' + DOM + ' label.checkbox.checked').removeClass('checked');

                App.Application.Maps.Functions.resetActiveMap()
                App.Application.Maps.Functions.loadLayer('none', true);

                $('#' + DOM + '  a.close').click();
              });
            };
          });
        };

        App.Application.Maps.Functions.mapLegend = function() {
          var DOM = 'map-legend';
          var output = '';

          if ( !$('#' + DOM).length > 0 ) {
            output += '<div id="'+DOM+'">';
            output += '  <a class="toggle active" gumby-trigger="#' + DOM + '-drawer"><i class="icon-up-open-big"></i></a>';
            output += '  <div class="drawer active" id="' + DOM + '-drawer">';
            output += '    <div class="drawer-inner">';
            output += '      <h3></h3>';
            output += '      <div class="description"></div>';
            output += '      <div class="color-ranges"></div>';
            output += '    </div>';
            output += '  </div>';
            output += '</div>';

            // Write modal in body
            $(dom).append(output);
            Gumby.init();
            $('#' + DOM).hide();

            $('#map-legend').on('mouseover click', function(e){
              App.Application.Maps.Config.wilmap.doubleClickZoom.disable();
            });

            $('#map-legend').on('mouseout', function(e){
              App.Application.Maps.Config.wilmap.doubleClickZoom.enable();
            });
          }

          if (App.Application.Maps.Config.curr_layer_active !== null) {
            // Generate colorange
            var colorange = '';
            var count = 0;
            var total = Object.keys(App.Application.Maps.Config.curr_layer_active.colorscale).length;

            colorange += '<ul class="segments-' + total + '">';

            $.each(Object.assign([],App.Application.Maps.Config.curr_layer_active.colorscale).reverse(), function(k, v) {
              //console.log(k, v);

              if( v !== undefined ) {
                var value = 0;

                switch (count) {
                  case 0:
                    value = 1;
                    break;
                  case total - 1:
                    value = App.Application.Maps.Config.count_entries.max;
                    break;
                  default:
                    if(total % 2 === 1 && total > 4) {
                      if (count === parseInt((total / 2))) {
                        value = parseInt(App.Application.Maps.Config.count_entries.max / 2);
                      } else {
                        value = '&nbsp;';
                      }
                    } else {
                      value = '&nbsp;';
                    }
                    break;
                }

                colorange += '<li style="width: ' + ((100/total) - 2) + '%; margin: 0 1%;"><div class="color" style="background-color:' + v + '; opacity: 0.5; z-index: 20;"></div><div class="color base"></div><div class="text">' + value + '</div></li>';

                count++;
              }
            });

            colorange += '</ul>';

            // Show info
            $('#' + DOM + ' h3').text(App.Application.Maps.Config.curr_layer_active.title);
            $('#' + DOM + ' .description').html(App.Application.Maps.Config.curr_layer_active.description);
            $('#' + DOM + ' .color-ranges').empty().html(colorange);

            $('#' + DOM).show();
            $('#' + DOM + ' .toggle').addClass('active');
            $('#' + DOM + ' .drawer').addClass('active');
          } else {
            $('#' + DOM).hide();
          }
        };

        App.Application.Maps.Functions.showPopup = function(iso2, layer, coord) {
          var API = '/api/country/data/iso2/' + iso2;
          var popup_dom = '.leaflet-popup';

          // Init
          App.Application.Maps.Functions.popUpReorientation = function(coord){
            var popup_dom = '.leaflet-popup';
            var orientation_h = '';
            var orientation_v = '';
            var dist_top = parseInt(Math.abs(App.Application.Maps.Config.wilmap.getBounds()['_northEast'].lat - coord.lat));
            var dist_left = parseInt(Math.abs(App.Application.Maps.Config.wilmap.getBounds()['_southWest'].lng - coord.lng));
            var dist_bottom = parseInt(Math.abs(App.Application.Maps.Config.wilmap.getBounds()['_southWest'].lat - coord.lat));
            var dist_right = parseInt(Math.abs(App.Application.Maps.Config.wilmap.getBounds()['_northEast'].lng - coord.lng));

            // Orientation
            // console.log(coord);
            // console.log('dist_top: ' + dist_top);
            // console.log('dist_left: ' + dist_left);
            // console.log('dist_bottom: ' + dist_bottom);
            // console.log('dist_right: ' + dist_right);

            //// Vertical
            if(dist_top > dist_bottom) {
              orientation_v = '__top';
            } else {
              orientation_v = '__bottom';
            }

            //// Horizontal
            if(dist_left > dist_right) {
              orientation_h = '__right';
            } else {
              orientation_h = '__left';
            }

            // console.log(orientation_h + ', ' + orientation_v);

            $(popup_dom).addClass(orientation_h).addClass(orientation_v);
          };

          if(App.Application.Maps.Config.curr_layer_active !== null) {
            API = API + '?' + App.Application.Maps.Config.curr_layer_active.query;
          }

          if (App.Application.Maps.CountryData[iso2]) {
            $.getJSON( API, function( data ) {
              console.log(App.Application.Maps.Config.count_entries);

              var realCount = parseInt(App.Application.Maps.Config.count_entries.counts[iso2].entries);
              realCount = (realCount < 10) ? '0' + realCount : realCount;

              var total = 0;
              // console.log('al montar esto: ' + App.Application.Maps.Config.is_embed);
              var target_button = (App.Application.Maps.Config.is_embed)?' target="_blank"':'';
              var goto_button = (App.Application.Maps.CountryData[iso2].path)?'<a class="btn" href="' + App.Application.Maps.CountryData[iso2].path + '"' + target_button + '>GO TO COUNTRY PAGE</a>':'';
              var info_popup = '<p><strong>' + App.Application.Maps.CountryData[iso2].title + '</strong></p><ul>';

              $.each( data.values, function( key, val ) {
                // console.log(val);

                total = total + parseInt(val.count);
                info_popup += '<li><span class="count">' + val.count + '</span> ' + val.label + '</li>';
              });

              var other_total = parseInt(realCount) - total;

              info_popup += '<li><span class="count">' + other_total + '</span> Other</li>';
              info_popup += '</ul>';

              var output = '<div class="popup-inner"><div class="popup-inner-left"><span>'+realCount+'</span>Entries</div><div class="popup-inner-right"><div class="popup-info">' + info_popup + '</div><div class="popup-actions">' + goto_button + '</div></div></div>';

              if(App.Application.Maps.Config.isPhone && !App.Application.Maps.Config.is_embed) {
                $('#mobile-popup .inner').empty().html(output);
                $('#mobile-popup').addClass('active');
              } else {
                App.Application.Maps.Config.popup = L.popup();
                App.Application.Maps.Config.popup.setLatLng(coord);
                App.Application.Maps.Config.popup.setContent(output);
                App.Application.Maps.Config.popup.openOn(App.Application.Maps.Config.wilmap);

                App.Application.Maps.Functions.popUpReorientation(coord);
              }
            });
          } else {
            setTimeout(function(){
              var output = '<div class="popup-inner"><div class="popup-inner-right"><div class="popup-info"><i class="icon-attention"></i> No data available for this country</div></div></div>';

              if(App.Application.Maps.Config.isPhone) {
                $('#mobile-popup .inner').empty().html(output);
                $('#mobile-popup').addClass('active');
              } else {
                App.Application.Maps.Config.popup = L.popup();
                App.Application.Maps.Config.popup.setLatLng(coord);
                App.Application.Maps.Config.popup.setContent(output);
                App.Application.Maps.Config.popup.openOn(App.Application.Maps.Config.wilmap);

                $(popup_dom).addClass('__no-data');

                App.Application.Maps.Functions.popUpReorientation(coord);
              }
            }, 300);
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
          var DOM_LAYERS = '#modal-maplayer';

          var redraw = typeof redraw !== 'undefined' ? redraw : false;

          layer = { layerid:layer, query:'', title:'', description:'', style:'base', colorscale:{} };

          if (layer.layerid !== 'none') {
            App.Application.Maps.Config.curr_layer_active = layer;

            if (App.Application.Maps.Config.curr_layer_active.layerid === 'fromform') {
              var url = window.location.href;

              App.Application.Maps.Config.curr_layer_active.title = (url.indexOf('layertitle') > -1) ? unescape(App.Utils.getUrlVar('layertitle')) : '';
              App.Application.Maps.Config.curr_layer_active.description = (url.indexOf('layerdesc') > -1) ? unescape(App.Utils.getUrlVar('layerdesc')) : '';
              App.Application.Maps.Config.curr_layer_active.style = (url.indexOf('layerstyle') > -1) ? App.Utils.getUrlVar('layerstyle') : Object.keys(App.Application.Maps.Config.color_styles)[0];
              App.Application.Maps.Config.curr_layer_active.query = url.split('?')[1];

              App.Application.Maps.Functions.applyLayerOverMap();
            } else {
              // Change URL
              App.Utils.setBrowserURL('?layerid=' + App.Application.Maps.Config.curr_layer_active.layerid, document.title);

              // Get query
              $.getJSON( API_LAYER, function( data ) {
                //console.log(data);
                var l = $(DOM_LAYERS + ' label[data-layerid="' + App.Application.Maps.Config.curr_layer_active.layerid + '"]');

                App.Application.Maps.Config.curr_layer_active.title = l.data('layer-title');
                App.Application.Maps.Config.curr_layer_active.description = l.data('layer-desc');
                App.Application.Maps.Config.curr_layer_active.style = l.data('layer-style');
                App.Application.Maps.Config.curr_layer_active.query = data.query;

                App.Application.Maps.Functions.applyLayerOverMap();
              });
            }
          } else {
            if (App.Application.Maps.Config.curr_layer_active !== null) {
              // Change URL
              App.Utils.setBrowserURL('/map', document.title);
            }

            // Paint default data
            // App.Application.Maps.Config.curr_layer_active = null;
            App.Application.Maps.Config.curr_layer_active = layer;
            App.Application.Maps.Functions.applyLayerOverMap();
          }
        };

        App.Application.Maps.Functions.applyLayerOverMap = function() {
          var query = (App.Application.Maps.Config.curr_layer_active !== null) ? App.Application.Maps.Config.curr_layer_active.query : '';
          var API_QUERY = '/api/countries/entries/count?' + query;

console.log(">>>>>>>");
console.log(App.Application.Maps);

          // Load country country count
          console.log('load and apply query count -> ' + API_QUERY);
          $.getJSON( API_QUERY, function( data ) {
            // Prepare data
            // console.log(query);
            // if (App.Application.Maps.Config.curr_layer_active !== null) {
              App.Application.Maps.Config.count_entries.min = 0;
              App.Application.Maps.Config.count_entries.max = 0;
              App.Application.Maps.Config.count_entries.counts = data;

              // get max and min
              $.each(App.Application.Maps.Config.count_entries.counts, function(e, d) {
                //console.log(parseInt(d.entries), App.Application.Maps.Config.count_entries.min, App.Application.Maps.Config.count_entries.max);
                if(parseInt(d.entries) <= App.Application.Maps.Config.count_entries.min) {
                  App.Application.Maps.Config.count_entries.min = parseInt(d.entries);
                }

                if(parseInt(d.entries) >= App.Application.Maps.Config.count_entries.max) {
                  App.Application.Maps.Config.count_entries.max = parseInt(d.entries);
                }
              });
            // }

            // Set colors from data
            $.each(geoCountries.features, function(index, value) {
              if (App.Application.Maps.Config.curr_layer_active === null) {
                value.properties.color = 'transparent';
              } else {
                var maxVal = App.Application.Maps.Config.count_entries.max;
                var minVal = App.Application.Maps.Config.count_entries.min;
                var currVal = (App.Application.Maps.Config.count_entries.counts[value.properties.iso2] !== undefined) ? parseInt(App.Application.Maps.Config.count_entries.counts[value.properties.iso2].entries) : 0;
                var color_base = App.Application.Maps.Config.color_styles[App.Application.Maps.Config.curr_layer_active.style];

                value.properties.color = App.Application.Maps.Functions.choropleth(color_base, currVal, minVal, maxVal);
              }
            });

            // Apply colors
            App.Application.Maps.Config.basemapcolor.eachLayer(function (layer) {
              layer.setStyle({
                fillColor: layer.feature.properties.color
              });
            });

            // Call legend map
            App.Application.Maps.Functions.mapLegend();
          });
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
                 // console.log('- ISO2 selected: ' + l.feature.properties.iso2);

                 if (App.Application.Maps.CountryData[l.feature.properties.iso2]) {
                   App.Application.Maps.Config.click_on_map = true;

                   App.Application.Maps.Functions.activeContinent(App.Application.Maps.CountryData[l.feature.properties.iso2].continent, true, true);
                   App.Application.Maps.Functions.activeCountry(l.feature.properties.iso2, true, false);
                   App.Application.Maps.Functions.showPopup(l.feature.properties.iso2, '', e.latlng);
                 } else {
                   App.Application.Maps.Functions.showPopup('empty', '', e.latlng);
                 }
               }
             });
            }
          }).addTo(App.Application.Maps.Config.wilmap);
        };

        // Set size & resize map
        App.Application.Maps.Functions.mapContainerSize = function() {
          if (App.Application.Maps.Config.is_embed) {
            $(dom).width('100%');
            $(dom).height($(window).height());
            $(dom).addClass('__embed');
          } else {
            if (App.Application.Maps.Config.isPhone) {
              $(dom).width($(window).width());
              $(dom).height($(window).height() - $(dom_footer).height() - $(dom_header).height());
              $(dom_sidebar).height('1000px');
              $(dom_sidebar).addClass('__hide');
            } else if(App.Application.Maps.Config.isTable){
              $(dom).width($(window).width() - App.Application.Maps.Config.sidebar_offset_h_tablet);
              $(dom).height($(window).height() - $(dom_footer).height());
              $(dom_sidebar).height($(window).height() - $(dom_footer).height() - $(dom_header).height() - App.Application.Maps.Config.sidebar_offset_v);
              $(dom_sidebar).addClass('__hide');
            } else {
              $(dom).width($(window).width() - $(dom_sidebar).width() + App.Application.Maps.Config.sidebar_offset_h);
              $(dom).height($(window).height() - $(dom_footer).height());
              $(dom_sidebar).height($(window).height() - $(dom_footer).height() - $(dom_header).height() - App.Application.Maps.Config.sidebar_offset_v);
              $(dom_sidebar).addClass('__hide');
            }
          }

          // Resize trigger
          $( window ).on( 'resize', function(){
            App.Application.Maps.Functions.mapContainerSize();
          });
        }

        // INIT
        var dom = '.block-wilmap-map .wilmap';
        var dom_sidebar = '.ui-autocomplete.ui-widget-content';
        var dom_footer = '.site-footer';
        var dom_header = '.site-header';
        var dom_search = 'body.node-map .site-header .search-block-form';
        var api_countries = '/api/map/browse';
        var offset_sidebar = 116;


        if ($(dom).length > 0) {
          // Generate Layer modal
          App.Application.Maps.Functions.generateLayerModal();

          // Map dimensions
          $(dom).attr('id','mapid');
          App.Application.Maps.Functions.mapContainerSize();

          // Init map
          App.Application.Maps.Config.wilmap = L.map('mapid', {
            center: App.Application.Maps.Config.bounds.getCenter(),
            zoom: 5,
            minZoom: 2,
            maxZoom: 7,
            maxBounds: App.Application.Maps.Config.bounds,
            maxBoundsViscosity: 0.75
          });

          // url mapzoom and mapcenter?
          var setzoom = (window.location.href.indexOf('mapzoom=') > -1) ? parseInt(App.Utils.getUrlVar('mapzoom')) : 3;
          var setcenter = (window.location.href.indexOf('mapcenter=') > -1) ? [ App.Utils.getUrlVar('mapcenter').split(',')[0], App.Utils.getUrlVar('mapcenter').split(',')[1] ] : App.Application.Maps.Config.initial_view;

          // Set view
          App.Application.Maps.Config.wilmap.setView(setcenter, setzoom);

          // Preparing Initial Data
          $.getJSON( api_countries, function( data ) {
            $.each( data, function( key, val ) {
              var continent = val.title;

              // Countries
              if (Object.keys(val.countries).length) {
                $.each( val.countries, function( kc, vc ) {
                  var obj = {'id':kc,'title':vc.title,'path':vc.path,'continent':continent};
                  //console.log(obj);
                  App.Application.Maps.CountryData[vc.iso2] = obj;
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

          // Logo on map
          var style_logo = (App.Application.Maps.Config.is_embed) ? ' style="display:block;"' : ' style="display:none;"';
          $(dom).append('<div class="wilmap-logomap"' + style_logo + '><a href="/" title="Home" target="_blank">WilMap</a></div>');


          // Action buttons && mobile tooltip placeholder
          var style_actions = (App.Application.Maps.Config.is_embed) ? ' style="display:none;"' : ' style="display:block;"';
          $(dom).append('<div id="mobile-popup" class="drawer"><div class="content"><a class="close switch" gumby-trigger="#mobile-popup"><i class="icon-close"></i></a><div class="inner"></div></div></div><div class="actions"' + style_actions + '></div>');
//            $(dom + ' .actions').append('<a href="#" class="btn" id="randomcolor">SIMULATE LOAD LAYER COLOR</a>');
//            $(dom + ' .actions').append('<a href="#" class="btn" id="resetcolor">REMOVE COLOR</a>');
          $(dom + ' .actions').append('<a class="btn" id="calllist" href="#">List</a>');
          $(dom + ' .actions').append('<a class="btn" href="#" data-action="share" data-embed="true">Share</a>');


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

          $('#calllist').on('click', function(e){
            $(dom_sidebar).addClass('__insearch').addClass('__calllist').removeClass('__hide');
            $(dom_header).addClass('active');
            $(dom_header + ' .region-primary-menu').addClass('active');
            $(dom_header + ' span.str').parent().addClass('active');
            $(dom_header + ' span.str').text('Close');

            // hide google translator
            App.DrupalHack.google_translator.show(false);

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
        var dom_datenode = '.node-date';
        var items_group = 2;

        if ($(dom).length > 0) {
          // Reset field
          $(dom + ' .field').removeClass().addClass('field');

          // add date if exists
          if ($(dom_datenode).length > 0) {
            var t_datenode = $(dom_datenode).remove().text();
            $(dom).append('<div class="field field-node-date"><div class="field__label">Date updated</div><div class="field__item">' + t_datenode + '</div></div>');
          }

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
              $(dom).append('<div class="datasheet-actions"><a href="#" class="btn">See all tags</a></div>');
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
        var dom_search = 'body.node-map .site-header .search-block-form';
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
              //console.log($(this).text() + ' - ' + t);
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
            output = '<li id="back"><h3><a href="#"><i class="icon-left-open-big"></i><span>List</span></a></h3></li>';


            $.each( data, function( key, val ) {
              output += '<li class="continent-list-item" id="continent-list-item-' + key + '"><a class="continent toggle" gumby-trigger="#countries-continent-' + key + '" href="#">' + val.title + '</a>';
              output += '<ul class="continent-list-drawer drawer" id="countries-continent-' + key + '">';

              // Regions
              if (Object.keys(val.regions).length) {
                $.each( val.regions, function( kr, vr ) {
                  output += '<li class="country-list-item region"><a data-original="' + vr.title + '" href="' + vr.path + '" tabindex="-1">' + vr.title + '</a>';
                });
              }

              // Countries
              if (Object.keys(val.countries).length) {
                $.each( val.countries, function( kc, vc ) {
                  output += '<li class="country-list-item country"><a data-original="' + vc.title + '" data-iso2="' + vc.iso2 + '" href="' + vc.path + '" tabindex="-1">' + vc.title + '</a>';
                });
              }

              output += '</ul>';
              output += '</li>';
            });

            // Print list in DOM
            $(dom).append(output);

            // Scroll tunning in non apple devices
            console.log(App.Utils.getOS());
            if(App.Utils.getOS() === 'Windows' || App.Utils.getOS() === 'Linux') {
              $(dom).css('overflow-y', 'hidden');
              // var el = $('.ui-widget-content.ui-autocomplete');
              var el = document.querySelector('.ui-widget-content.ui-autocomplete');
              console.log(el);
              SimpleScrollbar.initEl(el);
            }

            // Events
            Gumby.init();

            $(dom).on('mouseover', function (e) {
              if(!App.Application.Maps.Config.isPhone && !App.Application.Maps.Config.isTable) {
                $(dom).addClass('__insearch').removeClass('__hide').removeClass('__calllist');
                $(dom_search).addClass('active');

                // hide google translator
                App.DrupalHack.google_translator.show(false);
              }
            });

            $(dom).on('mouseout', function (e) {
              if(!App.Application.Maps.Config.isPhone && !App.Application.Maps.Config.isTable) {
                $(dom).addClass('__hide').removeClass('__insearch').removeClass('__calllist');
                $(dom_search).removeClass('active');

                // show google translator
                App.DrupalHack.google_translator.show(true);
              }
            });

            $(dom + ' #back a').on('click', function (e) {
              var search_dom = '#block-searchform';
              var header_dom = '.site-header';

              if(App.Application.Maps.Config.isTable) {
                if($(dom).hasClass('__hide')) {
                  $(search_dom).addClass('active');
                  $(dom).addClass('__insearch').removeClass('__hide').removeClass('__calllist');
                  $(dom + ' #back a i').removeClass('icon-left-open-big').addClass('icon-right-open-big');

                  // hide google translator
                  App.DrupalHack.google_translator.show(false);
                } else {
                  $(search_dom).removeClass('active');
                  $(dom).addClass('__hide').removeClass('__insearch').removeClass('__calllist');
                  $(dom + ' #back a i').removeClass('icon-right-open-big').addClass('icon-left-open-big');

                  // show google translator
                  App.DrupalHack.google_translator.show(true);
                }
              } else {
                $(search_dom).removeClass('active');
                $(dom).addClass('__hide').removeClass('__insearch').removeClass('__calllist');

                if($(header_dom).hasClass('active')){
                  $(header_dom + ' a.toggle').click();
                }
              }

              e.preventDefault();
            });

            $('.continent-list-item a.continent').on('click', function (e) {
              var target = $(this).text();

              if (!$(this).hasClass('active')){
                App.Application.Maps.Functions.resetActiveMap();

                setTimeout(function(){
                  App.Application.Maps.Functions.activeContinent(target, true, true);
                }, 200);

              } else {
                App.Application.Maps.Functions.resetActiveMap();

                setTimeout(function(){
                  $('.continent-list-drawer.active').removeClass('active');
                  $('.continent-list-item a.continent.active').removeClass('active');
                }, 200);
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
                  if ($(dom_autocomplete + ' .continent-list-drawer.active').length > 0) {
                    var tar = $(dom_autocomplete + ' .continent-list-drawer .country-list-item a.active');
                    if(tar.length > 0){
                      location.href = tar.attr('href');
                      e.preventDefault();
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
              });

              $(dom + ' input[type="text"]').bind("keyup", function (e) {
                if(e.keyCode == 38 || e.keyCode == 40) {
                  if ($(dom_autocomplete + ' .continent-list-drawer.active').length > 0) {
                    var list = $(dom_autocomplete + ' .continent-list-drawer .country-list-item a:visible');
                    var total_visible = list.length;
                    var pos_active = null;
                    var dir = (e.keyCode == 38)?'up':'down';

                    $(list).each(function(k, i) {
                      if($(i).hasClass('active')){
                        $(i).removeClass('active');
                        pos_active = k;
                      }
                    });

                    if(pos_active === null) {
                      if(dir === 'up') {
                        $(list).last().addClass('active');
                      } else {
                        $(list).first().addClass('active');
                      }
                    } else {
                      if(dir === 'up') {
                        $($(list)[pos_active - 1]).addClass('active');
                      } else {
                        $($(list)[pos_active + 1]).addClass('active');
                      }
                    }
                  }
                } else {
                  var val = $(this).val();

                  if(val.length > 0) {
                    App.Application.ListMaps.Functions.activeContinent('none');

                    $(dom_autocomplete + ' .continent-list-drawer').addClass('active');
                    $(dom_autocomplete + ' .continent-list-drawer .country-list-item').hide();

                    $(dom_autocomplete + ' .continent-list-drawer .country-list-item').each(function(k, v){
                      var re = new RegExp( "(\\b" + val + ")", "gi" );
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
                }
              });

              $(dom + ' input[type="text"]').on('focus', function() {
                $(dom).addClass('active');
                $(dom_autocomplete).removeClass('__kill').removeClass('__hide').addClass('__insearch');

                // hide google translator
                App.DrupalHack.google_translator.show(false);
              });

              $(dom + ' input[type="text"]').on('blur', function() {
                App.Application.ListMaps.Functions.activeContinent('none');
                App.Application.countrySearchMaps.Functions.resetList();
                $(this).val('');
                $(dom).removeClass('active');
                $(dom_autocomplete).removeClass('__insearch').addClass('__hide');

                // show google translator
                App.DrupalHack.google_translator.show(true);
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
            bigitem: '.panel-block .view-content .views-row',
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
            var is_map = (App.Application.Maps.Config.wilmap === null) ? false : true;

            $(modal + ' .sharebutton.fb').attr('href', facebook_url);
            $(modal + ' .sharebutton.twitter').attr('href', twitter_url);
            $(modal + ' #share-input input.input').val(url_to_share);
            $(modal + ' #share-textarea textarea.input').val(embed_code);

            //if is_map get map coords
            if (is_map) {
              var map_coords = '&mapzoom='+App.Application.Maps.Config.wilmap.getZoom()+'&mapcenter='+App.Application.Maps.Config.wilmap.getCenter().lat+','+App.Application.Maps.Config.wilmap.getCenter().lng;

              url_to_share = url_to_share.split('&mapzoom=')[0];
              url_to_share = url_to_share + ((url_to_share.indexOf('?') > -1) ? '':'?') + map_coords

              facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' + escape(url_to_share);
              twitter_url = 'https://twitter.com/share?url=' + escape(url_to_share);
              url_to_embed = 'http://dev-wilmap.pantheonsite.io/widgets/map/' + ((url_to_share.indexOf('?') > -1) ? '?' + url_to_share.split('?')[1] : '');
              embed_code = '<iframe width="600" height="400" src="'+ url_to_embed +'"></iframe>';

              $(modal + ' .sharebutton.fb').attr('href', facebook_url);
              $(modal + ' .sharebutton.twitter').attr('href', twitter_url);
              $(modal + ' #share-input input.input').val(url_to_share);
              $(modal + ' #share-textarea textarea.input').val(embed_code);
            }

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

            var str = ($(this).parent().attr('id') === 'share-textarea') ? 'Embed code' : 'Page URL';

            try {
              $('.copy-url .input').select();
              document.execCommand("copy");
              console.log($(this).parent().attr('id'));
              $('.copy-url .result').text(str + ' copied!').addClass('success');
            } catch(err) {
              $('.copy-url .result').text(str + ' not copied. Please select and copy with your keyboard.').addClass('error');
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
        var dom_list_countries = 'body.node-map .ui-autocomplete';

        if ($(dom).length > 0) {
          $(dom + ' a.toggle').on(Gumby.click, function(e) {
            if($(dom).hasClass('active')){
              $(dom).removeClass('active');
              $(dom + ' span.str').text('Menu');

              // show google translator
              App.DrupalHack.google_translator.show(true);
            } else {
              $(dom).addClass('active');
              $(dom + ' span.str').text('Close');

              // hide google translator
              App.DrupalHack.google_translator.show(false);
            }

            //If list map is open
            if(!$(dom_list_countries).hasClass('__hide')){
              $(dom_list_countries).addClass('__hide').removeClass('__insearch').removeClass('__calllist');
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
          sidemenu += '          <div class="views-row"><a class="skip" gumby-duration="600" gumby-goto="top" href="#" gumby-update>Description</a></div>';

          $(dom_entries + ' h3').each(function(i, item) {
            var offset = (isPhone)?'-10':'-140';
            var slug = App.Utils.Slugify($(this).text());

            $(this).addClass('country-block-title').attr('id','entry-block-' + slug);

            sidemenu += '          <div class="views-row"><a class="skip" gumby-offset="' + offset + '" gumby-duration="600" gumby-goto="#entry-block-' + slug + '" href="#entry-block-' + slug + '" gumby-update>' + $(this).text() + '</a></div>';

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
        var dom_search_in_explore =  dom_content + ' .metadata .site-btn';
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

          var enabled = ($('article.node').hasClass('node--empty') && !$('.fields-datasheet').length > 0)?'__disabled':'__enabled';
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

          // Move Search in explore button to sidebar
          if($(dom_search_in_explore).length > 0) {
            $(dom_sidemenu + ' section').append($(dom_search_in_explore).remove().wrap());
          }

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
          $('#block-pagetitle').prepend('<div class="node-top"><div class="field--name-field-location-entry">'+country+'</div></div>');

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
            strings: 'Grid|List',
            default_active: 'on', //on is first position, off second position
            url_param: 'listtype', //empty for not active
          }
        ];

        var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));

        $.each( elementsSwitch, function( index, value ) {
          if ( $(value.element).length > 0 && $(value.insert_dom).length > 0 ) {
            var re = new RegExp( "(" + switch_onoff + ")(\\w+)", "g" );
            re = $(value.element).attr('class').match(re);
            var curr_state = (value.url_param !== '' && App.Utils.getUrlVar(value.url_param) !== undefined)
                             ? App.Utils.getUrlVar(value.url_param)
                             : (re !== null)?re[0].split('-')[1] : value.default_active;
            var active_on = (curr_state === 'on')? 'class="_active" ' : '';
            var active_off = (curr_state === 'off')? 'class="_active" ' : '';

            outputHTML += '<div class="' + switch_class + '">';
            outputHTML += '<a href="#" ' + active_on + 'data-switch="on" data-urlparam="' + value.url_param + '" data-target="' + value.element + '">' + value.strings.split('|')[0] + '</a>';
            outputHTML += ' / ';
            outputHTML += '<a href="#" ' + active_off + 'data-switch="off" data-urlparam="' + value.url_param + '" data-target="' + value.element + '">' + value.strings.split('|')[1] + '</a>';
            outputHTML += '</div>';

            if(!$(value.insert_dom + ' .' + switch_class).length > 0) {
              if(value.insert_position === 'top') {
                $(value.insert_dom).prepend(outputHTML);
              } else {
                $(value.insert_dom).append(outputHTML);
              }
            }

            if($(value.element).attr('class').indexOf(switch_onoff) === -1) {
              // $(value.element).addClass(switch_onoff + value.default_active);
              $(value.element).addClass(switch_onoff + curr_state);
            }
          }
        });

        // Events
        $('.' + switch_class + ' a').on('click', function(e) {
          if(!$(this).hasClass('_active')) {
            $(this).parent().find('a').removeClass('_active');
            $(this).addClass('_active');

            $($(this).data('target')).removeClass(switch_onoff + 'on').removeClass(switch_onoff + 'off');
            $($(this).data('target')).addClass(switch_onoff + $(this).data('switch'));

            if($(this).data('urlparam') !== ''){
              var url_param = $(this).data('urlparam');
              var url = location.href;
              var curr_param = (App.Utils.getUrlVars()[url_param] !== undefined)?'&' + url_param + '=' + App.Utils.getUrlVars()[url_param]:url_param;
              var new_param = '&' + url_param + '=' + $(this).data('switch').toLowerCase();

              url = (url.indexOf('?') > -1)?url:url + '?';
              url = url.split(curr_param)[0] + new_param + ((url.split(curr_param)[1] !== undefined)?url.split(curr_param)[1]:'');

              App.Utils.setBrowserURL(url);
            }
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


          // If reload page for initialize mobile
          // if( App.Utils.isDesktop() && App.curResponsiveClass !== nextResponsiveClass ) {
          if( App.curResponsiveClass !== nextResponsiveClass ) {
            location.reload();
            console.log('Responsive Reloaded')
          }
        });

        // Orientarion trigger
        $( window ).on( "orientationchange", function() {
          App.Utils.AddResponsiveBodyClasses();
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
      } else {
        // If page reload
        this.methods.bigLinkAreas();
        this.methods.listSwitch();
      }

      // log
      console.log( 'App.Application Running' );

    }

  };
