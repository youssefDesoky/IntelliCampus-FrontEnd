import { useMemo } from "react";
import BaseComponent from "../../../../../components/ui/BaseComponent";
import PaginationButtons from "../../../../../components/ui/PaginationButtons";
import { CheckIcon, SandClockIcon } from "../../../../../components/ui/icons";
import GradeListItem from "./GradeListItem";

const PAGE_SIZE = 3;

function toPercent(score, maxScore) {
	if (!maxScore) return 0;
	return Math.round((score / maxScore) * 100);
}

export default function GradeHistory({ items, currentPage, setCurrentPage }) {
	const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
	const pagedItems = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return items.slice(start, start + PAGE_SIZE);
	}, [items, currentPage]);

	return (
		<BaseComponent
			title="Grade History"
			subtitle="Detailed view of all assessments"
			contentClassName="px-5 py-5 sm:px-6 space-y-4"
		>
			{pagedItems.length > 0 ? (
				<>
					<div className="space-y-3">
						{pagedItems.map((item) => (
							<GradeListItem key={item.id} item={item} toPercent={toPercent} />
						))}
					</div>

					{totalPages > 1 && (
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
							<p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
								showing {pagedItems.length} of {items.length} assessments
							</p>
							<PaginationButtons totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
						</div>
					)}
				</>
			) : (
				<div className="text-center py-8">
					<p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">No grade history yet.</p>
				</div>
			)}
		</BaseComponent>
	);
}
