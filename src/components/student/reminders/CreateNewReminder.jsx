export default function CreateNewReminder() {
    return (
        <form>
            <div className="form-header flex items-center justify-between p-4 border-b border-gray-200">
                <h2>Add New Reminder</h2>
                <button type="button" className="btn-close" aria-label="Close">&times;</button>
            </div>

            <div className="form-body">
                <div className="input-group">
                    <label htmlFor="reminder-title">Title</label>
                    <input type="text" id="reminder-title" name="reminder-title" placeholder="Enter reminder title" />
                </div>

                <div className="input-group">
                    <label htmlFor="reminder-category">Category</label>
                    <select name="reminder-category" id="reminder-category">
                        <option value="">Class</option>
                        <option value="">Exam</option>
                        <option value="">Assignment</option>
                        <option value="">Personal</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="reminder-date">Date</label>
                    <input type="date" id="reminder-date" name="reminder-date" />

                    <label htmlFor="reminder-time">Time</label>
                    <input type="time" id="reminder-time" name="reminder-time" />
                </div>

                <div className="input-group">
                    <label htmlFor="reminder-priority">Priority</label>
                    <select name="reminder-priority" id="reminder-priority">
                        <option value="">Low</option>
                        <option value="">Medium</option>
                        <option value="">High</option>
                    </select>
                </div>
            </div>

            <div className="form-footer flex items-center justify-end p-4 border-t border-gray-200">
                <button type="button" className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Reminder</button>
            </div>
        </form>
    );
}