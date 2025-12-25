import { useState } from "react";

export default function ProfileSummary({ studentData }) {
    const [isFrontFace, setIsFrontFace] = useState(false);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm w-full">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {isFrontFace ? "Attendance QR Code" : "Profile Summary"}
                </h2>
                <button
                    type="button"
                    onClick={() => setIsFrontFace(!isFrontFace)}
                    aria-pressed={!isFrontFace}
                    className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center cursor-none"
                    title={isFrontFace ? "Show profile" : "Show Attendance QR code"}
                >
                    <span className={`transform transition-transform duration-300 ${isFrontFace ? "rotate-0" : "rotate-180"} w-5 h-5 text-gray-500`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5">
                            <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
                        </svg>
                    </span>
                </button>
            </div>

            <div id="profile-summary-front " className={isFrontFace ? "hidden" : ""}>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={studentData.profileImage}
                            alt={studentData.name}
                            className="w-30 h-30 rounded-lg object-cover border-4 border-white shadow-sm"
                        />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-800">{studentData.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{studentData.specialization} Student</p>

                    <div className="mt-3">
                        <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4">
                                <path d="M320.3 192L235.7 51.1C229.2 40.3 215.6 36.4 204.4 42L117.8 85.3C105.9 91.2 101.1 105.6 107 117.5L176.6 256.6C146.5 290.5 128.3 335.1 128.3 384C128.3 490 214.3 576 320.3 576C426.3 576 512.3 490 512.3 384C512.3 335.1 494 290.5 464 256.6L533.6 117.5C539.5 105.6 534.7 91.2 522.9 85.3L436.2 41.9C425 36.3 411.3 40.3 404.9 51L320.3 192zM351.1 334.5C352.5 337.3 355.1 339.2 358.1 339.6L408.2 346.9C415.9 348 418.9 357.4 413.4 362.9L377.1 398.3C374.9 400.5 373.9 403.5 374.4 406.6L383 456.5C384.3 464.1 376.3 470 369.4 466.4L324.6 442.8C321.9 441.4 318.6 441.4 315.9 442.8L271.1 466.4C264.2 470 256.2 464.2 257.5 456.5L266.1 406.6C266.6 403.6 265.6 400.5 263.4 398.3L227.1 362.9C221.5 357.5 224.6 348.1 232.3 346.9L282.4 339.6C285.4 339.2 288.1 337.2 289.4 334.5L311.8 289.1C315.2 282.1 325.1 282.1 328.6 289.1L351 334.5z"/>
                            </svg>
                            {studentData.rank}
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-6 pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-gray-800">{studentData.gpa}</div>
                            <div className="text-xs text-gray-500">GPA</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800">{studentData.points}</div>
                            <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800">{studentData.attendancePercentage}%</div>
                            <div className="text-xs text-gray-500">Attendance</div>
                        </div>
                    </div>

                    <button
                        className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 text-sm font-medium transition-colors cursor-none"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <div id="profile-summary-back" className={isFrontFace ? "" : "hidden"}>
                <img src={studentData.attendanceQRCode} alt="Attendance QR Code" />
            </div>
        </div>
    );
}