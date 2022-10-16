

const inputTextArea = document.getElementById('inputArea') as HTMLTextAreaElement;

const menuDiv = document.getElementById('menuDiv') as HTMLDivElement;
const inputTextDiv = document.getElementById('inputText') as HTMLDivElement;
const suggestionDivs = document.getElementById('suggestions')!.children;


// TODO save in cookie (?)
const previousCaretPos = 0;


function onTextAreaChange(this: HTMLTextAreaElement, event: KeyboardEvent) {
    const cursorPosition = this.selectionStart;
    const prevCurPos = cursorPosition - 1;

    // const showMenu = prevCurPos >= 0 && this.value[prevCurPos] !== ' ';

    // this.focus();
    // this.setSelectionRange(previousCaretPos, previousCaretPos);

    if (event.key === 'Space' // || event.key === 'Tab' 
        || event.key === 'Enter') {
        // console.log(event.key);

    } else if (event.key === 'Tab') {
        event.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;
    }

    const words = this.value.split(" ");
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

