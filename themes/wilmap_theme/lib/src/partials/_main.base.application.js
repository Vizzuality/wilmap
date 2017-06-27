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
       * Main search
       */
      mainSearch: function() {
        var dom = '.search-block-form';

        if ($(dom).length > 0) {
          $(dom + ' .form-actions').hide();

          $(dom + ' input[type="search"]').attr('placeholder', 'Search').bind("keypress", function (e) {
            // prevent submit on press enter key
            if (e.keyCode == 13) {
              return false;
            }
          });
        }
      },

      /**
       * Sharethis
       */
      shareThis: function() {
        var dom = 'a[data-action="share"]';
        var output = '';

        if ($(dom).length > 0) {
          output += '<div class="modal" id="modal-share">';
          output += '  <div class="content">';
          output += '    <a class="close switch" gumby-trigger="|#modal-share"><i class="icon-cancel" /></i></a>';
          output += '      <h3>Sharing</h3>';
          output += '      <div class="content-inner">';
          output += '         <section class="tabs">';
          output += '           <ul class="tab-nav">';
          output += '             <!-- <li><a href="#">Share Page</a></li> -->';
          output += '             <!-- <li><a href="#">Embed map</a></li> -->';
          output += '           </ul>';
          output += '           <div class="tab-content active">';
          //output += '               <script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.9";fjs.parentNode.insertBefore(js, fjs);}(document, \'script\', \'facebook-jssdk\'));</script>';
          //output += '               <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script>';
          output += '             <a class="btn sharebutton fb" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse">Share on facebook</a>';
          output += '             <a class="btn sharebutton twitter" target="_blank" href="https://twitter.com/share?url=https%3A%2F%2Fdev.twitter.com%2Fweb%2Ftweet-button&via=twitterdev&related=twitterapi%2Ctwitter&hashtags=example%2Cdemo&text=custom%20share%20text">Share on twitter</a>';
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
