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
        tablet_device_width:      900,  //From scss _settings.scss
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
     * get OS
     */
    getOS: function() {
      var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
      } else if (/Android/.test(userAgent)) {
        os = 'Android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
      }

      return os;
    },

    /**
    * Slugify Function
    */
    Slugify: function( arg ) {
      return arg
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .replace(/[àáâãäåąæā]/g,'a')
        .replace(/[èéêēëėę]/g,'e')
        .replace(/[íïìîįī]/g,'i')
        .replace(/[óºòöôõøœō]/g,'o')
        .replace(/[úüùûū]/g,'u')
        .replace(/[ç,ć,č]/g,'c')
        .replace(/[^\w\-]+/g, '');
    },

    /**
    * Clean HTML Function
    */
    CleanHTML: function( arg ) {
      return arg
        .toString()
        .trim()
        .replace(/<[^>]*>?/g, '')
        .replace(/"/g, '\'');
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
          // if (date_on_page.length > 0) {
          //   text_output = text_output + date_on_page.wrap().html();
          //   date_on_page.remove();
          // }

          text_output = text_output + '<br />';

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
            $(runON).parent().addClass('--with-contributors');
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
        App.DrupalHack.entriesFilterList.state_advanced_form = [];
        App.DrupalHack.entriesFilterList.last_active_checkbox_in_advanced = false;


        App.DrupalHack.entriesFilterList.separatorLayerShow = function(arg) {
          var filterDOM     = '.view-list-entries .view-filters';
          var fakeModalDOM  = '.fake-modal';

          if(arg === true) {
            if($(filterDOM).length > 0) {
              $(fakeModalDOM).addClass('invisible').addClass('active');
            }
          } else {
            if($(filterDOM).length > 0) {
              $(filterDOM + ' details.form-item').removeAttr('open');
              $(fakeModalDOM).removeClass('invisible').removeClass('active');

              if($(filterDOM + ' details.form-item.--changed').length > 0) {
                App.DrupalHack.entriesFilterList.autoSubmit();
              }
            }
          }
        }

        App.DrupalHack.entriesFilterList.isProcessing = function() {
          var ajaxSpinnerDOM = '.ajax-progress.ajax-progress-fullscreen';

          if ($(ajaxSpinnerDOM).length > 0) {
            return true;
          } else {
            return false;
          }
        }

        App.DrupalHack.entriesFilterList.checkLastActiveCheckbox = function(target) {
          var active_checbox_in_group = $('#' + target).parents('.details-wrapper').find('input:checked').length;

          if (active_checbox_in_group === 0) {
            return true;
          } else {
            return false;
          }
        }

        App.DrupalHack.entriesFilterList.autoSubmit = function(forze_reload) {
          var forze_reload = typeof forze_reload !== 'undefined' ? forze_reload : false;
          var page = (App.Utils.getUrlVar('page') === undefined)?0:App.Utils.getUrlVar('page');
          //App.DrupalHack.entriesFilterList.last_active_checkbox_in_advanced = true;


          console.log(forze_reload, page);

          if(forze_reload || page > 0) {
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
          var isPhone = (App.Utils.isMobile.Phone() || App.Utils.isMobile.Phone( 'desktop' ));
          var href = typeof href !== 'undefined' ? href : location.href.split('?')[0];
          var serialize = $(runON + ' .views-exposed-form').serialize();
          var listtype = (isPhone) ? '':'&listtype=' + $('.listswitch ._active').data('switch').toLowerCase();
          var out = href + '?' + serialize + listtype;

          return out;
        }

        App.DrupalHack.entriesFilterList.saveStateAdvancedFilters = function() {
          console.log('saveStateAdvancedFilters');
          App.DrupalHack.entriesFilterList.state_advanced_form = [];

          // Save state fields
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input, ' +
            runON + ' .views-exposed-form .form--modal .content-inner .form-item select').each(function(item, value) {
            var v_value = "";
            var v_text = "";
            var v_target = "";
            var v_type = "";
            var ok = false;

            switch ($(value).attr('type')) {
              case 'text':
                if($(value).val() !== '') {
                  ok = true;
                  v_value = $(value).val();
                  v_text = $(value).parent().find('label').text() + ': ' + $(value).val();
                  v_target = $(value).attr('id');
                  v_type = $(value).attr('type');
                }
                break;
              case 'checkbox':
                if($(value).is(':checked')) {
                  ok = true;
                  v_value = $(value).val();
                  v_text = $(value).parents('label').text();
                  v_target = $(value).attr('id');
                  v_type = $(value).attr('type');
                }
                break;
              default:
                // Select
                if($(value).prop('tagName').toLowerCase() === 'select') {
                  if($(value).val() !== 'All') {
                    ok = true;
                    v_value = $(value).val();
                    v_text = $(value).find('option:selected').text();
                    v_target = $(value).attr('id');
                    v_type = $(value).prop('tagName').toLowerCase();
                  } else {
                    ok = false;
                  }
                } else {
                  ok = false;
                }
                break;
            }

            if(ok){
              var obj = {'v_value':v_value, 'v_text':v_text, 'v_target':v_target, 'v_type':v_type};
              console.log('save: ' + obj);
              App.DrupalHack.entriesFilterList.state_advanced_form.push(obj);
            }
          });
        }

        App.DrupalHack.entriesFilterList.resetAdvancedFilters = function() {
          // Reset all fields
          //text
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input[type="text"]').val('');

          //checkbox
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input[type="checkbox"]').parent().find('span i').remove();
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input[type="checkbox"]').parent().removeClass('checked');
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input[type="checkbox"]').prop('checked', false).removeAttr('checked');

          //select
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item select').val($(runON + ' .views-exposed-form .form--modal .content-inner .form-item select option:first').val());
        }

        App.DrupalHack.entriesFilterList.revokesChangesAdvancedFilters = function() {
          console.log('revokesChangesAdvancedFilters');

          //Reset advanced form
          App.DrupalHack.entriesFilterList.resetAdvancedFilters();

          //Apply saved State
          $(App.DrupalHack.entriesFilterList.state_advanced_form).each(function(item, value) {
            console.log(value);

            switch (value.v_type) {
              case 'text':
              console.log($('#' + value.v_target));
                $('#' + value.v_target).val(value.v_value);
                break;
              case 'checkbox':
                console.log($('#' + value.v_target));
                $('#' + value.v_target).prop('checked', true);;
                $('#' + value.v_target).parents('label').addClass('checked');
                $('#' + value.v_target).parents('label span').append('<i class="icon-dot"></i>');
                break;
              case 'select':
              console.log($('#' + value.v_target + ' option[value="'+value.v_value+'"]'));
                $('#' + value.v_target + ' option[value="'+value.v_value+'"]').prop('selected', true);
                break;
              default:
                break;
            }
          });
        }

        App.DrupalHack.entriesFilterList.updateAdvancedFilters = function() {
          var advancedDOM = runON + ' .views-exposed-form .form--advanced';
          var advancedContentDOM = advancedDOM + ' .content';
          var cont = 0;

console.log('in updateAdvancedFilters');

          // Reset contents
          $(advancedContentDOM).empty();
          $(runON + ' .views-exposed-form .form--modal .content-inner details.form-item summary').text('NONE SELECTED');

          // Update contents
          $(runON + ' .views-exposed-form .form--modal .content-inner .form-item input, ' +
            runON + ' .views-exposed-form .form--modal .content-inner .form-item select').each(function(item, value) {

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
                }
                break;
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
                }
                break;
              default:
                // Select
                if($(value).prop('tagName').toLowerCase() === 'select') {
                  if($(value).val() !== 'All') {
                    ok = true;
                    v_text = $(value).find('option:selected').text();
                    v_target = $(value).attr('id');
                    v_type = $(value).prop('tagName').toLowerCase();

                    // if(v_target.indexOf('edit-region') > -1) {
                    //   v_text = 'Region: ' + v_text;
                    // }
                  } else {
                    ok = false;
                  }
                } else {
                  ok = false;
                }
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

            if(!App.DrupalHack.entriesFilterList.isProcessing()) {
              console.log('elimina porque no esta procesando');

              var type = $(this).parent().data('type');
              var target = $(this).parent().data('target');
              var forze_reload_form = false;

              // console.log('#'+target, type);
              // console.log($('#'+target).parent());

              switch (type) {
                case 'text':
                  $('#'+target).val('');
                  break;
                case 'checkbox':
                // $('.form--filter details .form-type-checkbox input').prop('checked', false).removeAttr('checked');
                // $('.form--filter details .form-type-checkbox input').parent().removeClass('checked');
                // $('.form--filter details .form-type-checkbox input').parent().find('span i').remove();
                //
                // $('.form--modal #'+target).click();

                  $('#'+target).prop('checked', false).removeAttr('checked');
                  $('#'+target).parent().removeClass('checked');
                  $('#'+target).parent().find('span i').remove();

                  // Check if is last active checkbox in a group for reload.
                  forze_reload_form = App.DrupalHack.entriesFilterList.checkLastActiveCheckbox(target);

                  break;
                case 'select':
                  $('#' + target).val($('#' + target + ' option:first').val());
                  break;
                default:
                  break;
              }

              // Update
              App.DrupalHack.entriesFilterList.updateAdvancedFilters();

              // Submit
              App.DrupalHack.entriesFilterList.autoSubmit(forze_reload_form);
            } else {
              console.log('NO elimina porque esta procesando');
            }
          });

          if(cont) {
            $(advancedDOM).show();
          } else {
            $(advancedDOM).hide();
          }
        };

        if ($(runON).length > 0) {
          if(!$(runON + ' .form--modal').length > 0) {
            //Prepare class-id for checkboxes
            $(runON + ' .form--inline > details.form-item').each(function(k, v){
              $(v).find('.form-checkboxes').parent().parent().addClass($(v).find('.form-checkboxes').attr('data-drupal-selector'));
            });

            $(runON + ' .views-exposed-form').append('<div id="modal-advanced-filter" class="form--modal modal"><div class="content"><a class="close switch" gumby-trigger="|#modal-advanced-filter">CLOSE</a><a style="display:none;" class="close_hidden switch" gumby-trigger="|#modal-advanced-filter">CLOSE_HIDDEN</a><h3>Advanced - Search</h3><div class="content-inner"><div class="date-selectors"></div></div><div class="modal-actions"><a href="#" class="btn modal-done">APPLY</a></div></div></div>');
            $(runON + ' .views-exposed-form').append('<div class="form--advanced" style="display: none;"><fieldset><legend>Active filters:</legend></fieldset><div class="content"></div></div>');

            $(runON + ' .views-exposed-form .form--modal .content-inner').append($(runON + ' .form--inline > .js-form-item').remove().wrap());
            $(runON + ' .views-exposed-form .form--modal .content-inner').append($(runON + ' .form--inline > details.form-item').remove().wrap());
            $(runON + ' .views-exposed-form .form--modal .content-inner .date-selectors').append($(runON + ' .views-exposed-form .js-form-item-fromyear').remove().wrap());
            $(runON + ' .views-exposed-form .form--modal .content-inner .date-selectors').append($(runON + ' .views-exposed-form .js-form-item-toyear').remove().wrap());
          }

          if(!$(runON + ' .form--inline .form--filter').length > 0) {
            $(runON + ' .views-exposed-form .form--inline').append('<div class="form--filter"><fieldset class="tit"><legend>Filter by:</legend></fieldset></div>');

            // Clone external filters
            console.log('clona filtros');
            $(runON + ' .views-exposed-form .form--modal .edit-claim').clone().appendTo(runON + ' .views-exposed-form .form--inline .form--filter');
            $(runON + ' .views-exposed-form .form--modal .edit-document').clone().appendTo(runON + ' .views-exposed-form .form--inline .form--filter');
            $(runON + ' .views-exposed-form .form--modal .form-item-country').clone().appendTo(runON + ' .views-exposed-form .form--inline .form--filter');

            // Modify external filters for avoid conficts
            $(runON + ' .views-exposed-form .form--filter .form-type-checkbox input, ' +
              runON + ' .views-exposed-form .form--filter select').each(function (i, v) {
              $(v).attr('name', 'clone--' + $(v).attr('name'));
              $(v).attr('id', 'clone--' + $(v).attr('id'));
            });

            // $(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-claim').remove().wrap());
            // $(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-document').remove().wrap());
            // $(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-country').remove().wrap());
            //$(runON + ' .views-exposed-form .form--inline .form--filter').append($(runON + ' .views-exposed-form .js-form-item-region').remove().wrap());
            $(runON + ' .views-exposed-form .form--inline .form--filter').append('<a href="#" id="advanced-btn" class="switch btn" gumby-trigger="#modal-advanced-filter">Advanced</a></p>');

            // Selects
            $(runON + '  .views-exposed-form .form--inline .form--filter .js-form-type-select').each(function(item, value){
              var label = $(this).find('label').text();

              // Clone first option
              $(this).find('select option:first').text('All');
              $(this).find('select').prepend($(this).find('select option:first').clone());

              // Label in option
              $(this).find('select option:first').text(label);
            });

            //Checkboxes selects
            $(runON + ' .views-exposed-form .content-inner details.form-item').each(function (item, value) {
              var summary_text = $(value).find('summary').text();
              $(value).find('summary').text('NONE SELECTED');
              $('<label>' + summary_text + '</label>').insertBefore(value);
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
          // filter select-checkbox
          $(runON + ' .views-exposed-form .form--inline .form--filter .form-item summary[role="button"]').on('click', function(e){
            if(!App.DrupalHack.entriesFilterList.isProcessing()) {
              App.DrupalHack.entriesFilterList.separatorLayerShow(true);
            } else {
              e.preventDefault();
              return false;
            }
          });

          // filter checkboxes
          $(runON + ' .views-exposed-form .form--filter details .form-type-checkbox').on('click', function(e){
            // Sync with modal checkbox
            var target = $(this).find('input').attr('id').split('edit-')[1];
            var state = $(this).find('input').prop('checked');

            $('.form--modal input#edit-'+target).prop('checked', state);

            // Indicates dropdown checkboxes are changed to reload form
            $(this).parents('details.form-item').addClass('--changed');

            setTimeout(function(){
              App.DrupalHack.entriesFilterList.updateAdvancedFilters();
            }, 50);
          });

          // modal checkboxes
          $(runON + ' .views-exposed-form .content-inner details .form-type-checkbox').on('click', function(e){
            console.log(e);
          //   var advancedContentDOM = runON + ' .views-exposed-form .form--advanced .content';
          //   App.DrupalHack.entriesFilterList.active_checkbox_in_advanced = $(advancedContentDOM + ' .advanced-tag[data-type="checkbox"]').length;
          //
            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();
          });

          // Selects
          $(runON + '  .views-exposed-form .form--inline .form--filter select, ' +
            runON + '  .views-exposed-form .form--inline .form--sort select').on('mouseenter', function(e){

            // Enable/Disable if is processing
            if(!App.DrupalHack.entriesFilterList.isProcessing()) {
              $(this).prop('disabled', false);
            } else {
              $(this).prop('disabled', true);
            }
          });

          $(runON + '  .views-exposed-form .form--inline .form--filter select, ' +
            runON + '  .views-exposed-form .form--inline .form--sort select').on('change', function(e){
            // Sync with modal
            if($(this).parents('.form--filter').length > 0) {
              var target = $(this).attr('id').split('edit-')[1];
              var value = $(this).find('option:selected').attr('value');

              $('.form--modal select#edit-' + target + ' option[value="' + value + '"]').prop('selected', true);
            }

            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();

            // AutoSubmit
            App.DrupalHack.entriesFilterList.autoSubmit();
          });

          // advanced button
          $(runON + ' .views-exposed-form a#advanced-btn').on('click', function(e){
            e.preventDefault();

            //Save state in advanced form
            App.DrupalHack.entriesFilterList.saveStateAdvancedFilters();
          });

          // close modal button
          $(runON + ' .views-exposed-form .form--modal a.close').on('click', function(e){
            e.preventDefault();

            //Revokes last changes in advanced form
            App.DrupalHack.entriesFilterList.revokesChangesAdvancedFilters();

            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();
          });

          // done button
          $(runON + ' .views-exposed-form .form--modal a.modal-done').on('click', function(e){
            e.preventDefault();

            // Update
            App.DrupalHack.entriesFilterList.updateAdvancedFilters();

            // Close modal
            $(runON + ' .views-exposed-form .form--modal a.close_hidden').click();

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

            var styles = ['blue','forest','olive','bronze','maroon','purple'];
            var fields_to_check = ['title', 'claim','document','section','issuing','issues_addressed','liability','law','service','osp_obligation','general_immunity','general_liability','fromyear','toyear','country'];
            var desc_output = 'Filtered by ';
            var serialize_row = App.DrupalHack.entriesFilterList.serializeForm('/map');
            var serialize_out = serialize_row.split('?')[0] + '?';
            var serialize_list = serialize_row.split('?')[1].split('&');

            //Parse
            console.log(serialize_row);

            var cur_field = '';
            var count_field = 0;
            var total_fields = 0;
            $.each(fields_to_check, function(h, j) {
              $.each(serialize_list, function(i, k) {

                var pair_serialize = k.split('=');

                if(j === pair_serialize[0].split('%')[0]) {
                  if(cur_field === j) {
                    count_field++;
                  } else {
                    cur_field = j;
                    count_field = 0;
                  }

                  if(pair_serialize[1] !== 'All' && pair_serialize[1] !== '') {
                    console.log(count_field, j, k, pair_serialize[1]);
                    var ampersan = (total_fields === 0)?'':'&';
                    total_fields++;

                    serialize_out += (count_field === 0)?ampersan + j + '=' + pair_serialize[1] : ',' + pair_serialize[1];
                  }
                }
              });
            });

            //generate layer desc
            if(total_fields == 0) {
              desc_output = 'Not filtered';
            } else {
              // Title
              var tit = $('input[name="title"]').val();
              if (tit !== '') {
                desc_output += 'keyword "'+tit+'"';
              }

              // Selects
              var tt = '';
              $(runON + ' .form--filter select option:selected').each(function(i, k){
                console.log(k);
                console.log($(k).parent().attr('name'));
                var is_country = ($(k).parent().attr('name') === 'country');
                if($(k).val() !== 'All') {
                  if(tt === '' && tit !== '') {
                    var t = (is_country)? ' in ' + $(k).text():' and ' + $(k).text();
                    tt = t;
                  } else if(tt === '' && tit === '') {
                    var t = (is_country)? 'in ' + $(k).text():$(k).text();
                    tt = t;
                  } else {
                    var t = (is_country)? ' in ' + $(k).text():', ' + $(k).text();
                    tt +=  t;
                  }
                }
              });
              desc_output += tt + '. ';

              // Advanced
              var tt = '';
              $(runON + ' .form--advanced .advanced-tag').each(function(i, k) {
                // console.log($(k).text());
                // var is_country = ($(k).parent().attr('name') === 'country');
                if($(k).text().indexOf('year') > -1) {
                  tt +=  ' ' + $(k).text().replace(' X','');
                } else {
                  var is_last = (i === $(runON + ' .form--advanced .advanced-tag').length - 1);
                  var is_first = (i === 0);

                  if(is_last) {
                    tt += ' and ' + $(k).text().replace(' X','') + '.';
                  } else if(is_first){
                    tt += $(k).text().replace(' X','');
                  } else {
                    tt += ', ' + $(k).text().replace(' X','');
                  }
                }
              });
              desc_output += tt;
            }

            console.log(desc_output);

            //add fromform, random style, title and desc
            serialize_out = serialize_out + '&layerid=fromform';
            serialize_out = serialize_out + '&layerstyle='+styles[Math.floor(Math.random()*styles.length)];
            serialize_out = serialize_out + '&layertitle=' + escape('Explore in Map');
            serialize_out = serialize_out + '&layerdesc=' + escape(desc_output);

            console.log(serialize_out);
            location.href = serialize_out;
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
        var dom_google_gadget = dom_google + ' .goog-te-gadget';

        //Init
        App.DrupalHack.google_translator = {};
        App.DrupalHack.google_translator.getGoogleObjLang = function(){
          var out = '';
          try {
            console.log('Intenta: google.translate.TranslateElement().c');
            out = google.translate.TranslateElement().c;
          } catch (err) {
            console.log(err);
            out = '';
          }

          console.log('App.DrupalHack.google_translator.getGoogleObjLang:' + out);
          return out;
        };

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
          if(!$( 'body' ).hasClass( 'theme-started' )) {
            //console.log('pasa por aqui porque no hay theme-started');
            setTimeout(function(){

              if($(dom_google).length > 0) {
                //console.log('HAY GOOGLE DOM, HAY SELECT? ' + $(dom_google_gadget).length);
                $(dom_google).addClass( 'picker' ).addClass( '__small' );

                var idlang = ($(dom_google_select + ' option:first-child').attr('value') === '')?'':App.DrupalHack.google_translator.getGoogleObjLang();
                var css_class = App.DrupalHack.google_translator.setData(idlang);

                //$(dom_google).addClass(css_class);
                $(dom).addClass('__processed').addClass('__show');

                //Event
                $(dom_google_select).on('focus', function(){
                  var idlang = ($(dom_google_select + ' option:first-child').attr('value') === '')?'':App.DrupalHack.google_translator.getGoogleObjLang();
                  var option = (idlang === '')?$(dom_google_select + ' option:first-child'):$(dom_google_select + ' option[value="' + idlang + '"]');

                  option.text(option.data('original'));

                  $(dom_google).removeClass('__small').addClass('__big');
                });

                $(dom_google_select).on('blur', function(e){
                  var idlang = ($(dom_google_select + ' option:first-child').attr('value') === '')?'':App.DrupalHack.google_translator.getGoogleObjLang();
                  var option = (idlang === '')?$(dom_google_select + ' option:first-child'):$(dom_google_select + ' option[value="' + idlang + '"]');

                  if(idlang === '') {
                    option.text('eng');
                  } else {
                    option.text(option.data('original').substring(0, 3));
                  }

                  $(dom_google).removeClass('__big').addClass('__small');
                });

                $(dom_google_select).on('change', function(e){
                  setTimeout(function(){
                    var idlang = App.DrupalHack.google_translator.getGoogleObjLang();
                    var css_class = App.DrupalHack.google_translator.setData(idlang);

                    $(dom_google).removeClass('__small').removeClass('__big').addClass(css_class);
                  }, 2000);
                });
              }
            }, 3800);
          } else {
            //console.log('pasa por aqui porque HAY theme-started');
            setTimeout(function(){
              $(dom_google_gadget + ' .picker').removeClass('picker');
              $(dom_google_gadget + ' .field').removeClass('field');
            }, 500);
          }
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
        this.methods.google_translator();
        App.DrupalHack.entriesFilterList.updateAdvancedFilters();
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

                    // Mark as processed
                    $(dom_sidemenu).addClass('__processed')
                    $(dom_content).parents('#content-content').addClass('__processed')
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
          // var iso = $('.metadata .field--name-field-iso2').text();
          // console.log('pinta mapa y centra en ' + iso);
          // $('#block-pagetitle div.image').attr('id', 'mapbanner');
          // var mapBanner = L.map('mapbanner', { zoomControl:false }).setView([51.505, -0.09], 4);
          // L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
          //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
          // }).addTo(mapBanner);

          // L.geoJson(geoContinents,
          // {
          //   style: function(feature) {
          //     return {
          //       fillColor: '#e4dfd3',
          //       fillOpacity: 1,
          //       color: '#e4dfd3',
          //       weight: 1,
          //       opacity: 1
          //     }
          //   }
          // }).addTo(mapBanner);
          //
          // L.geoJson(geoCountries,
          // {
          //   style: function(feature) {
          //     return {
          //       fillColor: '#e4dfd3',
          //       fillOpacity: 1,
          //       color: '#fff',
          //       weight: 2,
          //       opacity: 0.5
          //     }
          //   }
          // }).addTo(mapBanner);


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


