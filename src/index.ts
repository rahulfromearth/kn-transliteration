
import { words } from './transliterate';
import { getWord } from './utils';

const inputTextArea = document.getElementById('inputArea') as HTMLDivElement;

const menuDiv = document.getElementById('menuDiv') as HTMLDivElement;
const menuWord = document.getElementById('menuWord') as HTMLDivElement;
const suggestionDivs = document.getElementById('suggestions')!.children;

// let caretPosition = getCaretCharacterOffsetWithin(inputTextArea);


// TODO save in cookie (?)

/**
 * Get the caret position, relative to the window 
 * @returns {object} left, top distance in pixels
 */
function getCaretGlobalPosition() {
    const r = document.getSelection()!.getRangeAt(0)
    const node = r.startContainer
    const offset = r.startOffset
    const pageOffset = { x: window.pageXOffset, y: window.pageYOffset }
    let rect, r2;

    if (offset > 0) {
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)
        rect = r2.getBoundingClientRect()
        return { left: rect.right + pageOffset.x, top: rect.bottom + pageOffset.y }
    }
    return { top: NaN, left: NaN }
}

// https://stackoverflow.com/questions/3972014/get-contenteditable-caret-position
// https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022

function getCaretCharacterOffsetWithin(element: HTMLDivElement) {
    let caretOffset = 0;
    const doc = element.ownerDocument;
    const win = doc.defaultView!;
    let sel;
    sel = win.getSelection()!;
    if (sel.rangeCount > 0) {
        const range = win.getSelection()!.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }

    return caretOffset;
}

// https://stackoverflow.com/questions/19038070/html-newline-char-in-div-content-editable
function menuStyling() {
    // const alphaNumeric = /[a-z0-9]/i
    // lastChar.match(alphaNumeric)

    // without css white-space: pre, nbsp are used instead of space
    // last character is always \n using pre-line
    // HTML/CSS/JS is the worst technology ever created

    // not using innerHTML
    // cursor - 1


    const inputText = inputTextArea.textContent || "";
    const lastChar = inputText.at(-1) || ' ';

    // console.log(caretPosition, inputText);
    // console.log(inputText[caretPosition - 1], inputText.at(-1), 'end');
    // console.log();


    if (!lastChar.match(/\s/)) {
        const caretGlobalPosition = getCaretGlobalPosition();

        menuDiv.style.cssText = `display: block;` +
            `top: ${caretGlobalPosition.top}px;` +
            `left: ${caretGlobalPosition.left}px;`;
    } else {
        menuDiv.style.cssText = "display: none;";
    }
}



// inputTextArea.addEventListener('click',
//     (event: MouseEvent) => {
//         // console.log(cursorPosition);
// getWord();
//     }
// )


let currentWord: string;

function setCurrentWord() {
    currentWord = getWord();
    console.log('setting curr word', currentWord);

}

inputTextArea.addEventListener('input', setCurrentWord)
inputTextArea.addEventListener('click', setCurrentWord)


inputTextArea.addEventListener('input', menuStyling)


function onTextAreaChange(this: HTMLDivElement, event: KeyboardEvent) {

    // const cursorPosition = this.selectionStart;
    // const prevCurPos = cursorPosition - 1;

    // const showMenu = prevCurPos >= 0 && this.value[prevCurPos] !== ' ';

    // this.focus();
    // this.setSelectionRange(previousCaretPos, previousCaretPos);

    if (this.textContent) {

        const inputWordArray = this.innerText.split(/\s/);

        const lastWord = inputWordArray.at(-1) || "";
        menuWord.textContent = lastWord;

        const englishSuggestions = Object.keys(words).filter(
            w => lastWord &&
                w.startsWith(lastWord) &&
                (w.length - lastWord.length < 3)
        );

        const suggestions = englishSuggestions.map(e => words[e]).flat();

        for (let i = 0; i < suggestionDivs.length; ++i) {
            if (i < suggestions.length) {
                suggestionDivs[i].innerHTML = suggestions[i];
            } else {
                suggestionDivs[i].innerHTML = '';
                // TODO hide divs
            }
        }

        if (event.key === ' ') {
            console.log("space");

            if (suggestions.length &&
                lastWord.toLowerCase() === englishSuggestions[0].toLowerCase()) {
                // this.innerHTML = `${suggestions[0]} ${this.innerHTML.split(' ').slice(0, -1).join(' ')}`
                console.log('setting', suggestions[0]);
            }

        }
    } else {
        console.log('NO-OP');

    }

    // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array

    // TODO slice(0, 5) if more elems
    // TODO correct word before transliterating
    // TODO make this an API ?

    // TODO handle go back and edit prev word

    // TODO keep track of current word
    // TODO change this on click

    // TODO make this scalable
    // TODO selected word

    // console.log(lastWord, englishSuggestions, suggestions);


    // previousCaretPos += 10;
}




inputTextArea.addEventListener('keyup', onTextAreaChange);
// inputTextArea.addEventListener('keypress', onTextAreaChange);





// 15 characters long in https://gisttransserver.in/

