/*
 *  Padamini (June 2011)
 *  Crafted with passion by http://lamberski.com
 */
var PadaminiMain = {

  init: function() {
    if (typeof Boxy != 'undefined') {
      this.initBoxy();
      this.enableConfirmationModals();
    }
    this.performListingInfo();
    this.enableExternalLinks();
    this.enableInputAutofocus();
    this.performGridInfo();
    this.performConfirmationAnchors();
    this.performExternalAnchors();
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

  enableConfirmationModals: function() {

    $(".confirmation").bind("click", function() {

      anchor = $(this);

      Boxy.ask(anchor.data("question"), [anchor.data("decline"), anchor.data("accept")], function(response) {
        if (response == anchor.data("accept")) window.location.href = anchor.attr("href");
      });

      // Styling main action button
      $("form.answers *")
        .addClass("button");

      // Styling main action button
      $("form.answers :last-child")
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

  enableInputAutofocus: function() {

    if ($("[autofocus]").length == 0) {
      $(".field").first().find("input, textarea").first().focus();
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
  }

};

$(function() {
  PadaminiMain.init();
});
