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

    $.each(this, function(key, value) {
      if (key != "init") value();
    });
  },

  /**
   * Sets title attribute for each <dd> in listing item' information.
   */
  performListingInfo: function() {

    $(".listing-list .info dt").each(function() {
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
   * Adds closing/hiding flash message boxes  by clicking in close link.
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



  enableInputAutofocus: function(element) {

    element = element || $(".field").first();

    if ($("[autofocus]").length == 0) {
      element.find("input:visible, select:visible, textarea:visible").first().focus();
    }
  },

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

  performConfirmationAnchors: function() {

    $(".confirmation").each(function() {
      $(this).text($(this).text() + $('<div/>').html("&hellip;").text());
    });
  },

  performExternalAnchors: function() {

    $("[rel=external]").each(function() {
      $(this).text($(this).text() + $('<div/>').html(" &rarr;").text());
    });
  },

  enableDraggingOnList: function() {

    // Adding drag handle to normal list
    $(".listing-list.listing-sortable .element").each(function() {
      $("<div/>")
        .prependTo($(this))
        .addClass("drag");
    });

    // Adding drag handle to grid list
    $(".listing-grid.listing-sortable .element").each(function() {
      $("<div/>")
        .appendTo($(this))
        .addClass("drag");
    });

    $(".listing-sortable").sortable({
      revert: 200,
      containment: "parent",
      tolerance: "pointer",
      handle: ".drag",
      start: function(event, ui) {
        $(this).data("positions", $(this).find(".element")
          .map(function () { return $(this).data("position"); })
          .get());

        $(".element-locked", this).each(function(){
          $(this).data("pos", $(this).index());
        });
      },
      cancel: ".element-locked",
      change: function() {
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

        // Update db data with new order
        $.get($(this).data("sort-url"), { positions: current });
      },
    });

    $(".listing-sortable .drag").disableSelection();
  },

  glowAffectedRows: function() {

    $(".listing").each(function() {
      var listing = $(this);
      var elements = $(this).data("affected-ids");

      if (elements) {
        elements = elements.toString().match(/^.*,.*$/) ? elements.split(",") : elements;
      }

      $(elements).each(function(index, key) {
        var element = listing.find("[data-id=" + key + "]");

        // Highlighting affected elements on list
        if (element.length) {
          if (listing.hasClass("listing-list")) {
            element
              .data("previous-background-color", element.css("background-color"))
              .addClass("element-affected");

            element.animate({
                "background-color": element.data("previous-background-color")
              }, 3000, function() {
                element.removeClass("element-affected");
              });
          } else if (listing.hasClass("listing-grid")) {
            var image = element.find("img");

            element
              .data("previous-background-color", element.css("background-color"))
              .addClass("element-affected");

            element.animate({
                "background-color": element.data("previous-background-color"),
              }, 3000, function() {
                element.removeClass("element-affected");
              });

            image
              .data("previous-opacity", element.css("opacity"));

            image.animate({
                "opacity": image.data("previous-opacity"),
              }, 3000);
          }
        }
      });
    });
  },

  enableSelectFilters: function() {

    $(".filters-select").bind("change", function() {
      window.location.href = $(".filters-select option:selected").data("url");
    });
  },

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