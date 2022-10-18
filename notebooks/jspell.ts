// https://web.archive.org/web/20220607030126/https://stoi.wordpress.com/2012/12/31/jspell/
// - shine (India)

// npx ts-node

// npx tsc jspell.ts && node

/* 
.load jspell.js
nsc = new NorvigSpellChecker('big.txt')
nsc.correct('spelling')
*/

const fs = require('fs');

type WordFreq = {
    [key: string]: number;
}

type CorrectedWord = {
    [key: string]: string;
}

function isEmpty(object: WordFreq) {
    // iterate over keys in object prototype chain
    // https://stackoverflow.com/questions/13632999/if-key-in-object-or-ifobject-hasownpropertykey
    for (const prop in object) {
        if (object.hasOwnProperty(prop))
            return false;
    }
    return true;
};

// https://stackoverflow.com/a/35117049/6949755
function curry<T, U>(fn: Function): (...a: T[]) => U {
    return function (...fnArguments) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
        return fn.apply(
            null,
            // shallow copy
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
            Array.prototype.slice.call(fnArguments, 0)
        );
    }
}


class NorvigSpellChecker {

    private alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    private NWORDS: WordFreq = {}; // Training Model

    constructor(filePath: string) {
        const data = fs.readFileSync(filePath, 'utf8');
        this.train(data);
    }

    train = (trainingText: string) => {
        const filter = /([a-z]+)/g;
        const features = trainingText.toLowerCase().match(filter) as string[];
        for (const f in features) {
            const feature = features[f];
            if (this.NWORDS.hasOwnProperty(feature)) {
                this.NWORDS[feature] += 1;
            } else {
                this.NWORDS[feature] = 1;
            }
        }
    };

    edits1 = (words: string[]): string[] => {
        const edits1Set: string[] = [];
        for (const word of words) {
            for (let i = 0; i <= word.length; i++) {
                // splits (a & b)
                // console.log(word, words)
                const a = word.slice(0, i);
                const b = word.slice(i);
                const c = b.slice(1);
                const d = b.slice(2);
                if (b !== '') {
                    // deletes
                    edits1Set.push(a + c);
                    // transposes
                    if (b.length > 1) {
                        edits1Set.push(a + b.charAt(1) + b.charAt(0) + d);
                    }
                    // replaces & inserts
                    for (const letter of this.alphabets) {
                        edits1Set.push(a + letter + c); // replaces
                        edits1Set.push(a + letter + b); // inserts
                    }
                } else {
                    //inserts (remaining set for b == '')
                    for (const letter of this.alphabets) {
                        edits1Set.push(a + letter);
                    }
                }
            }
        }
        return edits1Set;
    };

    edits2 = (words: string[]): string[] => {
        return this.edits1(this.edits1(words));
    };

    known = (...wordsArrays: string[][]): WordFreq => {
        const knownSet: WordFreq = {};
        for (let i = 0; isEmpty(knownSet) && i < wordsArrays.length; ++i) {
            const words = wordsArrays[i];
            for (const word of words) {
                if (!knownSet.hasOwnProperty(word) &&
                    this.NWORDS.hasOwnProperty(word)) {
                    knownSet[word] = this.NWORDS[word];
                }
            }
        }
        return knownSet;
    };

    max = (candidateValues: WordFreq): string => {
        const maxCandidate = Object.keys(candidateValues)
            .reduce((prevCandidate, currCandidate) =>
                candidateValues[prevCandidate] > candidateValues[currCandidate] ?
                    prevCandidate :
                    currCandidate);
        return maxCandidate;
    };

    _correct = (...words: string[]) => {
        const corrections: CorrectedWord = {};
        for (const word of words) {
            const candidates: WordFreq =
                curry<Array<string>, WordFreq>(this.known)(
                    [word],
                    this.edits1([word]),
                    this.edits2([word])
                );
            corrections[word] = isEmpty(candidates) ? word : this.max(candidates);
        }
        return corrections;
    };

    correct = curry<string, CorrectedWord>(this._correct);

};
