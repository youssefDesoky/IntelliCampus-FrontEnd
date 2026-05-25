import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchCourseAnnouncements } from "../../../../course/components/announcements";
import CourseAnnouncementCard from "../../../../course/components/announcements/CourseAnnouncementCard";


export default function CourseAnnouncements() {
    const outletContext = useOutletContext();
    const user = outletContext?.user;
    const courseId = outletContext?.courseId;
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAnnouncements = useCallback(async () => {
        if (!courseId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchCourseAnnouncements(courseId);
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load announcements.");
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        loadAnnouncements();
    }, [loadAnnouncements]);


    if (loading) {
        return <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading announcements...</p>;
    }

    if (error) {
        return <p className="text-sm text-text-danger-default-light dark:text-text-danger-default-dark">{error}</p>;
    }

    if (announcements.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border-primary-default-light bg-bg-surface-primary-default-light p-6 text-center dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">No announcements yet</h3>
                <p className="mt-2 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    There are no announcements for this course right now.
                </p>
            </div>
        );
    }

	return (
		<div className="space-y-4">
            {announcements.map((announcement) => (
                <CourseAnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    currentUser={user}
                    courseId={courseId}
                    userRole="student"
                />
            ))}
        </div>
	);
}