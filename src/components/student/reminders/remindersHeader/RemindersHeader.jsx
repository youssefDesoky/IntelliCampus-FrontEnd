import Header from "../../../../layout/Header";

export default function RemindersHeader({ headerIcon, headerTitle, paragraphText, buttons = [] }) {
    const mappedButtons = (Array.isArray(buttons) ? buttons : []).map(btn => {
        if (btn.label === "Add Reminder" || btn.title === "Add Reminder") {
            return {
                ...btn,
                className: "inline-flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
            };
        }
        return {
            ...btn,
            className: btn.className || "p-2 rounded-md hover:bg-gray-100 text-gray-600"
        };
    });

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Header
                headerIcon={headerIcon}
                headerTitle={headerTitle}
                paragraphText={paragraphText}
                buttons={mappedButtons}
            />
        </div>
    );
}