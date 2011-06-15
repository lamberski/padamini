/*
 *  Admin Panel Main JavaScripts (March 2011)
 *  Crafted with passion by http://lamberski.com
 */
var AdminMain = {

  init: function() {
    this.initBoxy();
    this.performListingInfo();
    this.enableConfirmationModals();
    this.enableExternalLinks();
    this.enableInputAutofocus();
    this.performGridInfo();
  },

  initBoxy: function() {

    Boxy.MODAL_OPACITY = 0.3;
    Boxy.DEFAULTS.hideShrink = false;
  },

  performListingInfo: function() {

    /*
     * Setting title attribute for each <dd> in .element .info
     */
    $(".listing .info dt").each(function() {
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
      $("form.answers :last-child")
        .addClass("main")
        .addClass(anchor.data("type"));

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
      $(".field input, .field textarea").first().focus();
    }
  },

  performGridInfo: function() {

    $(".grid .actions a").bind("click", function() {
      $(this).parent().parent().parent().addClass("selected");
    });

    unselect = function() {
      $(".grid .element.selected").each(function() {
        $(this).removeClass("selected");
      });
    }

    $(".boxy-wrapper .answers [type=\"button\"]").live("click", function() {
      unselect();
    });

    $(".grid .element, .grid").bind("mouseover", function() {
      unselect();
    });
  }

};

$(function() {
  AdminMain.init();
});
