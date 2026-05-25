import { API_URL } from "../../config/api";

/**
 * Get reminders for a specific day
 * GET /api/reminders?selectedDay=2026-05-20
 * Backend returns pre-grouped data, we flatten and deduplicate it
 */
export async function fetchRemindersByDay(selectedDay) {
    const dateStr = selectedDay instanceof Date 
        ? selectedDay.toISOString().split('T')[0]
        : selectedDay;
    
    const url = `${API_URL}/api/reminders?selectedDay=${dateStr}`;
    console.log("Fetching reminders from:", url);
    
    const res = await fetch(url, {
        credentials: "include",
    });
    
    if (!res.ok) {
        console.error("Reminders API error:", res.status, res.statusText);
        throw new Error(`Failed to fetch reminders: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Backend returns pre-grouped data: { selectedDay: [...], nextDay: [...], week: [...] }
    // Flatten to single array and deduplicate by ID for component to re-group
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        const allReminders = [
            ...(Array.isArray(data.selectedDay) ? data.selectedDay : []),
            ...(Array.isArray(data.nextDay) ? data.nextDay : []),
            ...(Array.isArray(data.week) ? data.week : []),
        ];
        
        // Deduplicate by ID
        const seen = {};
        const deduplicated = allReminders.filter((reminder) => {
            if (seen[reminder.id]) {
                return false; // Skip duplicate
            }
            seen[reminder.id] = true;
            return true;
        });
        
        console.log("Flattened reminders:", deduplicated);
        return deduplicated;
    }
    
    return Array.isArray(data) ? data : [];
}

/**
 * Create a new personal reminder
 * POST /api/reminders
 */
export async function createReminder(reminderData) {
    const res = await fetch(`${API_URL}/api/reminders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderData),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create reminder: ${res.status}`);
    }
    return res.json();
}

/**
 * Update an existing reminder
 * PUT /api/reminders/{id}
 */
export async function updateReminder(reminderId, reminderData) {
    const res = await fetch(`${API_URL}/api/reminders/${reminderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderData),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to update reminder: ${res.status}`);
    }
    return res.json();
}

/**
 * Delete a reminder
 * DELETE /api/reminders/{id}
 */
export async function deleteReminder(reminderId) {
    const res = await fetch(`${API_URL}/api/reminders/${reminderId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete reminder: ${res.status}`);
    }
    return true;
}
