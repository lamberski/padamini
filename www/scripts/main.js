/*
 *  Padamini (July 2011)
 *  Crafted with passion by http://lamberski.com
 */
var PadaminiMain = {

  init: function() {
    this.performListingInfo();
    this.enableExternalLinks();
    this.enableInputAutofocus();
    this.performGridInfo();
    this.performConfirmationAnchors();
    this.performExternalAnchors();
    this.enableCloseMessageButtons();
    this.glowAffectedRows();

    // Boxy
    this.initBoxy();
    this.enableConfirmationModals();
    this.enableInformationModals();

    // JQuery UI
    this.enableDraggingOnList();
  },

  initBoxy: function() {

    Boxy.MODAL_OPACITY = 0.3;
    Boxy.DEFAULTS.hideShrink = false;
  },

  performListingInfo: function() {

    /*
     * Setting title attribute for each <dd> in .info
     */
    $(".listing-list .info dt").each(function() {
      currentDt = $(this);

      currentDt.next(":not([title])").attr("title", currentDt.text());
    });
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

  enableExternalLinks: function() {

    $(".external").attr("target", "_new");

    $(".form .external").bind("click", function() {

      // Submiting form to the new tab/window
      $("form")
        .attr("action", $(this).data("url"))
        .attr("target", "_new")
        .submit();

      // Restoring old values to attributes
      $("form")
        .attr("action", "")
        .attr("target", "_self");

      return false;
    });
  },

  enableInputAutofocus: function(element) {

    element = element || $("body").find(".field").first();

    if ($("[autofocus]").length == 0) {
      element.find("input[type=password]:visible, input[type=text]:visible, input[type=email]:visible, input[type=url]:visible, input[type=number]:visible, textarea:visible").first().focus();
    }
  },

  performGridInfo: function() {

    $(".listing-grid .actions a").bind("click", function() {
      $(this).parent().parent().parent().addClass("element-selected");
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

    $(".external").each(function() {
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

    $(".listing-sortable .element").disableSelection();
  },

  enableCloseMessageButtons: function() {

    $(".message .close").bind("click", function() {
      $(this).parent().animate({ opacity: 0 }, 200).slideUp(200);

      return false;
    });
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
  }

};

$(function() {
  PadaminiMain.init();
});