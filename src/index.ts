import { words } from './corpus';
import { getWord } from './utils';

import getCaretCoordinates from 'textarea-caret';
import { transliterate } from './transliterateUtil';
/**
 * HTML elements
 */
const inputTextArea = document.getElementById('inputArea') as HTMLTextAreaElement;

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
let _currentWord = "";

type CorrectedEn = string;
type TransliteratedKn = string;
type Pair = [CorrectedEn, TransliteratedKn];
let currentSuggestions: Array<Pair>;

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
    const sel = win.getSelection()!;
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
    // TODO handle state  of menu
    const caretGlobalPosition = getCaretGlobalPosition();
    // console.log(caretGlobalPosition);
    selectedIndex = 0;
    menuDiv.style.cssText = `display: block;` +
        `top: ${caretGlobalPosition.top}px;` +
        `left: ${caretGlobalPosition.left}px;`;
}

function hidePopupMenu() {
    menuDiv.style.cssText = "display: none;";
}

function convertRemToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const TEXT_FONT_SIZE = convertRemToPixels(1.5)

function updateMenu(word: string) {
    _currentWord = word
    if (word) {
        _updatePopupMenu()
    } else {
        hidePopupMenu()
    }
}

function _updatePopupMenu() {

    const coordinates = getCaretCoordinates(inputTextArea, inputTextArea.selectionEnd);
    menuDiv.style.display = 'block';
    // inputTextArea.style.fontSize
    const topPixels = inputTextArea.offsetTop - inputTextArea.scrollTop + TEXT_FONT_SIZE
    const leftPixels = inputTextArea.offsetLeft - inputTextArea.scrollLeft

    menuDiv.style.top = topPixels + coordinates.top + 'px';
    menuDiv.style.left = leftPixels + coordinates.left + 'px';

    // innerContent is not supported in old browsers
    menuWord.innerText = _currentWord;

    // TODO refactor below with PROPER code
    // TODO remove slice and let API handle it
    const englishSuggestions = Object.keys(words)
        .filter(
            w => _currentWord &&
                w.toLowerCase() === _currentWord.toLowerCase()
            // w.toLowerCase().startsWith(_currentWord.toLowerCase()) && (w.length - _currentWord.length < 3)
        )
        .slice(0, MAX_SUGGESTIONS);

    if (englishSuggestions.length === 0) {
        currentSuggestions = transliterate(_currentWord)
            .map(kn => [_currentWord, kn])
            .slice(0, MAX_SUGGESTIONS) as Array<Pair>
    } else {
        /* :^)  maaduthidene is not working */
        const trs = _currentWord.startsWith('m') ? (_: string) => [] : transliterate
        currentSuggestions = (
            englishSuggestions
                // TODO fix transliterate return
                .map(en => [...words[en], ...trs(en)].map(word => [en, word]))
                .flat()
                .slice(0, MAX_SUGGESTIONS) as Array<Pair>
        );
    }

    // TODO improve this code
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
        const [en, kn] = currentSuggestion;

        const enSpan = document.createElement('span');
        enSpan.innerText = en;
        p.appendChild(enSpan);

        const knSpan = document.createElement('span');
        knSpan.innerText = kn;
        p.appendChild(knSpan);

        div.appendChild(p);

        suggestionDivs.appendChild(div);
    })

    // if (suggestions.length &&
    //     _currentWord.toLowerCase() === englishSuggestions[0].toLowerCase()) {
    //     // this.innerHTML = `${suggestions[0]} ${this.innerHTML.split(' ').slice(0, -1).join(' ')}`
    //     console.log('setting', suggestions[0]);
    // }

}

function setCurrentWord(event: Event) {
    // if (event.type === 'click') {
    //     console.log((event as MouseEvent).target);
    // }
    if (event.type === 'click' &&
        (event as MouseEvent).target !== inputTextArea) {
        hidePopupMenu();
        return;
    }

    // check if there's any non-whitespace text and then set current word
    if (
        inputTextArea.innerText?.trim() &&
        (_currentWord = getWord()) &&
        _currentWord.trim()
    ) {
        // console.log(_currentWord)
        // update popup menu only if current word is non-empty / undefined
        updateMenu(_currentWord);
        showPopupMenu();
    } else {
        // console.log('hiding')
        hidePopupMenu();
    }
}


function updateTextArea(this: HTMLTextAreaElement, event: KeyboardEvent) {
    // console.log('key:', event.key, selectedIndex);
    event.preventDefault();
    const key = event.key;

    if (key === 'ArrowUp' || key === 'ArrowDown') {
        const currArrLen = currentSuggestions?.length > 0 ?
            currentSuggestions.length - 1 :
            0;
        if (currentSuggestions.length > 1) {
            // only update if number of suggestions > 1
            switch (key) {
                case 'ArrowUp':
                    selectedIndex = selectedIndex === 0 ?
                        selectedIndex :
                        (selectedIndex - 1);
                    break;
                case 'ArrowDown':
                    selectedIndex =
                        selectedIndex === currArrLen ?
                            selectedIndex :
                            (selectedIndex + 1);
                    break;
            }

            // update menu selection
            const suggestions = suggestionDivs.children;
            for (let i = 0; i < suggestions.length; ++i) {
                const p = suggestions[i].firstChild! as HTMLParagraphElement
                if (selectedIndex === i) {
                    p.setAttribute('class', 'selected suggestion')
                } else {
                    p.setAttribute('class', 'suggestion')
                }
            }
        }
    } else if (key === 'Enter' || key === 'Tab' || key === ' ') {
        // console.log(key, this.innerText, _currentWord)

        // TODO correct word before transliterating

        this.value += getSuggestion() + " "

        // console.log(transliterate(_currentWord));

        this.selectionStart = this.value.length;
        _currentWord = ""

        // if (currentSuggestions.length) {
        // console.log(currentSuggestions, currentSuggestions[selectedIndex])

        // }
        hidePopupMenu();

    } else if (key.length === 1 && (/[A-Za-z]/.test(key))) {
        // TODO handle other characters
        // console.log(key, `'${this.innerHTML}'`, `'${key}'`)
        updateMenu(_currentWord + key);
        // showPopupMenu();

    } else if (key === 'Backspace') {
        if (_currentWord === "") {
            this.value = this.value.slice(0, -1);
        }
        updateMenu(_currentWord.slice(0, -1));
    }

    // other keydown events will propagate

    // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array

    // TODO make this an API ?

    // TODO handle go back and edit prev word

    // TODO make this scalable

    // previousCaretPos += 10;
}


// window.addEventListener('click', setCurrentWord)

inputTextArea.addEventListener('keydown', updateTextArea)

function getSuggestion() {
    return currentSuggestions[selectedIndex] ?
        currentSuggestions[selectedIndex][1] :
        _currentWord;
}

// inputTextArea.addEventListener('keyup', setCurrentWord)


// inputTextArea.addEventListener('input', setCurrentWord)
// inputTextArea.addEventListener('keypress', onTextAreaChange);





// 15 characters long in https://gisttransserver.in/

