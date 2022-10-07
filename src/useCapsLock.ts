import { useEffect, useState } from 'react';

// https://stackoverflow.com/questions/55738936/is-it-possible-to-show-a-caps-lock-indicator-on-a-password-field-in-formik
// https://stackoverflow.com/questions/40136839/how-can-i-detect-if-caps-lock-status-is-active-without-press-any-key-using-js

type Key = 'CapsLock';

const useCapsLock = (key: Key) => {
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => setToggled((pToggled) => event.getModifierState?.(key) ?? pToggled);

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [key]);

  return toggled;
};
export default useCapsLock;