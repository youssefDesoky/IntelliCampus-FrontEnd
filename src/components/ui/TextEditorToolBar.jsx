import {
    LargeSmallIcon,
    BoldIcon, 
    ItalicIcon, 
    OrderedListIcon, 
    UnorderedListIcon, 
    StrikeThoughtIcon, 
    UnderlineIcon, 
    HighlighterIcon,
    AlignCenterIcon, 
    AlignStartIcon,
    LinkIcon,
    UndoIcon 
} from "./icons"

export default function TextEditorToolBar({ editor }) {
    if (!editor) return null;

    return (
        <ul className="flex gap-4 justify-between p-2 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex gap-4">
                <li key="toggleSize">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleTextStyle('large').run()}
                        className={editor.isActive('large') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <LargeSmallIcon className="w-6 h-6" />
                    </button>
                </li>
                
                <li key="bold">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <BoldIcon className="w-6 h-6" />
                    </button>
                </li>
                
                <li key="italic">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <ItalicIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="underline">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <UnderlineIcon className="w-6 h-6" />
                    </button>
                </li>
                
                <li key="strike">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <StrikeThoughtIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="orderedList">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <OrderedListIcon className="w-6 h-6" />
                    </button>
                </li>
                
                <li key="bulletList">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <UnorderedListIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="highlight">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={editor.isActive('highlight') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <HighlighterIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="link">
                    <button 
                        type="button"
                        onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }}
                        className={editor.isActive('link') ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <LinkIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="alignStart">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={editor.isActive({ textAlign: 'left' }) ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <AlignStartIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="alignCenter">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={editor.isActive({ textAlign: 'center' }) ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <AlignCenterIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="alignEnd">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={editor.isActive({ textAlign: 'right' }) ? 'text-text-accent-default-light dark:text-text-accent-default-dark' : ''}
                    >
                        <AlignStartIcon className="w-6 h-6 -scale-x-100" />
                    </button>
                </li>
            </div>

            <div className="flex gap-4">
                <li key="undo">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        className={`${editor.can().undo() ? '' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        <UndoIcon className="w-6 h-6" />
                    </button>
                </li>

                <li key="redo">
                    <button 
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        className={`${editor.can().redo() ? '' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        <UndoIcon className="w-6 h-6 -scale-x-100" />
                    </button>
                </li>
            </div>
        </ul>
    );
}