import { useOutletContext } from "react-router-dom";

import ProgressBox from "../../../../ui/ProgressBox";
import Section from "../../../../ui/Section";
import CircularProgress from "../../../../ui/CircularProgress";
import Button from "../../../../ui/Button";
import CourseLayout from "../../../../../layout/course/CourseLayout";


export default function CourseAttendance() {
    const { course } = useOutletContext();
    const studentAttendance = course.attendance;
    
    return (
        <CourseLayout>
            <Section>
                <div>
                    <h2>OVERALL ATTENDANCE</h2>
                    <div>
                        <CircularProgress value={studentAttendance} size={120} />
                        <p>
                            {studentAttendance > 75 ? 
                            "Excellent attendance record! Keep it up." : 
                            studentAttendance > 50 ? "Good attendance, but there's room for improvement." :
                            "Attendance needs improvement. Please try to attend more sessions."}
                        </p>
                    </div>
                </div>

                <div>
                    <h2>BREAKDOWN</h2>
                    <div>
                        <ProgressBox progress={25} backgroundColor={'bg-bg-fill-warning-default-light dark:bg-bg-fill-warning-default-dark'}>
                            <div>
                                <p>Overall Sessions</p>
                            </div>
                            <span>{25}</span>
                        </ProgressBox>

                        <ProgressBox progress={studentAttendance} backgroundColor={'bg-bg-fill-warning-default-light dark:bg-bg-fill-warning-default-dark'}>
                            <div>
                                <p>Present</p>
                            </div>
                            <span>{studentAttendance}</span>
                        </ProgressBox>

                        <ProgressBox progress={2} backgroundColor={'bg-bg-fill-warning-default-light dark:bg-bg-fill-warning-default-dark'}>
                            <div>
                                <p>Absent</p>
                            </div>
                            <span>{2}</span>
                        </ProgressBox>
                    </div>    
                </div>

                <div>
                    <h2>ATTENDANCE EXCUSES</h2>
                    <div>
                        <Button>
                            Request Attendance Excuse
                        </Button>
                    </div>
                </div>
            </Section>

            <Section>
                <div>
                    <div>
                        <h3></h3>
                        <p></p>
                    </div>
                    <div>

                    </div>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Session Topic</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div>

                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <p></p>

                    <div>

                    </div>
                </div>
            </Section>
        </CourseLayout>
    );
}