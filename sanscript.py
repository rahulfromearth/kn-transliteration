import six

# https://github.com/sanskrit/sanskrit/blob/master/sanskrit/transliterate/sanscript.py

# Brahmic schemes
# ---------------
#: Internal name of Kannada.
KANNADA = "kannada"

# Roman schemes
# -------------
#: Internal name of Harvard-Kyoto.
HK = "hk"

#: Internal name of IAST.
IAST = "iast"

#: Internal name of SLP1.
SLP1 = "slp1"


SCHEMES = {}


class Scheme(dict):

    """Represents all of the data associated with a given scheme. In addition
    to storing whether or not a scheme is roman, :class:`Scheme` partitions
    a scheme's characters into important functional groups.

    :class:`Scheme` is just a subclass of :class:`dict`.

    :param data: a :class:`dict` of initial values.
    :param is_roman: `True` if the scheme is a romanization and `False`
                     otherwise.
    """

    def __init__(self, data=None, is_roman=True):
        super(Scheme, self).__init__(data or {})
        self.is_roman = is_roman


class SchemeMap(object):

    """Maps one :class:`Scheme` to another. This class grabs the metadata and
    character data required for :func:`transliterate`.

    :param from_scheme: the source scheme
    :param to_scheme: the destination scheme
    """

    def __init__(self, from_scheme, to_scheme):
        """Create a mapping from `from_scheme` to `to_scheme`."""
        self.marks = {}
        self.virama = {}

        self.vowels = {}
        self.consonants = {}
        self.other = {}
        # self.from_roman = from_scheme.is_roman
        self.to_roman = to_scheme.is_roman
        self.longest = max(len(x) for g in from_scheme for x in from_scheme[g])

        for group in from_scheme:
            # group is not necessarily in both schemas
            if group not in to_scheme:
                continue
            sub_map = dict(zip(from_scheme[group], to_scheme[group]))
            if group.endswith("marks"):
                self.marks.update(sub_map)
            elif group == "virama":
                self.virama = sub_map
            else:
                self.other.update(sub_map)
                if group.endswith("consonants"):
                    self.consonants.update(sub_map)
                elif group.endswith("vowels"):
                    self.vowels.update(sub_map)


# Main function for transliteration
def _roman(data: str, _scheme_map: SchemeMap, **kw):
    """Transliterate `data` with the given `_scheme_map`. This function is used
    when the source scheme is a Roman scheme.

    :param data: the data to transliterate
    :param _scheme_map: a dict that maps between characters in the old scheme
                       and characters in the new scheme
    """
    vowels = _scheme_map.vowels
    marks = _scheme_map.marks
    virama = _scheme_map.virama
    consonants = _scheme_map.consonants
    other = _scheme_map.other
    longest = _scheme_map.longest
    to_roman = _scheme_map.to_roman

    togglers = kw.pop("togglers", set())
    suspend_on = kw.pop("suspend_on", set())
    suspend_off = kw.pop("suspend_off", set())

    # togglers
    # suspend_on
    # suspend_off

    if kw:
        raise TypeError(f"Unexpected keyword argument {list(kw.keys())[0]}")

    buf = []
    i = 0

    had_consonant = found = False
    len_data = len(data)
    append = buf.append

    # If true, don't transliterate. The toggle token is discarded.
    toggled = False
    # If true, don't transliterate. The suspend token is retained.
    # `suspended` overrides `toggled`.
    suspended = False

    while i <= len_data:
        # The longest token in the source scheme has length `longest`. Iterate
        # over `data` while taking `longest` characters at a time. If we don`t
        # find the character group in our scheme map, lop off a character and
        # try again.
        #
        # If we've finished reading through `data`, then `token` will be empty
        # and the loop below will be skipped.
        token = data[i : i + longest]

        while token:

            if token in togglers:
                toggled = not toggled
                i += 2  # skip over the token
                found = True  # force the token to fill up again
                break

            if token in suspend_on:
                suspended = True
            elif token in suspend_off:
                suspended = False

            if toggled or suspended:
                token = token[:-1]
                continue

            # Catch the pattern CV, where C is a consonant and V is a vowel.
            # V should be rendered as a vowel mark, a.k.a. a "dependent"
            # vowel. But due to the nature of Brahmic scripts, 'a' is implicit
            # and has no vowel mark. If we see 'a', add nothing.
            if had_consonant and token in vowels:
                mark = marks.get(token, "")
                if mark:
                    append(mark)
                elif to_roman:
                    append(vowels[token])
                found = True

            # Catch any other character, including consonants, punctuation,
            # and regular vowels. Due to the implicit 'a', we must explicitly
            # end any lingering consonants before we can handle the current
            # token.
            elif token in other:
                if had_consonant:
                    append(virama[""])
                append(other[token])
                found = True

            if found:
                had_consonant = token in consonants
                i += len(token)
                break
            else:
                token = token[:-1]

        # We've exhausted the token; this must be some other character. Due to
        # the implicit 'a', we must explicitly end any lingering consonants
        # before we can handle the current token.
        if not found:
            if had_consonant:
                append(virama[""])
            if i < len_data:
                append(data[i])
                had_consonant = False
            i += 1

        found = False

    return "".join(buf)


