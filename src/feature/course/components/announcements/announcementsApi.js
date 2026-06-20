import { API_URL } from "../../../../config/api";
import { dispatchNotificationsChanged } from "../../../../api/notifications";

function getBaseUrl() {
    return API_URL;
}

export async function fetchCourseAnnouncements(courseId) {
    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements`, {
        credentials: "include",
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to fetch announcements: ${res.status}`);
    }

    return res.json();
}

export async function createCourseAnnouncement(courseId, content, attachments = []) {
    const formData = new FormData();
    formData.append("content", content);

    if (attachments && attachments.length > 0) {
        attachments.forEach((file, index) => {
            formData.append(`attachments`, file);
        });
    }

    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to create announcement: ${res.status}`);
    }

    dispatchNotificationsChanged();
    return res.json();
}

export async function updateCourseAnnouncement(courseId, announcementId, content, attachments = []) {
    const formData = new FormData();
    formData.append("content", content);

    if (attachments && attachments.length > 0) {
        attachments.forEach((file, index) => {
            formData.append(`attachments`, file);
        });
    }

    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements/${announcementId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to update announcement: ${res.status}`);
    }

    dispatchNotificationsChanged();
    return res.json();
}

export async function deleteCourseAnnouncement(courseId, announcementId) {
    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements/${announcementId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to delete announcement: ${res.status}`);
    }

    dispatchNotificationsChanged();
    return res.json();
}

export async function pinCourseAnnouncement(courseId, announcementId) {
    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements/${announcementId}/pin`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPinned: true }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to pin announcement: ${res.status}`);
    }

    dispatchNotificationsChanged();
    return res.json();
}

export async function unpinCourseAnnouncement(courseId, announcementId) {
    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements/${announcementId}/pin`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPinned: false }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to unpin announcement: ${res.status}`);
    }

    dispatchNotificationsChanged();
    return res.json();
}

export async function createAnnouncementComment(courseId, announcementId, content) {
    const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}/announcements/${announcementId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Failed to create comment: ${res.status}`);
    }

    dispatchNotificationsChanged();
    return res.json();
}
