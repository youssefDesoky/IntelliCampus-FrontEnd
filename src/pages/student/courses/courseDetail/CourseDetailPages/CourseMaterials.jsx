export default function CourseMaterials() {
    return (
        <section>
            <div>
                <h2>Course Materials</h2>
                <select name="courseMaterials" id="courseMaterials">
                    <option value="">All Weeks</option>
                    <option value="week1">Week 1</option>
                    <option value="week2">Week 2</option>
                    <option value="week3">Week 3</option>
                    <option value="week4">Week 4</option>
                </select>
                <Button className="inline-flex items-center gap-2 bg-green-500 text-white text-md font-bold px-4 py-2 rounded-lg shadow-sm duration-300 hover:bg-green-600 transition-colors cursor-pointer">
                    <span>Download All</span>
                </Button>
            </div>
            <div>
                
            </div>
        </section>
    )
}