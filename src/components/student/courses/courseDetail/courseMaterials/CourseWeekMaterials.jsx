import CourseWeekMaterialContent from "./CourseWeekMaterialContent";

export default function CourseWeekMaterials({weekData}) {
    return (
        <div className="mt-6 bg-surface-bg-light dark:bg-surface-bg-dark shadow-md rounded-lg hover:shadow-lg dark:hover:shadow-blue-950 transition-shadow duration-300 ease-in-out">
            <div className="p-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{weekData.topic}</h3>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">{weekData.description}</p>
            </div>

            <div className="flex flex-col gap-2">
                {weekData.materials.length === 0 ? (
                    <p>No materials available for this week.</p>
                ) : (
                    <menu className="flex flex-col">
                        {weekData.materials.map((material, index) => (
                            <CourseWeekMaterialContent 
                                key={index} 
                                material={material} 
                            />
                        ))}
                    </menu>
                )}
            </div>
        </div>
    );
}