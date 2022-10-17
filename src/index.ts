
import { words } from './transliterate';
import { getWord } from './utils';

/**
 * HTML elements
 */
const inputTextArea = document.getElementById('inputArea') as HTMLDivElement;

const menuDiv = document.getElementById('menuDiv') as HTMLDivElement;
const menuWord = document.getElementById('menuWord') as HTMLDivElement;
const suggestionDivs = document.getElementById('suggestions') as HTMLDivElement;

/**
 * Global constants
 */
const MAX_SUGGESTIONS = 5; // We show max 5 suggestions in the menu

/**
 * Global variables
 */
let currentWord: string;
let currentSuggestions: string[];
let selectedIndex = 0;



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
function showPopupMenu() {
    const caretGlobalPosition = getCaretGlobalPosition();
    menuDiv.style.cssText = `display: block;` +
        `top: ${caretGlobalPosition.top}px;` +
        `left: ${caretGlobalPosition.left}px;`;
}

function hidePopupMenu() {
    menuDiv.style.cssText = "display: none;";
}


function updatePopupMenu() {
    // innerContent is not supported in old browsers
    menuWord.innerText = currentWord;

    // TODO remove slice and let API handle it
    const englishSuggestions = Object.keys(words)
        .filter(w => currentWord &&
            w.toLowerCase().startsWith(currentWord.toLowerCase()) &&
            (w.length - currentWord.length < 3))
        .slice(0, MAX_SUGGESTIONS);

    currentSuggestions = englishSuggestions
        .map(e => words[e])
        .flat()
        .slice(0, MAX_SUGGESTIONS);

    suggestionDivs.innerHTML = '';
    currentSuggestions.forEach((currentSuggestion, i) => {
        const div = document.createElement('div');
        div.setAttribute('class', 'popupDiv');

        const p = document.createElement('p');
        if (i == 0) {
            p.setAttribute('class', 'selected suggestion');
        } else {
            p.setAttribute('class', 'suggestion');
        }

        p.innerText = currentSuggestion;

        div.appendChild(p);

        suggestionDivs.appendChild(div);
    })

    // if (suggestions.length &&
    //     currentWord.toLowerCase() === englishSuggestions[0].toLowerCase()) {
    //     // this.innerHTML = `${suggestions[0]} ${this.innerHTML.split(' ').slice(0, -1).join(' ')}`
    //     console.log('setting', suggestions[0]);
    // }

}

function setCurrentWord(event: Event) {
    // check if there's any non-whitespace text and then set current word
    if (
        inputTextArea.textContent?.trim() &&
        (currentWord = getWord())
    ) {
        // console.log(currentWord)
        // update popup menu only if current word is non-empty / undefined
        updatePopupMenu();
        showPopupMenu();
    } else {
        // console.log('hiding')
        hidePopupMenu();
    }
}



function handleArrowKeys(event: KeyboardEvent) {

    // TODO switch between choices
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const currArrLen = (currentSuggestions?.length - 1) >= 0 ? currentSuggestions.length - 1 : 0;
        switch (event.key) {
            case 'ArrowUp':
                selectedIndex = selectedIndex === 0 ?
                    currArrLen :
                    (selectedIndex - 1);
                break;
            case 'ArrowDown':
                selectedIndex =
                    selectedIndex === currArrLen ?
                        0 :
                        (selectedIndex + 1);
                break;
        }
        console.log('key:', event.key, selectedIndex);
        event.preventDefault();

    }


    // console.log(selectedIndex);

    // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array

    // TODO correct word before transliterating
    // TODO make this an API ?

    // TODO handle go back and edit prev word

    // TODO keep track of current word
    // TODO change this on click

    // TODO make this scalable
    // TODO selected word



    // previousCaretPos += 10;
}







inputTextArea.addEventListener('keydown', handleArrowKeys)

inputTextArea.addEventListener('input', setCurrentWord)
inputTextArea.addEventListener('keyup', setCurrentWord)


inputTextArea.addEventListener('click', setCurrentWord)

// inputTextArea.addEventListener('keypress', onTextAreaChange);





// 15 characters long in https://gisttransserver.in/

