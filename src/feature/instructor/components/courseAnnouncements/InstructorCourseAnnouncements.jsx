import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCourseAnnouncements, createCourseAnnouncement, updateCourseAnnouncement } from "../../../course/components/announcements";
import CourseAnnouncementCard from "../../../course/components/announcements/CourseAnnouncementCard";
import Button from "../../../../components/ui/Button";
import TextArea from "../../../../components/ui/TextArea";
import { PlusIcon, XIcon } from "../../../../components/ui/icons";
import BaseFormComponent from "../../../../components/ui/BaseFormComponent";
import { useError } from '../../../../contexts/ErrorContext.jsx';

export default function InstructorCourseAnnouncements() {
    const outletContext = useOutletContext();
    const user = outletContext?.user;
    const courseId = outletContext?.courseId;
    const { showError } = useError();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    const queryClient = useQueryClient();

    const { data: announcements = [], isLoading: loading } = useQuery({
        queryKey: ["instructorCourseAnnouncements", courseId],
        queryFn: () => fetchCourseAnnouncements(courseId),
        staleTime: 5 * 60 * 1000,
        enabled: !!courseId,
        select: (data) => Array.isArray(data) ? data : [],
    });

    const handleAddAttachment = (event) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (selectedFiles.length > 0) {
            setAttachments((prev) => [...prev, ...selectedFiles]);
        }
        event.target.value = "";
    };

    const handleRemoveAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = content.trim();
        if (!text) {
            showError("Please enter announcement content");
            return;
        }

        setIsSubmitting(true);

        try {
            if (editingAnnouncement) {
                await updateCourseAnnouncement(courseId, editingAnnouncement.id, text, attachments);
            } else {
                await createCourseAnnouncement(courseId, text, attachments);
            }

            setContent("");
            setAttachments([]);
            setEditingAnnouncement(null);
            setShowCreateForm(false);
            queryClient.invalidateQueries({ queryKey: ["instructorCourseAnnouncements", courseId] });
        } catch (err) {
            showError(`Failed to ${editingAnnouncement ? "update" : "create"} announcement: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (announcement) => {
        setEditingAnnouncement(announcement);
        setContent(announcement.content);
        setAttachments([]);
        setShowCreateForm(true);
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setContent("");
        setAttachments([]);
        setEditingAnnouncement(null);
    };

    const handleDeleteAnnouncement = (announcementId) => {
        queryClient.invalidateQueries({ queryKey: ["instructorCourseAnnouncements", courseId] });
    };

    const handlePinAnnouncement = (announcementId) => {
        queryClient.invalidateQueries({ queryKey: ["instructorCourseAnnouncements", courseId] });
    };

    const handleUnpinAnnouncement = (announcementId) => {
        queryClient.invalidateQueries({ queryKey: ["instructorCourseAnnouncements", courseId] });
    };

    // Sort announcements: pinned first, then by date descending
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if (a.isPinned === b.isPinned) {
            return new Date(b.date) - new Date(a.date);
        }
        return a.isPinned ? -1 : 1;
    });

    if (loading) {
        return <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading announcements...</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                    Announcements
                </h2>
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowCreateForm(true)}
                    startIcon={<PlusIcon size={18} />}
                >
                    Add New Announcement
                </Button>
            </div>

            {/* Create/Edit Announcement Form Modal */}
            <BaseFormComponent
                isOpen={showCreateForm}
                title={editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
                description={editingAnnouncement ? "Update your announcement details below." : "Share an update with your students."}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                submitText={editingAnnouncement ? "Update" : "Post"}
                submitDisabled={isSubmitting || !content.trim()}
                submitLoading={isSubmitting}
                maxWidth="max-w-2xl"
                contentClassName="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        Content
                    </label>
                    <TextArea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter announcement content..."
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border rounded-lg border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark placeholder-text-secondary-default-light dark:placeholder-text-secondary-default-dark outline-none focus:border-border-primary-focus-light dark:focus:border-border-primary-focus-dark disabled:opacity-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        Attachments
                    </label>
                    <input
                        type="file"
                        multiple
                        onChange={handleAddAttachment}
                        disabled={isSubmitting}
                        className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-colors file:mr-3 file:rounded-lg file:border-0 file:bg-bg-fill-primary-default-light file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-primary-default-light hover:file:bg-bg-fill-primary-hover-light focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark dark:file:bg-bg-fill-primary-default-dark dark:file:text-text-primary-default-dark dark:hover:file:bg-bg-fill-primary-hover-dark"
                    />
                    <p className="mt-2 text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        You can select multiple files.
                    </p>

                    {attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark rounded-lg"
                                >
                                    <span className="text-sm text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttachment(index)}
                                        disabled={isSubmitting}
                                        className="p-1 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark rounded disabled:opacity-50"
                                    >
                                        <XIcon size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </BaseFormComponent>

            {/* Announcements List */}
            {announcements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-primary-default-light bg-bg-surface-primary-default-light p-6 text-center dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                    <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No announcements yet</h3>
                    <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        Create your first announcement to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedAnnouncements.map((announcement) => (
                        <CourseAnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            currentUser={user}
                            courseId={courseId}
                            onDelete={handleDeleteAnnouncement}
                            onEdit={handleEditClick}
                            onPin={handlePinAnnouncement}
                            onUnpin={handleUnpinAnnouncement}
                            userRole="instructor"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
