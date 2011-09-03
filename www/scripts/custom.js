/*
 *  Project-Name (Month YYYY or Version)
 *  Crafted with passion by http://lamberski.com
 */
var PadaminiCustom = {

  init: function() {
    this.enableJWYSIWYG();
  },

  enableJWYSIWYG: function() {

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

    // Moving "Undo", "Redo", "Remove formatting" and separator to the end of toolbar
    $("ul.toolbar").each(function() {
      var toolbar = $(this);
      toolbar.find(".superscript + li").appendTo(toolbar);
      toolbar.find(".redo").appendTo(toolbar);
      toolbar.find(".undo").appendTo(toolbar);
      toolbar.find(".removeFormat + li").appendTo(toolbar);
      toolbar.find(".removeFormat").appendTo(toolbar);
    });

    $("div.wysiwyg").each(function() {
      $(this).attr("rel", $(this).next().attr("name"));
    });
  }

};

$(function() {
  PadaminiCustom.init();
});