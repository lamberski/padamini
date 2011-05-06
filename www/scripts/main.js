/*
 *  Admin Panel Base JavaScripts (March 2011)
 *  Crafted with passion by http://lamberski.com
 */
var AdminBase = {

  init: function() {
    this.initBoxy();
    this.performListingInfo();
    this.enableConfirmationModals();
    this.enableExternalLinks();
  },

  initBoxy: function() {

    Boxy.MODAL_OPACITY = 0.3;
    Boxy.DEFAULTS.hideShrink = false;
  },

  performListingInfo: function() {

    /*
     * Setting title attribute for each <dd> in .element .info
     */
    $(".info dt").each(function() {
      currentDt = $(this);

      currentDt.next(":not([title])").attr("title", currentDt.text());
    });
  },

  enableConfirmationModals: function() {

    $(".confirmation").bind("click", function() {

      anchor = $(this);

      Boxy.ask(anchor.data("question"), ["OK", "Cancel"], function(response) {
        if (response == "OK") window.location.href = anchor.attr("href");
      });

      return false;
    });
  },

  enableExternalLinks: function() {

    $(".external").attr("target", "_new");

    $(".form .external").bind("click", function(){

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
  }

};

$(function() {
  AdminBase.init();
});
