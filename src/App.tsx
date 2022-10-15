import React, { useRef, useState } from "react";
import Keyboard, { SimpleKeyboard } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import "./styles.css";
import useEventListener from "@use-it/event-listener";
import { transliterate } from "./transliterateUtil";

function App() {

  /*
  Don't worry about this it's just some 3rd party keyboard component code
  */

  // TODO use cookies to store input even on refresh
  // TODO add clear all button
  const [input, setInput] = useState<string>("");
  const keyboard = useRef<SimpleKeyboard>();
  const [layoutName, setLayoutName] = useState("default");
  const [isInputFocused, setIsInputFocused] = useState(false);

  // "naanu kannadadinda aangla baashege lipyantara maadutene"
  // "ನಾನು ಕನ್ನಡದಿಂದ ಆಂಗ್ಲ ಬಾಶೆಗೆ ಲಿಪ್ಯಂತರ ಮಾಡುತೇನೆ"

  // transliterate ಟ್ರಾನ್ಸ್ಲಿಟರೇಟ್


  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
    keyboard.current!.setOptions({ layoutName: "shift" });
  };

  function keyDownHandler(event: KeyboardEvent) {
    const key = event.key;
    // TODO fix event propagation
    // event.preventDefault();
    if (isInputFocused) {
      if (key === 'CapsLock') {
        const newLayoutName = layoutName === "default" ? "caps" : "default";
        setLayoutName(newLayoutName);
        keyboard.current!.setOptions({ layoutName: newLayoutName });
      } else if (key === 'Shift') {
        handleShift();
      }
    }
  }

  function keyUpHandler(event: KeyboardEvent) {
    // event.preventDefault();
    if (isInputFocused && event.key === 'Shift') {
      handleShift();
    }
  }

  useEventListener('keydown', keyDownHandler);

  useEventListener('keyup', keyUpHandler);

  const layout = {
    "default": [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{capslock} a s d f g h j k l ; ' {enter}",
      "{shiftleft} z x c v b n m , . / {shiftright}",
      "{space}"
    ],
    "shift": [
      "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
      "{tab} Q W E R T Y U I O P { } |",
      '{capslock} A S D F G H J K L : " {enter}',
      "{shiftleft} Z X C V B N M < > ? {shiftright}",
      "{space}"
    ],
    "caps": [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} Q W E R T Y U I O P [ ] \\",
      "{capslock} A S D F G H J K L ; ' {enter}",
      "{shiftleft} Z X C V B N M , . / {shiftright}",
      "{space}"
    ],
  }

  const onChange = (input: string) => {
    setInput(input);
  };

  // TODO handle tab and caps and SHIFT (on virtual keyboard)

  const onChangeInput = (event: { target: { value: string } }) => {
    const input = event.target.value;
    setInput(input);
    keyboard.current!.setInput(input);
  };

  const [possibleTranslits, setPossibleTranslits] = useState<string[][]>([[]]);
  const [wordIndex, setWordIndex] = useState(0);
  const [userTranslits, setUserTranslits] = useState<string[]>([]);


  // https://gist.github.com/cybercase/db7dde901d7070c98c48
  function arrayProduct(...arrays: string[][][]) {
    const arrayOfTranslit = arrays[0].reduce((prevAccumulator: string[][], currentArray: string[]) => {
      const newAccumulator: string[][] = [];
      prevAccumulator.forEach(prevAccumulatorArray => {
        currentArray.forEach((currentValue: string) => {
          newAccumulator.push(prevAccumulatorArray.concat(currentValue));
        });
      });
      return newAccumulator;
    }, [[]]);
    return arrayOfTranslit.map(arr => arr.join(''));
  }

  function transliterateOnClick() {
    // TODO trim before transliterate
    // console.log('transliterating');

    const allTransliterations = input.split(' ').map(word => arrayProduct(transliterate(word)));

    // TODO use index to select from all
    setPossibleTranslits(allTransliterations);

    setUserTranslits(allTransliterations.map((tl) => tl[0]));

    // console.log(input, ts);
    // console.log(ts);
    console.log(allTransliterations);
  }

  // geeta 
  // car
  //  rahul

  // TODO add hover info
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>English to Kannada Transliteration</h1>
      <div className="transliteration">
        {/* TODO fix this */}
        {userTranslits.map((word, i) =>
          <span
            key={i}
            className="txSpan"
            onClick={() => setWordIndex(i)}>
            {word}
          </span>
        )}
      </div>
      <br />
      <div className="transliterationOptions">
        {/* TODO fix the large number of transliterations being generated */}
        {possibleTranslits[wordIndex]?.slice(0, 5).map((t, index) =>
          <span
            key={index}
            // onClick={() => setWord(t)} 
            className="knTxLit">
            {t}
          </span>
        )}
      </div>

      <div style={{ display: 'flex' }}>
        <textarea
          value={input}
          rows={10}
          placeholder={"Type here to start transliterating"}
          onChange={onChangeInput}
          style={{ flex: 1 }}
          onMouseDown={(event) => {
            const isCapsOn = event.getModifierState("CapsLock");
            setLayoutName(isCapsOn ? "caps" : "default");
            setIsInputFocused(true);
          }}
        />
      </div>

      <div className="buttonDiv">
        <button type="button" onClick={transliterateOnClick}>Transliterate</button>
      </div>

      {
        isInputFocused && (
          <div className="keyboardDiv">
            <Keyboard
              keyboardRef={r => (keyboard.current = r)}
              layoutName={layoutName}
              layout={layout}
              display={{
                "{capslock}": "caps lock ⇪",
              }}
              onChange={onChange}
              // onKeyPress={onKeyPress}
              physicalKeyboardHighlight={true}
              mergeDisplay={true}
            />
          </div>
        )
      }
    </div>
  );
}
export default App;
