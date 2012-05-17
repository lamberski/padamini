/*******************************************************************************
 *
 *  Padamini (May 2012)
 *  Crafted with passion by Maciek Lamberski (http://lamberski.com).
 *
 ******************************************************************************/

var Padamini = {

  /**
   * Execute all other methods.
   */
  init: function() {
    Padamini.addSubmitStateToButtons();
    Padamini.autofocusFirstField();
    Padamini.performListingInfo();
    Padamini.enableNewTabBehavior();
    Padamini.enableCloseMessageButtons();
    Padamini.glowAffectedRows();
    Padamini.enableDraggingOnList();
    Padamini.enableFormFilter();
    Padamini.initModals();
    Padamini.enablePreviewModal();
    Padamini.enableCLEdit();
    Padamini.enableTinyMCE();
  },

  addSubmitStateToButtons: function() {

    // Append hidden loader to show on submit
    $("form .buttons").each(function() {
      var buttons = $(this);
      buttons.find(".loader").remove();
      buttons.append($("<div>").addClass("loader loader-buttons").hide());
    });

    // Define function to toggle action loader
    var submitAnimation = function(button) {
      button
        .attr("disabled", true)
        .addClass("button-submitting");

      button.closest(".buttons").find(".loader")
        .fadeIn(250);
    }

    // Bind animation to modal window
    $(".modal .button-main").live("click", function() {
      var buttons = $(this).closest(".buttons");

      buttons.append(
        $("<div>").css({
          "position" : "absolute",
          "top"      : "0",
          "right"    : "0",
          "bottom"   : "0",
          "left"     : "0"
        })
      );

      submitAnimation(buttons.find(".button"));
    });

    // Bind animation to regular form
    $("form").submit(function(e) {
      var clicked = $(this).find("[clicked=true]");
      var buttons = $(this).find(".buttons");

      if (!clicked.data("behavior")) {
        buttons.append(
          $("<div>").css({
            "position" : "absolute",
            "top"      : "0",
            "right"    : "0",
            "bottom"   : "0",
            "left"     : "0"
          })
        );
        submitAnimation(buttons.find(".button:not([data-behavior])"));
      }
    });
    $("form button, form input[type=submit]").click(function() {
      $(this).closest("form").find("form button, form input[type=submit]").attr("clicked", "false");
      $(this).attr("clicked", "true");
    });
  },

  /**
   * Show/hide AJAX loader next to main heading
   */
  toggleAJAXLoader: function() {

    // Show loader
    if (!$(".loader-header").length) {
      $("<div>")
        .addClass("loader loader-header")
        .hide()
        .fadeIn(250)
        .insertAfter(".heading-page");

    // Hiding loader
    } else {
      $(".loader-header").fadeOut(250, function() {
        $(this).remove();
      });
    }
  },

  /**
   * Focus first input/textarea/select in the form
   */
  autofocusFirstField: function(element) {
    if ($("[autofocus]").length) return false;

    (element || $(".form .field").first())
      .find("input:visible, select:visible, textarea:visible")
      .first()
      .focus();
  },

  /**
   * Set title attribute for each <dd> in listing item' information
   */
  performListingInfo: function() {
    if (!$(".list").length) return false;

    $(".list .meta dt").each(function() {
      currentDt = $(this);

      currentDt
        .next(":not([title])")
        .attr("title", currentDt.text());
    });
  },

  /**
   * Confige elements with data-behavior="new-tab" to open in new browser
   * tab/window and forms to submit into new tab/window
   */
  enableNewTabBehavior: function() {

    // Add link action type indicator
    $("[data-behavior=new-tab]").each(function() {
      $(this).text($(this).text() + $('<div>').html(" &rarr;").text());
    });

    $("a[data-behavior=new-tab]").attr("target", "_new");

    $(".form .button[data-behavior=new-tab]").bind("click", function(e) {

      // Submit form into the new tab/window
      $(this).closest(".form")
        .attr("action", $(this).data("url"))
        .attr("target", "_new")
        .submit();

      // Restore old values to attributes
      $(this).closest(".form")
        .attr("action", "")
        .attr("target", "_self");

      e.preventDefault();
    });
  },

  /**
   * Add closing/hiding flash message boxes by clicking in close link
   */
  enableCloseMessageButtons: function() {
    if (!$(".message").length) return false;

    $(".message .close").bind("click", function(e) {
      $(this)
        .closest(".message")
        .animate({"opacity": 0}, 200)
        .slideUp(200, function() {
          $(this).animate({"margin-bottom": 0}, 200);
        });

      e.preventDefault();
    });
  },

  /**
   * Glow listing elements that changed in previous action
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

          // Highlight affected elements on list
          if (listing.hasClass("list")) {
            element
              .data("previous-background-color", element.css("background-color"))
              .addClass("element-affected")
              .animate({
                "background-color": element.data("previous-background-color")
              }, 3000, function() {
                element.removeClass("element-affected");
              });

          // Highlight affected elements on grid
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
   * Allow dragging list elements and submits new order to given URL
   */
  enableDraggingOnList: function() {

    // Add drag handle
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
   * Redirect to the new url specified in filter's data-url attribute
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

  /**
   * Redirect to the new url specified in filter's data-url attribute
   */
  initModals: function() {
    $("[data-behavior=confirmation], [data-behavior=information]").each(function() {
      var link = $(this);

      // Add link action type indicator
      link.text(link.text() + $('<div>').html("&hellip;").text());

      // Bind action to open modal window
      link.click(function(e) {
        var modal   = $("<div>").addClass("modal");
        var text    = $("<p>").text(link.data("message"))

        if (link.data("behavior") == "confirmation") {
          var buttons = $("<div>")
            .addClass("buttons")
            .append(
              $("<a>")
                .text(link.data("accept"))
                .addClass("button button-main button-" + link.data("type"))
                .click(function() {
                  window.location.href = link.attr("href");
                })
            )
            .append(
              $("<a>")
                .text(link.data("decline"))
                .addClass("button")
                .attr("rel", "modal:close")
            ).append(
              $("<div>")
                .addClass("loader loader-buttons")
                .hide()
            );
        }

        if (link.data("behavior") == "information") {
          var buttons = $("<div>")
            .addClass("buttons")
            .append(
              $("<a>")
                .text("OK")
                .addClass("button button-main")
                .attr("rel", "modal:close")
            );
        }

        modal
          .append(text)
          .append(buttons)
          .appendTo("body")
          .modal({
            "showClose"   : false,
            "escapeClose" : false,
            "clickClose"  : false,
            "overlay"     : "#eee",
            "opacity"     : .8,
            "zIndex"      : 1000
          });

        e.preventDefault();
      });
    });
  },

  /**
   * Open modal window with preview of data entered to form
   */
  enablePreviewModal: function() {
    $("[data-behavior=preview]").each(function() {
      var link = $(this);

      link.text(link.text() + $('<div>').html("&hellip;").text());

      link.click(function(e) {
        var link    = $(this);
        var modal   = $("<div>").addClass("modal");
        var iframe  = $("<iframe>").css("height", ($(window).height() * 70) / 100);

        // Disable scrolling of page while modal is open
        modal
          .on("modal:open", function() {
            var top = $(window).scrollTop();
            var left = $(window).scrollLeft()
            $("body, html").css("overflow", "hidden");
            $(window).scroll(function() {
              $(this).scrollTop(top).scrollLeft(left);
            });
          })
          .on("modal:before-close", function() {
            $("body, html").css("overflow", "auto");
            $(window).unbind("scroll");
          });

        $.post(link.data("url"), link.closest("form").serialize(), function(data) {
          iframe.contents().find("html").html(data);
        });

        var buttons = $("<div>")
          .addClass("buttons")
          .append(
            $("<a>")
              .text(link.data("close"))
              .addClass("button button-main")
              .attr("rel", "modal:close")
          );

        modal
          .append(iframe)
          .append(buttons)
          .appendTo("body")
          .modal({
            "showClose"   : false,
            "escapeClose" : true,
            "clickClose"  : true,
            "overlay"     : "#eee",
            "opacity"     : .8,
            "zIndex"      : 1000
          });

        e.preventDefault();
      });
    });
  },

  /**
   * Install CLEdit WYSIWYG plugin on textareas
   */
  enableCLEdit: function() {
    if ($("textarea.cleditor").length == 0) return false;

    $(".cleditor").each(function() {
      var area = $(this);

      if (area.attr("value") == "") {
        area.attr("value", "<p>&nbsp;</p>");
      }

      area
        .addClass("code")
        .cleditor({
          "width"    : area.outerWidth(),
          "height"   : area.outerHeight(),
          "controls" : "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | image link unlink | alignleft center alignright justify | source"
        });
    });

    // Resize textarea to prevent from bottom overflow
    $(".cleditorButton").live("click", function() {
      var area = $(this).closest(".cleditorMain").find("textarea");

      if (area.data("changed") != true) {
        area
          .css("height", area.outerHeight() - 8)
          .data("changed", true);
      }
    });
  },

  /**
   * Install TinyMCE WYSIWYG plugin on textareas
   */
  enableTinyMCE: function() {
    if ($("textarea.tinymce").length == 0) return false;

    $("textarea.tinymce").tinymce({
      // General options
      theme : "advanced",
      plugins : "autoresize,autolink,lists,advimage,inlinepopups,contextmenu,paste,visualchars,template,advlist",

      // Theme options
      theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,sub,sup,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
      theme_advanced_buttons2 : "link,unlink,image,|,forecolor,backcolor,|,bullist,numlist,|,outdent,indent,blockquote,|,removeformat,cleanup,code",
      theme_advanced_buttons3 : "",
      theme_advanced_buttons4 : "",
      theme_advanced_toolbar_location : "top",
      theme_advanced_toolbar_align : "left",
      theme_advanced_resizing : true,
      theme_advanced_resize_horizontal : false,

      // Custom CSS
      content_css : "",

      // Drop lists for link/image/media/template dialogs
      template_external_list_url : "lists/template_list.js",
      external_link_list_url : "lists/link_list.js",
      external_image_list_url : "lists/image_list.js",
      media_external_list_url : "lists/media_list.js"
    });
  }
};