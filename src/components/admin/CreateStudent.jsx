import { Form } from "react-router-dom";

import PageHeader from "../../ui/PageHeader";
import Section from "../../ui/Section";
import Button from "../../ui/Button";

import { PlusIcon, QRCodeIcon } from "../../ui/icons";
import InputItem from "../../ui/InputItem";
import SelectionItem from "../../ui/SelectionItem";

export default function CreateStudent() {
    return (
        <>
            <PageHeader title="Add New Student" subtitle="Create a new student account and generate QR code for quick access" />

            <Section className="grid grid-cols-3 gap-8">
                <Form className="col-span-2 space-y-6">
                    <h3>Student Information</h3>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <InputItem label="Full Name" type="text" id="fullName" name="fullName" placeholder="Enter full name" required />

                            <InputItem label="Student ID" type="text" id="studentID" name="studentID" placeholder="Enter student ID" required />
                        </div>

                        <div>
                            <InputItem label="National ID" type="text" id="nationalID" name="nationalID" placeholder="Enter national ID" required />

                            <SelectionItem label="nationality" name="nationality" options={[
                                { value: 'eg', label: 'Egyptian' },
                                { value: 'sd', label: 'Sudanese' },
                                { value: 'sa', label: 'Saudi Arabian' },
                                { value: 'ye', label: 'Yemeni' },
                                { value: 'ps', label: 'Palestinian' },
                            ]} />   
                        </div>

                        <div>
                            <InputItem label="Email Address" type="email" id="email" name="email" placeholder="Enter email address" required />

                            <InputItem label="Phone Number" type="tel" id="phone" name="phone" placeholder="Enter phone number" required />
                        </div>

                        <div>
                            <InputItem label="Faculty" type="text" id="faculty" name="faculty" placeholder="Enter faculty" required />
                            
                            <SelectionItem label="Department" name="department" options={[
                                { value: '', label: 'General' },
                                { value: 'cs', label: 'Computer Science' },
                                { value: 'is', label: 'Information Systems' },
                                { value: 'it', label: 'Information Technology' },
                                { value: 'ai', label: 'Artificial Intelligence' },
                            ]} />
                        </div>

                        <div>
                            <SelectionItem label="Academic Year" name="academicYear" options={[
                                { value: '1', label: '1st Year' },
                                { value: '2', label: '2nd Year' },
                                { value: '3', label: '3rd Year' },
                                { value: '4', label: '4th Year' },
                            ]} />

                            <InputItem label="Enrollment Date" type="date" id="enrollmentDate" name="enrollmentDate" value={new Date().toISOString().split('T')[0]} required />
                        </div>

                        <div>
                            <InputItem label="Address" type="textarea" id="address" name="address" placeholder="Enter address" />
                        </div>
                    </div>

                    <div>
                        <Button type="submit">
                            <PlusIcon className="w-6 h-6 mr-2" /> 
                            Create Student
                        </Button>

                        <Button type="reset">
                            Reset Form
                        </Button>
                    </div>
                </Form>

                <div>
                    <h3>Student QR Code</h3>

                    <div>
                        <QRCodeIcon className="w-24 h-24 mb-4" />
                        <p>QR code will be generated after creating student</p>
                    </div>
                </div>
            </Section>
        </>
    );
}