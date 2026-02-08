import { API_URL } from "../../../config/api";

/**
 * Fetch organized course materials (folders with materials)
 * GET /api/materials/course/:courseId/organized
 */
export async function fetchCourseMaterialsOrganized(courseId) {
    const res = await fetch(`${API_URL}/api/materials/course/${courseId}/organized`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch materials: ${res.status}`);
    return res.json();
}

/**
 * Fetch materials by course (flat list)
 * GET /api/materials/course/:courseId
 */
export async function fetchCourseMaterials(courseId) {
    const res = await fetch(`${API_URL}/api/materials/course/${courseId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch materials: ${res.status}`);
    return res.json();
}

/**
 * Fetch folders for a course
 * GET /api/materials/course/:courseId/folders
 */
export async function fetchCourseFolders(courseId) {
    const res = await fetch(`${API_URL}/api/materials/course/${courseId}/folders`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to fetch folders: ${res.status}`);
    return res.json();
}

/**
 * Create a new material (instructor only)
 * POST /api/materials (multipart/form-data)
 */
export async function createMaterial(formData) {
    const res = await fetch(`${API_URL}/api/materials`, {
        method: "POST",
        credentials: "include",
        body: formData, // FormData — browser sets Content-Type automatically
    });
    if (!res.ok) {
        let errorMsg = `Failed to create material: ${res.status}`;
        try {
            const errBody = await res.text();
            // Try parsing as JSON for structured errors
            try {
                const errJson = JSON.parse(errBody);
                errorMsg = errJson.message || errJson.title || errJson.detail
                    || (errJson.errors ? JSON.stringify(errJson.errors) : errorMsg);
            } catch {
                if (errBody) errorMsg = errBody;
            }
        } catch { /* ignore */ }
        console.error("Upload error response:", res.status, errorMsg);
        throw new Error(errorMsg);
    }
    return res.json();
}

/**
 * Delete a material (instructor only)
 * DELETE /api/materials/:id
 */
export async function deleteMaterial(materialId) {
    const res = await fetch(`${API_URL}/api/materials/${materialId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete material: ${res.status}`);
    }
    return true;
}

/**
 * Download a material
 * GET /api/materials/:id/download
 */
export function getMaterialDownloadUrl(materialId) {
    return `${API_URL}/api/materials/${materialId}/download`;
}

/**
 * Create a new folder (instructor only)
 * POST /api/materials/folders
 */
export async function createFolder({ name, description, courseId }) {
    const res = await fetch(`${API_URL}/api/materials/folders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Description: description, CourseId: courseId }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to create folder: ${res.status}`);
    }
    return res.json();
}

/**
 * Update a folder (instructor only)
 * PUT /api/materials/folders/:folderId
 */
export async function updateFolder(folderId, { name, description }) {
    const res = await fetch(`${API_URL}/api/materials/folders/${folderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Description: description }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to update folder: ${res.status}`);
    }
    return res.json();
}

/**
 * Delete a folder (instructor only)
 * DELETE /api/materials/folders/:folderId
 */
export async function deleteFolder(folderId) {
    const res = await fetch(`${API_URL}/api/materials/folders/${folderId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete folder: ${res.status}`);
    }
    return true;
}
