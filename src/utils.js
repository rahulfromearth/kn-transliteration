// I'm not fixing this
export function getWord() {
    var sel, word = "";
    if (window.getSelection && (sel = window.getSelection()).modify) {
        var selectedRange = sel.getRangeAt(0);
        sel.collapseToStart();
        sel.modify("move", "backward", "word");
        sel.modify("extend", "forward", "word");

        word = sel.toString();

        // Restore selection
        sel.removeAllRanges();
        sel.addRange(selectedRange);
    } else if ((sel = document.selection) && sel.type != "Control") {
        // IDC about Internet explorer
        // TODO fix whoever wants to
        var range = sel.createRange();
        range.collapse(true);
        range.expand("word");
        word = range.text;
    }
    return word;

    // console.log(`"${word}"`);
}
/*

function getCursorAdjacentWords() {
    var sel = window.getSelection()
    var selectedRange = sel.getRangeAt(0);

    sel.collapseToEnd();
    sel.modify("extend", "forward", "word");
    var wordAfter = sel.toString();

    sel.collapseToStart();
    sel.modify("move", "backward", "word");
    sel.modify("extend", "forward", "word");

    var wordBefore = sel.toString();

    return { wordAfter, wordBefore }
}

function getWordBeforeCursor() {
    var sel = window.getSelection()
    var selectedRange = sel.getRangeAt(0);
    sel.collapseToStart();
    sel.modify("move", "backward", "word");
    sel.modify("extend", "forward", "word");
    return sel.toString();
}


function getWordAfterCursor() {
    var sel = window.getSelection()
    var selectedRange = sel.getRangeAt(0);
    sel.collapseToEnd();
    sel.modify("extend", "forward", "word");
    return sel.toString();
}
*/

