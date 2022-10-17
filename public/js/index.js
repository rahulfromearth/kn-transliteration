"use strict";
var inputTextArea = document.getElementById('inputArea');
var menuDiv = document.getElementById('menuDiv');
var inputTextDiv = document.getElementById('inputText');
var suggestionDivs = document.getElementById('suggestions').children;
var previousCaretPos = 0;
function getCaretGlobalPosition() {
    var r = document.getSelection().getRangeAt(0);
    var node = r.startContainer;
    var offset = r.startOffset;
    var pageOffset = { x: window.pageXOffset, y: window.pageYOffset };
    var rect, r2;
    if (offset > 0) {
        r2 = document.createRange();
        r2.setStart(node, (offset - 1));
        r2.setEnd(node, offset);
        rect = r2.getBoundingClientRect();
        return { left: rect.right + pageOffset.x, top: rect.bottom + pageOffset.y };
    }
    return { top: NaN, left: NaN };
}
var contenteditable = document.querySelector('[contenteditable]');
inputTextArea.addEventListener('input', onInput);
inputTextArea.addEventListener('click', onInput);
function onInput() {
    var caretGlobalPosition = getCaretGlobalPosition();
    menuDiv.style.cssText = "top:".concat(caretGlobalPosition.top, "px;\n                           left:").concat(caretGlobalPosition.left, "px;");
}
function onTextAreaChange(event) {
    if (event.key === 'Space'
        || event.key === 'Enter') {
    }
    else if (event.key === 'Tab') {
        event.preventDefault();
    }
    var words = this.innerHTML.split(" ");
    var lastWord = words.at(-1) || "";
    var suggestions = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
    inputTextDiv.innerHTML = lastWord;
    for (var i = 0; i < suggestionDivs.length; ++i) {
        if (i < suggestions.length) {
            suggestionDivs[i].innerHTML = suggestions[i];
        }
        else {
            suggestionDivs[i].innerHTML = '';
        }
    }
}
inputTextArea.addEventListener('keyup', onTextAreaChange);
