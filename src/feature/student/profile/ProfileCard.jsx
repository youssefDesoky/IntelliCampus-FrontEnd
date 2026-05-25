import { useState, useEffect } from "react";
import { QRCodeIcon, UserIcon, BookIcon, CalendarCheckIcon, StarIcon } from "../../../components/ui/icons";
import Button from "../../../components/ui/Button";

export default function ProfileCard({ user, className = "" }) {
	const [isFlipped, setIsFlipped] = useState(false);
	const [countdown, setCountdown] = useState(30);

	useEffect(() => {
		if (!isFlipped) return;
		const timer = setInterval(() => {
			setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
		}, 1000);
		return () => clearInterval(timer);
	}, [isFlipped]);

	const stats = [
		{ label: "GPA", value: user.gpa, icon: StarIcon },
		{ label: "Attendance", value: user.attendance, icon: CalendarCheckIcon },
		{ label: "Year", value: user.year || "Senior", icon: BookIcon },
	];

	return (
		<div className={`group perspective-[1200px] ${className}`}>
			<div
				className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
				style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
			>
				{/* FRONT: Profile Overview */}
				<div
					className="relative w-full backface-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden shadow-md"
					style={{ backfaceVisibility: "hidden" }}
				>
					{/* Header Banner */}
					<div className="relative h-28 bg-linear-to-br from-accent-600 via-accent-700 to-accent-900">
						<button
							onClick={() => setIsFlipped(true)}
							className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold transition-all shadow-sm"
						>
							<QRCodeIcon size={14} />
							<span>Check-In QR</span>
						</button>
						<div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,white,transparent)]" />
					</div>

					{/* Profile Content */}
					<div className="px-6 pb-6">
						<div className="relative -mt-10 mb-4 flex items-end gap-3.5">
							<div className="relative">
								<div className="w-20 h-20 rounded-2xl ring-[4px] ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark overflow-hidden shadow-md bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
									<img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
								</div>
								<div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-green-500 border-[3px] border-bg-surface-primary-default-light dark:border-bg-surface-primary-default-dark" />
							</div>
							<div className="pb-1">
								<h2 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark tracking-tight">{user.name}</h2>
								<p className="text-xs font-semibold text-text-accent-default-light dark:text-text-accent-default-dark">{user.specialization}</p>
							</div>
						</div>

						<p className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-5">{user.faculty}</p>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-2.5 mb-5">
							{stats.map((stat) => (
								<div key={stat.label} className="flex flex-col items-center p-2.5 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark">
									<div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark mb-2 shadow-xs">
										<stat.icon size={14} />
									</div>
									<div className="text-md font-extrabold text-text-primary-default-light dark:text-text-primary-default-dark leading-none">{stat.value}</div>
									<div className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-1.5">{stat.label}</div>
								</div>
							))}
						</div>

						<Button variant="primary" width="w-full" className="rounded-xl h-10 text-xs font-bold">
							Edit Academic Profile
						</Button>
					</div>
				</div>

				{/* BACK: QR Code */}
				<div
					className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden shadow-md rotate-y-180 flex flex-col"
					style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
				>
					<div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-linear-to-b from-bg-surface-primary-default-light dark:from-bg-surface-primary-default-dark to-bg-surface-secondary-default-light dark:to-bg-surface-secondary-default-dark">
						<button
							onClick={() => setIsFlipped(false)}
							className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-[11px] font-bold transition-all"
						>
							<UserIcon size={14} />
							<span>Show Identity</span>
						</button>

						<div className="w-44 h-44 rounded-2xl bg-white p-3 shadow-md mb-4 border border-zinc-100">
							<img src={user.qrCode} alt="Attendance QR Code" className="w-full h-full object-contain" />
						</div>

						<h3 className="text-md font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-0.5">Attendance Gate Check</h3>
						<p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark text-center mb-5 max-w-[200px] leading-relaxed">
							Hold this card near the validation scanner.
						</p>

						<div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark shadow-xs">
							<QRCodeIcon size={12} className="text-text-accent-active-light dark:text-text-accent-active-dark animate-spin" style={{ animationDuration: "4s" }} />
							<span className="text-[11px] font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark">
								Token cycles in <span className="text-text-accent-active-light dark:text-text-accent-active-dark font-bold">{countdown}s</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}