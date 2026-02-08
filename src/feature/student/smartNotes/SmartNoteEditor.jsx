import { Form } from "react-router-dom";

import Tiptap from "../ui/Tiptap";
import ModelOverlay from "../../../components/ui/ModelOverlay";

export default function SmartNoteEditor({note, onClose}) {
    return (
        <ModelOverlay>
            <Form 
                method="post" 
                className="z-900 w-full max-w-5xl h-[90vh] rounded-2xl p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="top-4 right-4 text-icon-secondary-default-light dark:text-icon-primary-default-dark hover:text-icon-primary-active-light dark:hover:text-icon-primary-active-dark transition-colors duration-200"
                >
                    Close
                </button>
                
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Note Title" 
                    className="p-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark"
                    defaultValue={note?.title || ""}
                    onChange={(e) => {
                        sessionStorage.setItem("session", JSON.stringify({
                            id: note?.id || null,
                            title: e.target.value,
                            body: note?.content || ""
                        }));
                    }}
                />

                <Tiptap content={note?.content || ""} onChange={(content) => {
                    sessionStorage.setItem("session", JSON.stringify({
                        id: note?.id || null,
                        title: note?.title || "",
                        body: content
                    }));
                }} />
            </Form>
        </ModelOverlay>
    );
}