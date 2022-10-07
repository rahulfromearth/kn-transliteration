import React, { useEffect, useRef, useState } from "react";
import Keyboard, { SimpleKeyboard } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import "./styles.css";
import KannadaTransliteration from "./KannadaTransliteration";
import useEventListener from '@use-it/event-listener'
import useCapsLock from "./useCapsLock";

function App() {

  /*
  Don't worry about this it's just some 3rd party keyboard component code
  */

  const [input, setInput] = useState<string>("");
  const keyboard = useRef<SimpleKeyboard>();
  const isCapsLockPressed = useCapsLock('CapsLock');
  const [layoutName, setLayoutName] = useState(isCapsLockPressed ? "shift" : "default");


  useEffect(() => {
    setLayoutName(isCapsLockPressed ? "shift" : "default");
  }, [isCapsLockPressed]);


  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
    keyboard.current!.setOptions({ layoutName: "shift" });
  };

  const KEYS = ['CapsLock', 'Shift']

  function handler({ key }: { key: string }) {
    if (KEYS.includes(key)) {
      console.log('Shift key pressed!');
      handleShift();
    }
  }

  function keyUpHandler({ key }: { key: string }) {
    if (key == 'Shift') {
      handleShift();
    }
  }

  useEventListener('keydown', handler);

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
    ]
  }

  const onChange = (input: string) => {
    setInput(input);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{capslock}") {
      handleShift();
    }
  };

  const onChangeInput = (event: { target: { value: string; }; }) => {
    const input = event.target.value;
    setInput(input);
    keyboard.current!.setInput(input);
  };

  return (
    <div>
      <KannadaTransliteration />
      <div style={{ display: 'flex' }}>
        <textarea
          value={input}
          rows={10}
          placeholder={"Tap on the virtual keyboard to start transliterating"}
          onChange={onChangeInput}
          style={{ flex: 1 }}
        />
      </div>

      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layoutName}
        layout={layout}
        display={{
          "{capslock}": "caps lock ⇪",
        }}
        onChange={onChange}
        onKeyPress={onKeyPress}
        physicalKeyboardHighlight={true}
        mergeDisplay={true}

      />
    </div>
  );
}
export default App;
