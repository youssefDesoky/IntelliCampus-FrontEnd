import Button from "./Button";
import { CloudUploadIcon } from "./icons";
import Section from "./Section";

export default function QuickUpload() {
    return (
        <Section className="flex flex-col gap-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-6">
            <h2 className="text-lg font-semibold">Quick Upload</h2>

            <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border-tertiary-default-light dark:border-border-tertiary-default-dark hover:border-border-tertiary-hover-light dark:hover:border-border-tertiary-hover-dark rounded-lg p-6 cursor-pointer hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark">
                <div className="flex items-center justify-center rounded-full text-icon-accent-default-light dark:text-icon-accent-default-dark">
                    <CloudUploadIcon size={48} />
                </div>

                <div className="text-center">
                    <h3 className="text-md font-medium">Upload files here to upload</h3>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">or click to browse</p>
                </div>

                <Button
                    variant="primary"
                    
                >
                    Choose Files
                </Button>
            </div>

            <div className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark space-y-1">
                <p>Supported formats: PDF, DOC, DOCX, PPT, PPTX</p>
                <p>Maximum file size: 50MB</p>
            </div>
        </Section>
    );
}