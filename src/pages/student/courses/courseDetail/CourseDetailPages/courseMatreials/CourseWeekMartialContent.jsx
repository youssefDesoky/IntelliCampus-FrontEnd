
// Icons
import DownloadIcon from "../../../../../../components/icons/DownloadIcon";
import EyeIcon from "../../../../../../components/icons/EyeIcon";
import FileLinesIcon from "../../../../../../components/icons/FileLinesIcon";

export default function CourseWeekMartialContent({material}) {
    return (
        <li className="flex items-center justify-between p-4 border-t border-muted-border-light dark:border-muted-border-dark">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-muted-bg-light dark:bg-muted-bg-dark rounded-lg">
                    <FileLinesIcon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-[16px] font-medium">{material.title}</h4>
                    <p className="text-sm font-semibold text-muted-text-light dark:text-muted-text-dark">{material.size} MB</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-muted-text-light dark:text-muted-text-dark">
                <button>
                    <EyeIcon className="w-6 h-6 mr-4 text" />
                </button>
                <button>
                    <DownloadIcon className="w-6 h-6" />
                </button>
            </div>
        </li>
    );
}