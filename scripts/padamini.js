/*******************************************************************************
 *
 *  Padamini (January 2012) - jQuery implementation of Padmini
 *  Crafted with passion by Maciek Lamberski (http://lamberski.com).
 *
 ******************************************************************************/

var Padamini = {

  /**
   * Executes all other methods.
   */
  init: function() {
    Padamini.autofocusFirstField();
    Padamini.performListingInfo();
    Padamini.enableExternalLinks();
    Padamini.enableCloseMessageButtons();
    Padamini.addLinkTypeIndicators();
    Padamini.glowAffectedRows();
    Padamini.enableDraggingOnList();
    Padamini.enableFormFilter();
    Padamini.enableTinyMCE();
  },

  /**
   * Shows/hides AJAX loader next to main heading.
   */
  toggleAJAXLoader: function() {

    // Showing loader.
    if (!$(".loader-header").length) {
      $("<div>")
        .addClass("loader loader-header")
        .hide()
        .fadeIn(250)
        .insertAfter(".heading-page");

    // Hiding loader.
    } else {
      $(".loader-header").fadeOut(250, function() {
        $(this).remove();
      });
    }
  },

  /**
   * Focuses first input/textarea/select in the form.
   */
  autofocusFirstField: function(element) {
    if ($("[autofocus]").length) return false;

    (element || $(".form .field").first())
      .find("input:visible, select:visible, textarea:visible")
      .first()
      .focus();
  },

  /**
   * Sets title attribute for each <dd> in listing item' information.
   */
  performListingInfo: function() {

    $(".list .meta dt").each(function() {
      currentDt = $(this);

      currentDt
        .next(":not([title])")
        .attr("title", currentDt.text());
    });
  },

  /**
   * Configes links with rel="external" to open in new browser tab/window and
   * forms to submit into new tab/window.
   */
  enableExternalLinks: function() {

    $("[rel=external]").attr("target", "_new");

    $(".form .button[rel=external]").bind("click", function() {

      // Submiting form into the new tab/window
      $(".form")
        .attr("action", $(this).data("url"))
        .attr("target", "_new")
        .submit();

      // Restoring old values to attributes
      $(".form")
        .attr("action", "")
        .attr("target", "_self");

      return false;
    });
  },

  /**
   * Adds closing/hiding flash message boxes by clicking in close link.
   */
  enableCloseMessageButtons: function() {

    $(".message .close").bind("click", function() {
      $(this)
        .closest(".message")
        .animate({"opacity": 0}, 200)
        .slideUp(200, function() {
          $(this).animate({"margin-bottom": 0}, 200);
        });

      return false;
    });
  },

  /**
   * Adds ellipsis or arrow to indicate type of link.
   */
  addLinkTypeIndicators: function() {

    $(".confirmation").each(function() {
      $(this).text($(this).text() + $('<div>').html("&hellip;").text());
    });

    $("[rel=external]").each(function() {
      $(this).text($(this).text() + $('<div>').html(" &rarr;").text());
    });
  },

  /**
   * Glows listing elements that changed in previous action.
   */
  glowAffectedRows: function() {

    $("[data-affected-ids]").each(function() {
      var listing = $(this);
      var elements = $(this).data("affected-ids")
        .toString()
        .split(",");

      $(elements).each(function(index, key) {
        var element = listing.find("[data-id=" + key + "]");
        var image = element.find("img");

        if (element.length) {

          // Highlighting affected elements on list.
          if (listing.hasClass("list")) {
            element
              .data("previous-background-color", element.css("background-color"))
              .addClass("element-affected")
              .animate({
                "background-color": element.data("previous-background-color")
              }, 3000, function() {
                element.removeClass("element-affected");
              });

          // Highlighting affected elements on grid.
          } else if (listing.hasClass("grid")) {
            element
              .data("previous-background-color", element.css("background-color"))
              .addClass("element-affected")
              .animate({
                "background-color": element.data("previous-background-color"),
              }, 3000, function() {
                element.removeClass("element-affected");
              });

            image
              .data("previous-opacity", element.css("opacity"))
              .animate({
                "opacity": image.data("previous-opacity"),
              }, 3000);
          }
        }
      });
    });
  },

  /**
   * Allows dragging list elements and submits new order to given URL.
   */
  enableDraggingOnList: function() {

    // Adding drag handle.
    $("[data-sort-url] .element").each(function() {
      $("<div>")
        .prependTo($(this))
        .addClass("grip");
    });

    $("[data-sort-url]").sortable({
      revert: 200,
      containment: "parent",
      tolerance: "pointer",
      handle: ".grip",
      start: function(event, ui) {
        $(this).data("positions", $(this).find(".element")
          .map(function () { return $(this).data("position"); })
          .get());

        ui.item.addClass("element-dragged");

        $(".element-locked", this).each(function() {
          $(this).data("pos", $(this).index());
        });
      },
      stop: function(event, ui) {
        ui.item.removeClass("element-dragged");
      },
      cancel: ".element-locked",
      change: function(event, ui) {
        sortable = $(this);
        statics = $(".element-locked", this).detach();
        helper = $("<li></li>").prependTo(this);
        statics.each(function() {
          $(this).insertAfter($("> li", sortable).eq($(this).data("pos")));
        });
        helper.remove();
      },
      update: function(event, ui) {
        var previous = $(this).data("positions")
        var current = {};

        $(this).find(".element").each(function(index, value) {
          $(this).data("position", previous[index]);
          current[$(this).data("id")] = previous[index];
        });

        Padamini.toggleAJAXLoader();

        // Update DB data with new order.
        $.get($(this).data("sort-url"), { positions: current }, function() {
          Padamini.toggleAJAXLoader();
        });
      },
    });

    $("[data-sort-url] .grip").disableSelection();
  },

  /**
   * Redirects to the new url specified in filter's data-url attribute.
   */
  enableFormFilter: function() {

    $(".filter-form *").bind("change", function() {
			if ($(this).is("select")) {
	      window.location.href = $(this).find("option:selected").data("url");
			} else {
	      window.location.href = $(this).data("url");
			}
    });
  },

	enableTinyMCE: function() {
		tinyMCE.init({
      mode: "textareas",
      editor_selector :"tinymce",
      theme: "advanced",
			theme_advanced_toolbar_location: "top",
			theme_advanced_toolbar_align: "center",
      theme_advanced_buttons1: "bold,italic,underline,strikethrough,forecolor,|,blockquote,sub,sup,|,bullist,numlist,link,unlink,image,|,formatselect,removeformat,undo,redo,|,code",
      theme_advanced_buttons2: "",
      theme_advanced_buttons3: "",
      theme_advanced_resizing: true

/*
			formats: {
				alignleft : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'left'},
				aligncenter : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'center'},
				alignright : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'right'},
				alignfull : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'full'},
				bold : {inline : 'span', 'classes' : 'bold'},
				italic : {inline : 'span', 'classes' : 'italic'},
				underline : {inline : 'span', 'classes' : 'underline', exact : true},
				strikethrough : {inline : 'del'},
			}
*/


		});
	},











  initBoxy: function() {

    Boxy.MODAL_OPACITY = 0.3;
    Boxy.DEFAULTS.hideShrink = false;
  },

  enableInformationModals: function() {

    $(".information").bind("click", function() {
      anchor = $(this);

      Boxy.ask(anchor.data("message"), [anchor.data("accept")]);

      // Styling main action button
      $(".boxy-inner form.answers *")
        .addClass("button button-main");

      return false;
    });
  },

  enableConfirmationModals: function() {

    $(".confirmation:not(.information)").bind("click", function() {
      anchor = $(this);

      Boxy.ask(anchor.data("question"), [anchor.data("decline"), anchor.data("accept")], function(response) {
        if (response == anchor.data("accept")) window.location.href = anchor.attr("href");
      });

      // Styling main action button
      $(".boxy-inner form.answers *")
        .addClass("button");

      // Styling main action button
      $(".boxy-inner form.answers :last-child")
        .addClass("button-main button-" + anchor.data("type"));

      return false;
    });
  },




/*
  performGridInfo: function() {

    $(".listing-grid .actions a").bind("click", function() {
      $(this).closest("element").addClass("element-selected");
    });

    unselect = function() {
      $(".listing-grid .element-selected").each(function() {
        $(this).removeClass("element-selected");
      });
    }

    $(".boxy-wrapper .answers [type=\"button\"]").live("click", function() {
      unselect();
    });

    $(".listing-grid .element, .listing-grid").bind("mouseover", function() {
      unselect();
    });
  },
*/






  enableJWYSIWYG: function() {

    // Initializing jWYSIWYG with default options
    $(".jwysiwyg").wysiwyg({
      initialContent:   "<p>&thinsp;</p>",
      css:              $("link[href*='jwysiwyg']").attr("href"),
      autoGrow:         true,
      rmUnwantedBr:     true,
      rmUnusedControls: false,

      controls: {
        insertHorizontalRule: { visible: false },
        insertImage:          { visible: false },
        insertTable:          { visible: false },
        h1:                   { visible: false },
        code:                 { visible: false },
        indent:               { visible: false },
        outdent:              { visible: false },
        undo:                 { visible: false },
        redo:                 { visible: false },
        html:                 { visible: true },
        increaseFontSize:     { visible: true },
        decreaseFontSize:     { visible: true }
      }
    });

    // Place controls in specific order
    $("ul.toolbar").each(function() {
      var toolbar = $(this);

      toolbar.find(".superscript + li").appendTo(toolbar);
      toolbar.find(".redo").appendTo(toolbar);
      toolbar.find(".undo").appendTo(toolbar);
      toolbar.find(".removeFormat + li").appendTo(toolbar);
      toolbar.find(".removeFormat").appendTo(toolbar);
    });
  }

};