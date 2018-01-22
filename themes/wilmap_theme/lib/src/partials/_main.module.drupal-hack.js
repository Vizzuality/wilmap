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
