import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

// https://docs.slatejs.org/concepts/12-typescript#defining-editor-element-and-text-types



type NormalText = { text: string; };

type MentionElement = {
    type: 'mention'
    character: string
    children: NormalText[]
};

type CustomText = NormalText | MentionElement;

type ParagraphElement = {
    type: 'paragraph'
    children: CustomText[]
}

export type CustomElement = ParagraphElement | MentionElement

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}
