import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import AssessmentBreakdown from "./AssessmentBreakdown";
import CurrentGrade from "./CurrentGrade";
import GradeComplaint from "./GradeComplaint";
import GradeHistory from "./GradeHistory";
import { fetchCourseGrade } from "../../gradeApi";
import { useError } from '../../../../../contexts/ErrorContext.jsx';
import { useDeviceType } from '../../../../../hooks';

const PAGE_SIZE = 3;

export default function CourseGrade() {
	const { course } = useOutletContext();
	const { isPhone } = useDeviceType();
	const [currentPage, setCurrentPage] = useState(1);
	const [gradeData, setGradeData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { showError } = useError();

	const loadGradeData = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await fetchCourseGrade(course.id);
			setGradeData(data || null);
		} catch (err) {
			showError(err.message);
			setGradeData(null);
		} finally {
			setIsLoading(false);
		}
	}, [course.id]);

	useEffect(() => {
		if (course?.id) {
			loadGradeData();
		}
	}, [loadGradeData, course?.id]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-600">Loading grade data...</p>
			</div>
		);
	}

	if (!gradeData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-gray-600 mb-4">No grades yet for this course</p>
					<p className="text-sm text-gray-500 mb-4">Grades will appear here once your instructor has graded your work.</p>
				</div>
			</div>
		);
	}

	const { overallGrade, assessmentBreakdown, history } = gradeData;
	const gradedItems = history?.filter((item) => item.status === "Graded") || [];

	return (
		<div className="relative overflow-hidden">
			<div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-900/20" />
			<div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-900/20" />

			{isPhone ? (
				<div className="relative flex flex-col gap-6">
					<CurrentGrade gradePercent={overallGrade.percent} letterGrade={overallGrade.letter} gradedItems={gradedItems} items={history} />
					<AssessmentBreakdown groups={assessmentBreakdown} />
					<GradeHistory items={history} currentPage={currentPage} setCurrentPage={setCurrentPage} />
					<GradeComplaint items={history} />
				</div>
			) : (
				<div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<AssessmentBreakdown groups={assessmentBreakdown} />
					</div>
					<div className="flex flex-col gap-6 lg:h-full">
						<CurrentGrade className="flex-1" gradePercent={overallGrade.percent} letterGrade={overallGrade.letter} gradedItems={gradedItems} />
						<GradeComplaint className="flex-1" items={history} />
					</div>
				</div>
			)}

			{/* Grade History - desktop only */}
			{!isPhone && (
				<div className="relative mt-6">
					<GradeHistory items={history} currentPage={currentPage} setCurrentPage={setCurrentPage} />
				</div>
			)}
		</div>
	);
}
