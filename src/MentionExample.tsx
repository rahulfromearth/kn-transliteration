import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { createEditor, Descendant, Editor, Range, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import {
    Editable,
    ReactEditor, RenderElementProps, Slate, useFocused, useSelected, withReact
} from 'slate-react'

import { CustomEditor, CustomElement, MentionElement } from './custom-types'
import { CHARACTERS } from './data'

const Portal = ({ children }: { children: React.ReactNode }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

// https://github.com/ianstormtaylor/slate/blob/main/site/examples/mentions.tsx
// https://github.com/ianstormtaylor/slate/blob/main/site/examples/custom-types.d.ts
// https://github.com/ianstormtaylor/slate/blob/main/site/components.tsx

const MentionExample = () => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [target, setTarget] = useState<Range>()
    const [index, setIndex] = useState(0)
    const [search, setSearch] = useState('')
    const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
    const editor = useMemo(
        () => withMentions(withReact(withHistory(createEditor()))),
        []
    )

    // show first 10 search results
    const chars = CHARACTERS.filter(c =>
        c.toLowerCase().startsWith(search.toLowerCase())
    ).slice(0, 10)

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (target) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault()
                        const prevIndex = index >= chars.length - 1 ? 0 : index + 1
                        setIndex(prevIndex)
                        break
                    case 'ArrowUp':
                        event.preventDefault()
                        const nextIndex = index <= 0 ? chars.length - 1 : index - 1
                        setIndex(nextIndex)
                        break
                    case 'Tab':
                    case 'Enter':
                        // Tab and Enter have same functionality and they set the highlighted word
                        event.preventDefault()
                        console.log('TabEnter callback', { target })
                        Transforms.select(editor, target)
                        insertMention(editor, chars[index] || search)
                        // console.log(chars[index], search)
                        setTarget(undefined)
                        break
                    case 'Escape':
                        event.preventDefault()
                        setTarget(undefined)
                        break
                }
            }
        },
        [index, search, target, chars, editor]
    )

    useEffect(() => {
        if (target && chars.length > 0) {
            const el = dropdownRef.current
            const domRange = ReactEditor.toDOMRange(editor, target)
            const rect = domRange.getBoundingClientRect()
            el!.style.top = `${rect.top + window.pageYOffset + 24}px`
            el!.style.left = `${rect.left + window.pageXOffset}px`
        }
    }, [chars.length, editor, index, search, target])

    return (
        <Slate
            editor={editor}
            value={initialValue}
            onChange={() => {
                const { selection } = editor

                if (selection && Range.isCollapsed(selection)) {
                    const [start] = Range.edges(selection)
                    const wordBefore = Editor.before(editor, start, { unit: 'word' })

                    // https://stackoverflow.com/questions/12878612/assignment-with-double-ampersand

                    const before = wordBefore && Editor.before(editor, wordBefore)
                    const beforeRange = before && Editor.range(editor, before, start)

                    const beforeText = beforeRange && Editor.string(editor, beforeRange)
                    // Original example checks if word starts with @
                    // we match for \S
                    const beforeMatch = beforeText && beforeText.match(/^(\S+)$/)


                    const after = Editor.after(editor, start)
                    const afterRange = Editor.range(editor, start, after)
                    const afterText = Editor.string(editor, afterRange)
                    const afterMatch = afterText.match(/^(\s|$)/)

                    // https://stackoverflow.com/questions/63158777/output-the-variable-name-to-console
                    console.log({ beforeText, beforeMatch })
                    // console.log({ target, chars })

                    if (beforeMatch && afterMatch) {
                        setTarget(beforeRange)
                        setSearch(beforeMatch[1])
                        setIndex(0)
                        // target, search text and index are set and returned from this onChange handler
                        return
                    }
                }
                // target is set back to undefined
                setTarget(undefined)
                //  we don't care about search and index
            }}
        >
            <Editable
                renderElement={renderElement}
                onKeyDown={onKeyDown}
                placeholder="Enter some text..."
            />
            {target && chars.length > 0 && (
                // auto suggest menu
                <Portal>
                    <div
                        ref={dropdownRef}
                        style={{
                            top: '-9999px',
                            left: '-9999px',
                            position: 'absolute',
                            zIndex: 1,
                            padding: '3px',
                            background: 'white',
                            borderRadius: '4px',
                            boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                        }}
                        data-cy="mentions-portal"
                    >
                        {/* Auto corrected(?) suggestions */}
                        {chars.map((char, i) => (
                            <div
                                key={char}
                                style={{
                                    padding: '1px 3px',
                                    borderRadius: '3px',
                                    background: i === index ? '#B4D5FF' : 'transparent',
                                }}
                            >
                                {char}
                            </div>
                        ))}
                    </div>
                </Portal>
            )}
        </Slate>
    )
}

const withMentions = (editor: Editor) => {
    const { isInline, isVoid } = editor

    editor.isInline = (element: CustomElement) => {
        return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = (element: CustomElement) => {
        return element.type === 'mention' ? true : isVoid(element)
    }

    return editor
}

const insertMention = (editor: CustomEditor, character: string) => {
    const mention: CustomElement = {
        type: 'mention',
        character,
        children: [{ text: '' }],
    }
    Transforms.insertNodes(editor, mention)
    Transforms.move(editor)
}

const Element = (props: RenderElementProps) => {
    const { attributes, children, element } = props
    switch (element.type) {
        case 'mention':
            return <Mention {...props} />
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Mention = ({ attributes, children, element }: RenderElementProps) => {
    const mentionElement = element as MentionElement
    const selected = useSelected()
    const focused = useFocused()
    return (
        <span
            {...attributes}
            contentEditable={false}
            data-cy={`mention-${mentionElement.character.replace(' ', '-')}`}
            style={{
                padding: '3px 3px 2px',
                margin: '0 1px',
                verticalAlign: 'baseline',
                display: 'inline-block',
                borderRadius: '4px',
                backgroundColor: '#eee',
                fontSize: '0.9em',
                boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
                cursor: 'pointer',
            }}
        // onClick={ }
        >
            {children}{mentionElement.character}
        </span>
    )
}

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [
            {
                text:
                    'This example shows how you might implement a simple @-mentions feature that lets users autocomplete mentioning a user by their username. Which, in this case means Star Wars characters. The mentions are rendered as void inline elements inside the document.',
            },
        ],
    },
    {
        type: 'paragraph',
        children: [
            { text: 'Try mentioning characters, like ' },
            {
                type: 'mention',
                character: 'R2-D2',
                children: [{ text: '' }],
            },
            { text: ' or ' },
            {
                type: 'mention',
                character: 'Mace Windu',
                children: [{ text: '' }],
            },
            { text: '!' },
        ],
    },
]

export default MentionExample