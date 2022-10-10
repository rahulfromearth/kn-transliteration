import { schemaMap } from "./schemeMap";

function transliterate(data: string) {

    const buf: string[][] = [];
    let i = 0;

    let had_consonant = false;
    let found = false;
    const len_data = data.length;

    const vowels = schemaMap.vowels;
    const marks = schemaMap.marks;
    const virama = schemaMap.virama;
    const consonants = schemaMap.consonants;
    const other = schemaMap.other;
    const longest = schemaMap.longest;

    while (i <= len_data) {
        let token = data.slice(i, i + longest);

        while (token) {
            let mark;
            if (had_consonant && token in vowels) {
                mark = token in marks ? marks[token] : [];
                if (mark.length) {
                    buf.push(mark);
                }
                found = true;
            } else if (token in other) {
                if (had_consonant) {
                    buf.push(virama);
                }
                buf.push(other[token]);
                found = true;
            }

            if (found) {
                had_consonant = token in consonants;
                i += token.length
                break;
            }

            token = token.slice(0, -1)
        }

        if (!found) {
            if (had_consonant) {
                buf.push(virama);
            }
            if (i < len_data) {
                buf.push([data[i]]);
                had_consonant = false
            }
            i += 1;
        }

        found = false;
    }

    return buf;
};

export {
    transliterate
}