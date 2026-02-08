import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextEditorToolBar from '../../../components/ui/TextEditorToolBar'

export default function Tiptap({ content = '', onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Highlight,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    if (!editor) return null

    return (
        <div className="border rounded-md border-border-primary-active-light">
            <TextEditorToolBar editor={editor} />
            <EditorContent editor={editor} className="min-h-25 border-t border-border-primary-active-light dark:border-border-primary-active-dark p-2 prose prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6" />
        </div>
    )
}