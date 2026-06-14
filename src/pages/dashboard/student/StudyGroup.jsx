import { useEffect, useMemo, useState } from "react";
import { NavLink, useOutletContext } from "react-router-dom";

import Section from "../../../components/ui/Section";
import BaseComponent from "../../../components/ui/BaseComponent";
import StudyGroupPost from "../../../components/ui/StudyGroupPost";
import TextArea from "../../../components/ui/TextArea";

import {
    ArrowRightIcon,
    BookIcon,
    CalendarDaysIcon,
    CommentsIcon,
    PinIcon,
    UsersIcon,
    PaperclipIcon,
    PaperPlaneIcon,
} from "../../../components/ui/icons";
import { API_URL } from "../../../config/api";

const FILTERS = [
    { id: "all", label: "All posts" },
    { id: "pinned", label: "Pinned" },
    { id: "saved", label: "Saved" },
];

function StatCard({ label, value, helper, icon }) {
    return (
        <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{value}</p>
                    <p className="mt-1 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">{helper}</p>
                </div>

                <div className="rounded-xl bg-bg-surface-secondary-default-light p-3 text-text-accent-default-light dark:bg-bg-surface-secondary-default-dark dark:text-text-accent-default-dark">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function PromptCard({ title, description, icon, to }) {
    return (
        <NavLink
            to={to}
            className="group rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
        >
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-bg-surface-secondary-default-light p-3 text-text-accent-default-light dark:bg-bg-surface-secondary-default-dark dark:text-text-accent-default-dark">
                    {icon}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{title}</h4>
                    <p className="mt-1 text-sm leading-6 text-text-secondary-default-light dark:text-text-secondary-default-dark">{description}</p>
                </div>

                <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-text-tertiary-default-light transition-transform group-hover:translate-x-0.5 dark:text-text-tertiary-default-dark" />
            </div>
        </NavLink>
    );
}

export default function StudyGroup() {
    const { course } = useOutletContext();
    const [studyGroupsData, setStudyGroupsData] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [postDraft, setPostDraft] = useState("");
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        let ignore = false;

        async function loadCommunities() {
            try {
                const res = await fetch(`${API_URL}/api/communities`, { credentials: "include" });
                if (!res.ok) throw new Error(`Failed to fetch communities: ${res.status}`);
                const data = await res.json();
                if (!ignore) setStudyGroupsData(Array.isArray(data) ? data : []);
            } catch {
                if (!ignore) setStudyGroupsData([]);
            }
        }

        loadCommunities();
        return () => {
            ignore = true;
        };
    }, []);

    const studyGroup = useMemo(() => {
        if (!course) {
            return null;
        }

        return studyGroupsData.find((community) => community.courseId === course.id);
    }, [course]);

    const summary = useMemo(() => {
        if (!studyGroup) {
            return null;
        }

        const posts = studyGroup.posts || [];
        const pinnedPosts = posts.filter((post) => post.pinned);
        const commentsCount = posts.reduce((total, post) => total + (post.comments?.length || 0), 0);
        const likesCount = posts.reduce((total, post) => total + (post.likes || 0), 0);
        const latestPosts = [...posts]
            .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
            .slice(0, 3);

        return {
            posts,
            pinnedPosts,
            commentsCount,
            likesCount,
            latestPosts,
        };
    }, [studyGroup]);

    const filteredPosts = useMemo(() => {
        if (!summary) {
            return [];
        }

        switch (activeFilter) {
            case "pinned":
                return summary.pinnedPosts;
            case "saved":
                return summary.posts.filter((post) => post.saved);
            default:
                return summary.posts;
        }
    }, [activeFilter, summary]);

    if (!course) {
        return (
            <div className="py-10 text-center">
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading course...</p>
            </div>
        );
    }

    if (!studyGroup || !summary) {
        return (
            <div className="rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-accent-default-light dark:text-text-accent-default-dark">
                    <UsersIcon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No study group for this course</h3>
                <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">There are no study group posts configured for this course yet.</p>
            </div>
        );
    }

    const activeLabel = FILTERS.find((filter) => filter.id === activeFilter)?.label ?? "All posts";

    const handleAttachmentChange = (event) => {
        const files = Array.from(event.target.files || []);
        const newAttachments = files.map((file) => {
            const reader = new FileReader();
            let preview = null;

            if (file.type.startsWith("image/")) {
                reader.onload = (e) => {
                    preview = e.target?.result;
                };
                reader.readAsDataURL(file);
            }

            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                type: file.type,
                size: file.size,
                preview: preview,
            };
        });

        setAttachments((prev) => [...prev, ...newAttachments].slice(0, 5));
        event.target.value = "";
    };

    const removeAttachment = (attachmentId) => {
        setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
    };

    return (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
                <Section>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Discussion feed</p>
                        <h2 className="mt-1 text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                            {activeLabel}
                        </h2>
                        <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            Use the filters to focus on the threads that matter right now.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => {
                            const isActive = filter.id === activeFilter;

                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive ? "border-text-accent-default-light bg-text-accent-default-light text-white dark:border-text-accent-default-dark dark:bg-text-accent-default-dark" : "border-border-primary-default-light bg-bg-surface-secondary-default-light text-text-secondary-default-light hover:bg-bg-surface-primary-default-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-secondary-default-dark dark:hover:bg-bg-surface-primary-default-dark"}`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6">
                    {filteredPosts.length > 0 ? (
                        <menu className="space-y-4">
                            {filteredPosts.map((post) => (
                                <StudyGroupPost
                                    key={post.id}
                                    postData={post}
                                    department={studyGroup.department}
                                />
                            ))}
                        </menu>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark p-8 text-center">
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">No posts match this filter.</p>
                        </div>
                    )}
                </div>
                </Section>

                <Section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Helpful next steps</p>
                            <h3 className="mt-1 text-xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">What to do here</h3>
                        </div>
                        <UsersIcon className="h-5 w-5 text-text-accent-default-light dark:text-text-accent-default-dark" />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <PromptCard
                            to="../materials"
                            icon={<BookIcon className="h-5 w-5" />}
                            title="Share what you learned"
                            description="Post summaries, screenshots, or notes from recent lectures so others can catch up faster."
                        />
                        <PromptCard
                            to="../assignments"
                            icon={<CommentsIcon className="h-5 w-5" />}
                            title="Ask about an assignment"
                            description="Use the study group to get quick help when a task needs a second look or a clearer explanation."
                        />
                        <PromptCard
                            to="../quizzes"
                            icon={<CalendarDaysIcon className="h-5 w-5" />}
                            title="Plan revision time"
                            description="Coordinate a study session before quizzes and exams so the group stays aligned and prepared."
                        />
                    </div>
                </Section>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-20 xl:self-start">
                <BaseComponent
                    title="Start a thread"
                    description={`Posting as a student in ${studyGroup.department}`}
                    componentButton={<PaperPlaneIcon className="h-5 w-5 text-text-accent-default-light dark:text-text-accent-default-dark" />}
                    contentClassName="space-y-4"
                >
                    <TextArea
                        value={postDraft}
                        onChange={(event) => setPostDraft(event.target.value)}
                        placeholder="Write a question, share notes, or ask for help..."
                        className="w-full rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark px-4 py-3 text-sm text-text-primary-default-light outline-none transition-colors placeholder:text-text-tertiary-default-light focus:border-text-accent-default-light dark:text-text-primary-default-dark dark:placeholder:text-text-tertiary-default-dark dark:focus:border-text-accent-default-dark"
                    />

                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">Attachments ({attachments.length}/5)</p>
                            <div className="grid gap-2 grid-cols-2 xs:grid-cols-3">
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="group relative overflow-hidden rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-2 transition-colors hover:bg-bg-surface-primary-default-light dark:hover:bg-bg-surface-primary-default-dark"
                                    >
                                        {attachment.type.startsWith("image/") ? (
                                            <div className="relative h-20 w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                                                <img
                                                    src={attachment.preview}
                                                    alt={attachment.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-20 w-full items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                                                <span className="text-xs font-bold text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase">
                                                    {attachment.name.split(".").pop()}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(attachment.id)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <span className="text-xs font-semibold text-white">Remove</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-3 text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                            onChange={handleAttachmentChange}
                            hidden
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById("file-input")?.click()}
                            disabled={attachments.length >= 5}
                            className="inline-flex items-center gap-2 rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark px-3 py-2 font-medium transition-colors hover:bg-bg-surface-secondary-default-light disabled:opacity-50 dark:hover:bg-bg-surface-secondary-default-dark"
                        >
                            <PaperclipIcon className="h-4 w-4" />
                            Attach file
                        </button>
                        <span>{postDraft.length}/500</span>
                    </div>

                    <button
                        type="button"
                        disabled={!postDraft.trim()}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-text-accent-default-light px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-text-accent-hover-light disabled:opacity-50 dark:bg-text-accent-default-dark dark:hover:bg-text-accent-hover-dark"
                    >
                        <PaperPlaneIcon className="h-4 w-4" />
                        Post to study group
                    </button>
                </BaseComponent>

                <Section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Study group stats</p>
                            <h3 className="mt-1 text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">Quick overview</h3>
                        </div>
                        <PinIcon className="h-5 w-5 text-text-accent-default-light dark:text-text-accent-default-dark" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <StatCard
                            label="Threads"
                            value={summary.posts.length}
                            helper={`${summary.pinnedPosts.length} pinned posts`}
                            icon={<BookIcon className="h-5 w-5" />}
                        />
                        <StatCard
                            label="Comments"
                            value={summary.commentsCount}
                            helper="Replies across the feed"
                            icon={<CommentsIcon className="h-5 w-5" />}
                        />
                    </div>
                </Section>
            </aside>
        </div>
    );
}
