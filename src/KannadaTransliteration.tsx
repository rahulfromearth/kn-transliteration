import { useState } from "react";
import "./styles.css";

const KannadaTransliteration = () => {
    const [word, setWord] = useState<string>("kannada");
    const [translits, setTranslits] = useState<string[]>(['k1', 'k2', 'k3']);

    return (
        <>
            <span>{word}</span>
            <br />
            <div className="transliterations">
                {translits.map((t, index) =>
                    <span key={index} onClick={() => setWord(t)} className="knTxLit">{t}</span>
                )}
            </div>

        </>
    );
}

export default KannadaTransliteration