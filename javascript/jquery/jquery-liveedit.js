(function ($) { 
  $.fn.liveEdit = function(options) {
    
    var opts = $.extend({
      afterSaveAll: function(event, params) {},
      doubleClick: function(event, element, selectedNode) {}
    }, $.fn.liveEdit.defaults, options);
    var editableElements = [];
    var sideBar, saveButton, textOptions, boldButton, italicButton, quoteButton, savedSelection, lastType;
    
    var setContentEditable = function(element) {
      $(element).attr("contenteditable", "true");
    };
    
    var preventAnchorClick = function(element){
      $(element).find("a").click(function(event){
        event.preventDefault();
      });
    };

    var showTextOptions = function() {
      var selectedText = window.getSelection();
      var range = selectedText.getRangeAt(0);
      var boundary = range.getBoundingClientRect();
      textOptions.addClass("appear");
      textOptions.css("top", boundary.top - (textOptions.height()+8) + window.pageYOffset + "px");
      textOptions.css("left", (boundary.left + boundary.right)/2 - (textOptions.width()/2) + "px");
    };
    
    var hideTextOptions = function() {
      textOptions.removeClass("appear");
      textOptions.css("top", "-999px");
      textOptions.css("left", "-999px");
    };
    
    var updateTextOptions = function(selectedText) {
      if ($(selectedText.focusNode).closest("b").length > 0) {
        textOptions.addClass("bold");
      } else {
        textOptions.removeClass("bold");
      }
      if ($(selectedText.focusNode).closest("i").length > 0) {
        textOptions.addClass("italic");
      } else {
        textOptions.removeClass("italic");
      }
      if ($(selectedText.focusNode).closest("li").length > 0) {
        textOptions.addClass("unorderedlist");
      } else {
        textOptions.removeClass("unorderedlist");
      }
      if ($(selectedText.focusNode).closest("strike").length > 0) {
        textOptions.addClass("strikethrough");
      } else {
        textOptions.removeClass("strikethrough");
      }
      if ($(selectedText.focusNode).closest("a").length > 0) {
        textOptions.addClass("url");
      } else {
        textOptions.removeClass("url");
      }
    };
    
    var getSelectionStart = function() {
      var node = document.getSelection().anchorNode,
          startNode = (node && node.nodeType === 3 ? node.parentNode : node);
      return startNode;
    }
    
    var processSelectedText = function(event) {
      var selectedText = window.getSelection();
      createParagraphAfterFigures();
      unwrapSpans($(selectedText.focusNode).closest("[data-editable=true]"));
      if ($(event.target).closest(".text-options").length > 0) {
        updateTextOptions(selectedText);
        return;
      }
      if ($(selectedText.focusNode).closest("[data-editable=true]").length > 0 && $(selectedText.focusNode).closest("figure").length == 0) {
        if (getSelectionStart().children.length === 0 &&
            $(selectedText.focusNode).closest("[data-text-options=true]").length > 0 &&
            $(selectedText.focusNode).closest("li").length == 0 &&
            $(selectedText.focusNode).closest(".caption").length == 0) {
          document.execCommand("formatBlock", false, "p");
        }
        if (selectedText.isCollapsed === true && lastType === false) {
          hideTextOptions();
        }
        if (selectedText.isCollapsed === false) {
          if ($(selectedText.focusNode).closest("[data-text-options=true]").length > 0) {
            showTextOptions();
            updateTextOptions(selectedText);
          }
        } else {
          hideTextOptions();
        }
      } else {
        hideTextOptions();
      }
      lastType = selectedText.isCollapsed;
    };
    
    var boldButtonClick = function(){
      document.execCommand("bold", false);
    };
    
    var italicButtonClick = function(){
      document.execCommand("italic", false);
    };
    
    var strikethroughButtonClick = function() {
      document.execCommand("strikethrough", false);
    };
    
    var unorderedListButtonClick = function() {
      document.execCommand("insertunorderedlist", false);
      hideTextOptions();
      unwrapUnorderedlist();
    };
    
    var urlButtonClick = function() {
      if (!textOptions.hasClass("edit-url")) {
        textOptions.addClass("edit-url");
        setTimeout(function() {
          var selectedText = window.getSelection();
          if ($(selectedText.focusNode).closest("a").length > 0) {
            $(urlField).find("input").val($(selectedText.focusNode).closest("a").attr("href"));
          } else {
            document.execCommand("createLink", false, "/");
          }
          lastSelection = window.getSelection().getRangeAt(0);
          lastType = false;
          $(urlField).find("input").focus();
        }, 100);
      } else {
        textOptions.removeClass("edit-url");
      }
    };
    
    var rehighlightLastSelection = function() {
      window.getSelection().addRange(lastSelection);
    };
    
    var applyURL = function(url) {
      rehighlightLastSelection();
      document.execCommand("unlink", false);
      if (url !== "") {
        if (!url.match("^(http|https)://")) {
          url = "http://" + url;
        }
        document.execCommand("createLink", false, url);
      }
    };
    
    var handlePaste = function(element) {
      $(element).on("paste", function(event){
        event.preventDefault();
        if ($(element).data("max-length")) { return; }
        if (event.originalEvent.clipboardData && event.originalEvent.clipboardData.getData) {
          var html = "";
          var paragraphs = event.originalEvent.clipboardData.getData("text/plain").split(/[\r\n]/g);
          for (p = 0; p < paragraphs.length; p += 1) {
            if (paragraphs[p] !== "") {
              html += "<p>" + paragraphs[p] + "</p>";
            }
          }
          document.execCommand("insertHTML", false, html);
          setTimeout(function() {
            unwrapSpans(element);
          }, 10);
        }
      });
    };
    
    var handleDoubleClick = function(element) {
      $(element).on("dblclick", function(){
        setTimeout(function() {
          var selectedText = window.getSelection();
          if (selectedText.isCollapsed === true) {
            return opts.doubleClick.call(this, element, selectedText);
          }
        }, 10);
      });
    };
    
    var createParagraphAfterFigures = function() {
      $.each(editableElements, function(index, element) {
        $(element).find("[data-editable=true]").each(function(){
          if ($(this).data("text-options") == true) {
            $(this).find("figure").each(function(){
              if ($(this).next("p").length === 0) {
                $(this).after("<p><br></p>");
              }
            });
          }
        }); 
      });
    };
    
    var unwrapSpans = function(element) {
      $(element).find("span").each(function(){
        if (!$(this).hasClass("caption")) {
          $(this).contents().unwrap();
        }
      });
    };
    
    var unwrapUnorderedlist = function() {
      $.each(editableElements, function(index, element) {
        $(element).find("[data-editable=true]").each(function(){
          $(this).find("ul").each(function(){
            if ($(this).parent("p").length) {
              $(this).parent("p").contents().unwrap();
            }
          });
        });
      });
    };
    
    var saveAll = function(){
      var params = [];
      $.each(editableElements, function(index, element) {
        var item = {};
        var model = $(element).data("model");
        var id = $(element).data("id").toString();
        var url = $(element).data("url");
        item["model"] = model;
        item["id"] = id;
        item["url"] = url;
        $(element).find("[data-editable=true]").each(function(){
          var name = $(this).data("name");
          var content = $(this).html().replace(/\n/g, "").trim();
          item[name] = content;
        });
        params.push(item);
      });
      return opts.afterSaveAll.call(this, params);
    };
    
    var createUI = function() {
      sidebarInterface = '<div class="live-edit-sidebar" draggable="true">'
        + '<a href="#" class="save-button">' + opts.saveButtonLabel +'</a>'
        + '</div>';
      textOptionsInterface = '<span class="text-options">'
        + '<button class="url-button">' + opts.urlButtonLabel + '</button>'
        + '<span class="input-text"><input type="text" name="liveedit-url" /></span>'
        + '<button class="bold-button">' + opts.boldButtonLabel + '</button>'
        + '<button class="italic-button">' + opts.italicButtonLabel + '</button>'
        + '<button class="strikethrough-button">' + opts.strikethroughButtonLabel + '</button>'
        + '<button class="unorderedlist-button">' + opts.unorderedlistButtonLabel + '</button>'
        + '</span>';
      $("body").append(sidebarInterface);
      $("body").append(textOptionsInterface);
    };
    
    var createUIElements = function(){
      sideBar = $(".live-edit-sidebar");
      saveButton = $(".live-edit-sidebar .save-button");
      textOptions = $(".text-options");
      urlButton = $(".text-options .url-button");
      urlField = $(".text-options span.input-text");
      boldButton = $(".text-options .bold-button");
      italicButton = $(".text-options .italic-button");
      strikethroughButton = $(".text-options .strikethrough-button");
      unorderedListButton = $(".text-options .unorderedlist-button");
    };
    
    var createEventBindings = function() {
      document.execCommand("defaultParagraphSeparator", false, "p");
      saveButton.on("click", saveAll);
      urlButton.on("click", urlButtonClick);
      boldButton.on("click", boldButtonClick);
      italicButton.on("click", italicButtonClick);
      strikethroughButton.on("click", strikethroughButtonClick);
      unorderedListButton.on("click", unorderedListButtonClick);
      $(urlField).find("input").on("keydown", function(event){
        if (event.keyCode === 13) {
          event.preventDefault();
          applyURL($(this).val());
          $(this).blur();
        }
      });
      $(urlField).find("input").on("blur", function(event){
        textOptions.removeClass("edit-url");
        applyURL($(this).val());
        $(this).val("");
        updateTextOptions(window.getSelection().focusNode);
      });
      $(document).on("keyup", processSelectedText);
      $(document).on("mousedown", processSelectedText);
      $(document).on("mouseup", function(event) {
        setTimeout(function() {
          processSelectedText(event);
        }, 1);
      });
    };
    
    createUI();
    createUIElements();
    createEventBindings();
    
    var limitMaxLength = function(element) {
      var maxLength = $(element).data("max-length");
      if (maxLength) {
        $(element).on("keypress", function(event){
          if (event.target.innerText.length > maxLength || event.keyCode === 13) {
            event.preventDefault();
          }
        });
      }
    };
    
    $.fn.liveEdit.loadingState = function(action) {
      if (action == "on") {
        sideBar.addClass("loading-state");
      } else {
        sideBar.removeClass("loading-state");
      }
    };
    
    return this.each(function() {
      editableElements.push(this);
      $(this).find("[data-editable=true]").each(function(){
        setContentEditable(this);
        preventAnchorClick(this);
        limitMaxLength(this);
        handlePaste(this);
        handleDoubleClick(this);
      });
    });
    
  };
  
  $.fn.liveEdit.defaults = {
    saveButtonLabel: 'S',
    urlButtonLabel: 'U',
    boldButtonLabel: 'B',
    italicButtonLabel: 'I',
    strikethroughButtonLabel: 'ABC',
    unorderedlistButtonLabel: 'L',
  };
  
}(jQuery));