def transliterate(
    data: str, _from: str = None, _to: str = None, _scheme_map=None, **kw
):
    """Transliterate `data` with the given parameters::

        output = transliterate('idam adbhutam', HK, DEVANAGARI)

    Each time the function is called, a new :class:`SchemeMap` is created
    to map the input scheme to the output scheme. This operation is fast
    enough for most use cases. But for higher performance, you can pass a
    pre-computed :class:`SchemeMap` instead::

        scheme_map = SchemeMap(SCHEMES[HK], SCHEMES[DEVANAGARI])
        output = transliterate('idam adbhutam', scheme_map=scheme_map)

    :param data: the data to transliterate
    :param _from: the name of a source scheme
    :param _to: the name of a destination scheme
    :param scheme_map: the :class:`SchemeMap` to use. If specified, ignore
                       `_from` and `_to`. If unspecified, create a
                       :class:`SchemeMap` from `_from` to `_to`.
    """
    if _scheme_map is None:
        from_scheme: Scheme = SCHEMES[_from]
        to_scheme: Scheme = SCHEMES[_to]
        _scheme_map = SchemeMap(from_scheme, to_scheme)

    options = {"togglers": set(["##"]), "suspend_on": set("<"), "suspend_off": set(">")}
    options.update(kw)

    return _roman(data, _scheme_map, **options)


def _setup():
    """Add a variety of default schemes."""
    s = six.text_type.split

    SCHEMES.update(
        {
            KANNADA: Scheme(
                {
                    "vowels": s("""ಅ ಆ ಇ ಈ ಉ ಊ ಋ ೠ ಌ ೡ ಏ ಐ ಓ ಔ"""),
                    "marks": s("""ಾ ಿ ೀ ು ೂ ೃ ೄ ೢ ೣ ೇ ೈ ೋ ೌ"""),
                    "virama": s("್"),
                    "other": s("ಂ ಃ ँ"),
                    "consonants": s(
                        """
                            ಕ ಖ ಗ ಘ ಙ
                            ಚ ಛ ಜ ಝ ಞ
                            ಟ ಠ ಡ ಢ ಣ
                            ತ ಥ ದ ಧ ನ
                            ಪ ಫ ಬ ಭ ಮ
                            ಯ ರ ಲ ವ
                            ಶ ಷ ಸ ಹ
                            ಳ ಕ್ಷ ಜ್ಞ
                            """
                    ),
                    "symbols": s(
                        """
                       ಓಂ ऽ । ॥
                       ೦ ೧ ೨ ೩ ೪ ೫ ೬ ೭ ೮ ೯
                       """
                    ),
                },
                is_roman=False,
            ),
            HK: Scheme(
                {
                    "vowels": s("""a A i I u U R RR lR lRR e ai o au"""),
                    "marks": s("""A i I u U R RR lR lRR e ai o au"""),
                    "virama": [""],
                    "other": s("M H ~"),
                    "consonants": s(
                        """
                            k kh g gh G
                            c ch j jh J
                            T Th D Dh N
                            t th d dh n
                            p ph b bh m
                            y r l v
                            z S s h
                            L kS jJ
                            """
                    ),
                    "symbols": s(
                        """
                       OM ' | ||
                       0 1 2 3 4 5 6 7 8 9
                       """
                    ),
                }
            ),
            IAST: Scheme(
                {
                    "vowels": s("""a ā i ī u ū ṛ ṝ ḷ ḹ e ai o au"""),
                    "marks": s("""ā i ī u ū ṛ ṝ ḷ ḹ e ai o au"""),
                    "virama": [""],
                    "other": s("ṃ ḥ m̐"),
                    "consonants": s(
                        """
                            k kh g gh ṅ
                            c ch j jh ñ
                            ṭ ṭh ḍ ḍh ṇ
                            t th d dh n
                            p ph b bh m
                            y r l v
                            ś ṣ s h
                            ḻ kṣ jñ
                            """
                    ),
                    "symbols": s(
                        """
                       oṃ ' । ॥
                       0 1 2 3 4 5 6 7 8 9
                       """
                    ),
                }
            ),
            SLP1: Scheme(
                {
                    "vowels": s("""a A i I u U f F x X e E o O"""),
                    "marks": s("""A i I u U f F x X e E o O"""),
                    "virama": [""],
                    "other": s("M H ~"),
                    "consonants": s(
                        """
                            k K g G N
                            c C j J Y
                            w W q Q R
                            t T d D n
                            p P b B m
                            y r l v
                            S z s h
                            L kz jY
                            """
                    ),
                    "symbols": s(
                        """
                       oM ' . ..
                       0 1 2 3 4 5 6 7 8 9
                       """
                    ),
                }
            ),
        }
    )


if __name__ == "__main__":
    _setup()
    # scheme_map = SchemeMap(SCHEMES[KANNADA], SCHEMES[HK])

    # English to Kannada
    # en_scheme -> is_roman=True
    # kn_scheme -> is_roman=False ; kn_scheme.to_roman = False
    scheme_map = SchemeMap(SCHEMES[HK], SCHEMES[KANNADA])

    transliterate("", _scheme_map=scheme_map)
