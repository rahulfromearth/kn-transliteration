"use strict";
var inputTextArea = document.getElementById('inputArea');
var menuDiv = document.getElementById('menuDiv');
var inputTextDiv = document.getElementById('inputText');
var suggestionDivs = document.getElementById('suggestions').children;
var previousCaretPos = 0;
function onTextAreaChange(event) {
    var cursorPosition = this.selectionStart;
    var prevCurPos = cursorPosition - 1;
    if (event.key === 'Space'
        || event.key === 'Enter') {
    }
    else if (event.key === 'Tab') {
        event.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
    var words = this.value.split(" ");
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
