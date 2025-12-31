export default function BoxData({ icon, title, value, iconStyle="", ...props }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200" {...props}>
            <div className={`w-12 h-12 p-3 rounded-md ${iconStyle} flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="font-[14px] text-gray-600">{title}</p>
            <h2 className="font-[30px] text-gray-800">{value}</h2>
        </div>
    );
}