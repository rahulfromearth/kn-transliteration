import { Schema, SchemaMap } from "./schemasTypes";

const mapIsoToKannada = (object: { [key: string]: string }) =>
    (isoArray: string[]) => {
        return isoArray.map(iso => object[iso])
    }

// [en ISO transcription] : kn vowel
const _isoVowels = {
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
};

const mapVowels = mapIsoToKannada(_isoVowels);

const vowels = {
    'a': mapVowels(['a', 'ā']),
    'aa': mapVowels(['ā']),

    'i': mapVowels(['i', 'ī']),
    'ee': mapVowels(['ī']),

    'u': mapVowels(['u', 'ū']),
    'oo': mapVowels(['ū']),

    'ru': mapVowels(['r̥',]),

    'e': mapVowels(['e', 'ē']),
    'ae': mapVowels(['e', 'ē']),

    'ai': mapVowels(['ai',]),

    'o': mapVowels(['o', 'ō']),
    'oh': mapVowels(['o', 'ō']),
    'ho': mapVowels(['o', 'ō']),

    'au': mapVowels(['au']),
};

/**
 * MARKS
 */
// [en ISO transcription] : kn vowel symbol
const _isoDiacritics = {
    "": "",
    "ā": "ಾ",
    "i": "ಿ",
    "ī": "ೀ",
    "u": "ು",
    "ū": "ೂ",
    "r̥": "ೃ",
    "e": "ೆ",
    "ē": "ೇ",
    "ai": "ೈ",
    "o": "ೊ",
    "ō": "ೋ",
    "au": "ೌ",
};

const mapDiactrics = mapIsoToKannada(_isoDiacritics);

const marks = {
    'a': mapDiactrics(['', 'ā']),
    'aa': mapDiactrics(['ā']),

    'i': mapDiactrics(['i', 'ī']),
    'ee': mapDiactrics(['ī']),

    'u': mapDiactrics(['u', 'ū']),
    'oo': mapDiactrics(['ū']),

    'ru': mapDiactrics(['r̥',]),

    'e': mapDiactrics(['e', 'ē']),
    'ae': mapDiactrics(['e', 'ē']),

    'ai': mapDiactrics(['ai',]),

    'o': mapDiactrics(['o', 'ō']),
    'oh': mapDiactrics(['o', 'ō']),
    'ho': mapDiactrics(['o', 'ō']),

    'au': mapDiactrics(['au']),
};

/**
 * OTHER
 */
const _isoOther = {
    // "aṃ": "ಅಂ",
    // "aḥ": "ಅಃ",

    "ṃ": "ಂ",
    "ḥ": "ಃ",
};

const mapOther = mapIsoToKannada(_isoOther);

const other = {
    "am": mapOther(["ṃ"]),
    // "an": mapOther(["ṃ"]),
    "um": mapOther(["ṃ"]),

    "ah": mapOther(["ḥ"]),
    // "aha": mapOther(["ḥ"]),
    "uh": mapOther(["ḥ"]),
    // "uha": mapOther(["ḥ"]),

};

/**
 * CONSONANTS
 */
// [en ISO transcription] : kn consonant
const _isoConsonants = {
    'k': 'ಕ',
    'kh': 'ಖ',
    'g': 'ಗ',
    'gh': 'ಘ',
    'ṅ': 'ಙ',

    'c': 'ಚ',
    'ch': 'ಛ',
    'j': 'ಜ',
    'jh': 'ಝ',
    'ñ': 'ಞ',

    'ṭ': 'ಟ',
    'ṭh': 'ಠ',
    'ḍ': 'ಡ',
    'ḍh': 'ಢ',
    'ṇ': 'ಣ',

    't': 'ತ',
    'th': 'ಥ',
    'd': 'ದ',
    'dh': 'ಧ',
    'n': 'ನ',

    'p': 'ಪ',
    'ph': 'ಫ',
    'b': 'ಬ',
    'bh': 'ಭ',
    'm': 'ಮ',

    'y': 'ಯ',
    'r': 'ರ',
    'l': 'ಲ',
    'v': 'ವ',

    'ś': 'ಶ',
    'ṣ': 'ಷ',
    's': 'ಸ',
    'h': 'ಹ',

    'ḷ': 'ಳ',
    'x': 'ಕ್ಷ',
    'jn': 'ಜ್ಞ',
};

const mapConsonants = mapIsoToKannada(_isoConsonants);

// TODO map th -> t

// this is my school. rashmi g.. autocomplete
// weightage to more names . 
/*geetha gita githa getha
word distance - levenshtein distance


wrong  */

const consonants = {
    'k': mapConsonants(['k', 'kh',]),
    'kh': mapConsonants(['k', 'kh',]),

    'g': mapConsonants(['g', 'gh',]),
    'gh': mapConsonants(['g', 'gh',]),

    // '': mapConsonants(['ṅ',]),

    // carat
    'c': mapConsonants(['c', 'ch', 'k',]),
    'ch': mapConsonants(['c', 'ch',]),


    'j': mapConsonants(['j', 'jh',]),
    'jh': mapConsonants(['j', 'jh',]),


    // '': mapConsonants(['ñ',]),

    'n': mapConsonants(['n',]),

    't': mapConsonants(['ṭ', 'ṭh', 't', 'th',]),

    'd': mapConsonants(['ḍ', 'ḍh', 'd', 'dh',]),

    'p': mapConsonants(['p', 'ph',]),

    'b': mapConsonants(['b', 'bh',]),

    // 'm': mapConsonants(['m',]),

    'y': mapConsonants(['y',]),

    'r': mapConsonants(['r',]),

    'l': mapConsonants(['l', 'ḷ',]),

    'v': mapConsonants(['v',]),

    's': mapConsonants(['ś', 'ṣ', 's',]),

    'sh': mapConsonants(['ś', 'ṣ', 's',]),


    'h': mapConsonants(['h',]),

    // z

    // x

};

/**
 * SYMBOLS
 */
// [English digit] : kn digit
const _numerals = {
    '0': ['೦'],
    '1': ['೧'],
    '2': ['೨'],
    '3': ['೩'],
    '4': ['೪'],
    '5': ['೫'],
    '6': ['೬'],
    '7': ['೭'],
    '8': ['೮'],
    '9': ['೯'],
};

const symbols = {
    // OM is UPPERCASE in sanscript
    "om": ["ಓಂ"],
    "aum": ["ಓಂ"],

    // "'": "ऽ",
    // "|": "।",
    // "||": "॥",

    ..._numerals,
};



/**
 * 
 */

const englishSchema = new Schema<string[]>(
    {
        vowels: Object.keys(vowels),
        marks: Object.keys(marks),
        virama: '',
        other: Object.keys(other),
        consonants: Object.keys(consonants),
        symbols: Object.keys(symbols),
    }
);

/**
 * 
 */

const kannadaSchema = new Schema<string[][]>(
    {
        vowels: Object.values(vowels),
        marks: Object.values(marks),
        virama: '್',
        other: Object.values(other),
        consonants: Object.values(consonants),
        symbols: Object.values(symbols),
    }
);

const schemaMap = new SchemaMap(englishSchema, kannadaSchema);

export {
    schemaMap
};