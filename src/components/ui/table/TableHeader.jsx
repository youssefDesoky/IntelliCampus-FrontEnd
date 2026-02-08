export default function TableHeader({ headerData, selectAll, setSelectAll }) {
    return (
        <thead className="bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <tr>
                <th className="p-3">
                    <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={() => setSelectAll(!selectAll)} 
                    />
                </th>

                {headerData.map((header, index) => (
                    <th key={index} className="p-3">
                        {header}
                    </th>
                ))}
                
                <th className="p-3">Actions</th>
            </tr>
        </thead>
    );
}