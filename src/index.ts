

const inputTextArea = document.getElementById('inputArea') as HTMLTextAreaElement;

const menuDiv = document.getElementById('menuDiv') as HTMLDivElement;
const inputTextDiv = document.getElementById('inputText') as HTMLDivElement;
const suggestionDivs = document.getElementById('suggestions')!.children;


// TODO save in cookie (?)
const previousCaretPos = 0;

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

/////////////////[ DEMO ]\\\\\\\\\\\\\\\\\\\\

const contenteditable = document.querySelector('[contenteditable]')

inputTextArea.addEventListener('input', onInput)

inputTextArea.addEventListener('click', onInput)

function onInput() {
    const caretGlobalPosition = getCaretGlobalPosition()

    menuDiv.style.cssText = `top:${caretGlobalPosition.top}px;
                           left:${caretGlobalPosition.left}px;`
}



function onTextAreaChange(this: HTMLDivElement, event: any) {
    // const cursorPosition = this.selectionStart;
    // const prevCurPos = cursorPosition - 1;

    // const showMenu = prevCurPos >= 0 && this.value[prevCurPos] !== ' ';

    // this.focus();
    // this.setSelectionRange(previousCaretPos, previousCaretPos);

    if (event.key === 'Space' // || event.key === 'Tab' 
        || event.key === 'Enter') {
        // console.log(event.key);

    } else if (event.key === 'Tab') {
        event.preventDefault();
        // const start = this.selectionStart;
        // const end = this.selectionEnd;

        // // set textarea value to: text before caret + tab + text after caret
        // this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

        // // put caret at right position again
        // this.selectionStart = this.selectionEnd = start + 1;
    }

    const words = this.innerHTML.split(" ");

    // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array
    const lastWord = words.at(-1) || "";

    const suggestions = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
    // TODO slice(0, 5) if more elems

    inputTextDiv.innerHTML = lastWord;


    for (let i = 0; i < suggestionDivs.length; ++i) {
        if (i < suggestions.length) {
            suggestionDivs[i].innerHTML = suggestions[i];
        } else {
            suggestionDivs[i].innerHTML = '';
            // TODO hide divs
        }
    }



    // console.log(lastWord);

    // previousCaretPos += 10;
}




inputTextArea.addEventListener('keyup', onTextAreaChange);

// inputTextArea.addEventListener('click',
//     (event: MouseEvent) => {
//         const cursorPosition = inputTextArea.selectionStart;
//         console.log(cursorPosition);
//     }
// )


// 15 characters long in https://gisttransserver.in/

