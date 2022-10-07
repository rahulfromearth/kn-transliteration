const kannadaMap = {
    "a": "ಅ",
    "ā": "ಆ",
    "i": "ಇ",
    "ī": "ಈ",
    "u": "ಉ",
    "ū": "ಊ",
    "r̥": "ಋ",
    "e": "ಎ",
    "ē": "ಏ",
    "ai": "ಐ",
    "o": "ಒ",
    "ō": "ಓ",
    "au": "ಔ",
    "ṃ": "ಂ",
    "ḥ": "ಃ",
    // base consonants
    "ka": "ಕ",
    "kha": "ಖ",
    "ga": "ಗ",
    "gha": "ಘ",
    "ṅa": "ಙ",

    "ca": "ಚ",
    "cha": "ಛ",
    "ja": "ಜ",
    "jha": "ಝ",
    "ña": "ಞ",

    "ṭa": "ಟ",
    "ṭha": "ಠ",
    "ḍa": "ಡ",
    "ḍha": "ಢ",
    "ṇa": "ಣ",

    "ta": "ತ",
    "tha": "ಥ",
    "da": "ದ",
    "dha": "ಧ",
    "na": "ನ",

    "pa": "ಪ",
    "pha": "ಫ",
    "ba": "ಬ",
    "bha": "ಭ",
    "ma": "ಮ",

    "ya": "ಯ",
    "ra": "ರ",
    "la": "ಲ",
    "va": "ವ",

    "śa": "ಶ",
    "ṣa": "ಷ",
    "sa": "ಸ",
    "ha": "ಹ",
    "ḷa": "ಳ",

    // half consonants
    "k": "ಕ್",
    "kh": "ಖ್",
    "g": "ಗ್",
    "gh": "ಘ್",
    "ṅ": "ಙ್",

    "c": "ಚ್",
    "ch": "ಛ್",
    "j": "ಜ್",
    "jh": "ಝ್",
    "ñ": "ಞ್",

    "ṭ": "ಟ್",
    "ṭh": "ಠ್",
    "ḍ": "ಡ್",
    "ḍh": "ಢ್",
    "ṇ": "ಣ್",

    "t": "ತ",
    "th": "ಥ",
    "d": "ದ್",
    "dh": "ಧ್",
    "n": "ನ್",

    "p": "ಪ್",
    "ph": "ಫ್",
    "b": "ಬ್",
    "bh": "ಭ್",
    "m": "ಮ್",

    "y": "ಯ್",
    "r": "ರ್",
    "l": "ಲ್",
    "v": "ವ್",
    "ś": "ಶ್",
    "ṣ": "ಷ್",
    "s": "ಸ್",
    "h": "ಹ್",
    "ḷ": "ಳ್",

};

const numerals = {
    // numerals
    '0': '೦',
    '1': '೧',
    '2': '೨',
    '3': '೩',
    '4': '೪',
    '5': '೫',
    '6': '೬',
    '7': '೭',
    '8': '೮',
    '9': '೯',
};

const phoneticMap = {
    'a': ['a', 'ā'],
    'aa': ['ā'],
    'i': ['i', 'ī'],
    'ee': ['ī'],

    'u': ['u', 'ū'],
    'oo': ['ū'],


    'ru': ['r̥',],
    'e': ['e', 'ē'],
    'ai': ['ai',],
    'o': ['o', 'ō'],
    'au': ['au',],
    'um': ['ṃ',],

    'ah': ['ḥ',],


    'k': ['k', 'kh',],

    'g': ['g', 'gh',],

    // '': ['ṅ',],

    'c': ['c', 'ch',],
    'ch': ['c', 'ch',],


    'j': ['j', 'jh',],
    'jh': ['j', 'jh',],


    // '': ['ñ',],

    'n': ['ṇ', 'n',],

    't': ['ṭ', 'ṭh', 't', 'th',],

    'd': ['ḍ', 'ḍh', 'd', 'dh',],

    'p': ['p', 'ph',],

    'b': ['b', 'bh',],

    // 'm': ['m',],

    'y': ['y',],

    'r': ['r',],

    'l': ['l', 'ḷ',],

    'v': ['v',],

    's': ['ś', 'ṣ', 's',],

    'sh': ['ś', 'ṣ', 's',],


    'h': ['h',],



};

type KannadaScriptKey = keyof (typeof kannadaMap);
type PhoneticKey = keyof (typeof phoneticMap);

function parseSymbol(enString: string): [string, string[]] {
    // TODO consume greediest (??) and lesser as well (?) 
    // depth as a param?
    const parsed = enString.slice(0, 1) as PhoneticKey;

    if (parsed in phoneticMap) {
        const kannadaLetters = phoneticMap[parsed]
            .map(k => kannadaMap[k.toLowerCase() as KannadaScriptKey]);
        return [enString.slice(1), kannadaLetters];
    }
    // TODO else
    return ['', []];
}

// TODO return only Kannada script letters
function transliterate(english: string) {
    while (english.length !== 0) {
        parseSymbol(english);
    }

    return;
}

export {
    transliterate
}