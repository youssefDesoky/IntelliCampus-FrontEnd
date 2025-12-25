import Section from "../../../components/ui/Section";
// Icons
import EllipsisHorizontalIcon from "../../../components/icons/EllipsisHorizontalIcon";

export default function StudyTimer({className}) {
    return (
        <Section className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg flex flex-col justify-between ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Study Timer</h2>
            <button>
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
          </div>

            <div className="relative w-48 h-48 mx-auto mb-4">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full rotate-90"
                >
                    {/* Background square */}
                    <rect
                        x="8"
                        y="8"
                        width="84"
                        height="84"
                        rx="10"
                        ry="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-300 dark:text-gray-700"
                    />

                    {/* Progress square */}
                    <rect
                        x="8"
                        y="8"
                        width="84"
                        height="84"
                        rx="10"
                        ry="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray="336"
                        strokeDashoffset="84"
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-500"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold">15:00</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                    Focus Mode
                    </p>
                </div>
            </div>


          <div className="flex items-center justify-center border-t pt-4 border-default-border-light dark:border-default-border-dark">
            <button className="bg-blue-600 text-white px-4 py-2 w-[80%] rounded-lg hover:bg-blue-700 transition duration-200">Start</button>
          </div>
        </Section>
    );
}