import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Steps, Button, Input, Form, Select, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

function ProjectForm() {
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        collaborators: [],
        studies: [], // Added to store uploaded studies
    }); 
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [employeeMap, setEmployeeMap] = useState({});
    const [uploadingFiles, setUploadingFiles] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/project/employees');
                const options = response.data.map(employee => ({
                    value: employee._id,
                    label: employee.name
                }));
                setEmployeeOptions(options);
                setEmployeeMap(response.data.reduce((map, employee) => ({...map, [employee._id]: employee.name}), {}));
    
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = (name, value) => {
        setProjectData({ ...projectData, [name]: value });
    };

    const onStudiesUploadChange = async (info) => {
        let fileList = [...info.fileList].slice(-1); // Focus on the last selected file
    
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            const fileIdentifier = `${file.name}_${file.size}_${file.lastModified}`;
    
            // Check if the file is already being uploaded
            if (uploadingFiles[fileIdentifier]) {
                return; // Exit if this file is currently uploading
            }
    
            // Mark the file as uploading
            setUploadingFiles(current => ({ ...current, [fileIdentifier]: true }));
    
            const formData = new FormData();
            formData.append("file", file);
    
            try {
                setLoading(true);
                const response = await axios.post('http://localhost:3000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                message.success('File uploaded successfully');
                setProjectData(current => ({ ...current, studies: [...current.studies, response.data] }));
            } catch (error) {
                console.error('Error uploading file:', error);
                message.error('Error uploading file');
            } finally {
                setLoading(false);
                // Remove the file from the uploading tracker
                setUploadingFiles(current => {
                    const updated = { ...current };
                    delete updated[fileIdentifier];
                    return updated;
                });
            }
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token'); 

        // Before submitting, you might want to adjust the format of projectData or specifically the studies array as needed by your backend
        
        try {
            const response = await axios.post('http://localhost:3000/project/create', projectData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            message.success('Project created successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating project:', error);
            message.error('Error creating project');
        }
    };

    const steps = [
        {
            title: 'Project Details',
            content: (
                <Form.Item>
                    <Input
                        placeholder="Project Title"
                        value={projectData.title}
                        onChange={e => handleChange('title', e.target.value)}
                    />
                    <TextArea
                        placeholder="Project Description"
                        value={projectData.description}
                        onChange={e => handleChange('description', e.target.value)}
                        style={{ marginTop: '16px' }}
                    />
                </Form.Item>
            ),
        },
        {
            title: 'Import Studies',
            content: (
                <Form.Item>
                    <Dragger
                        name="studies"
                        multiple={true}
                        onChange={onStudiesUploadChange}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                </Form.Item>
            ),
        },
        {
            title: 'Collaborators',
            content: (
                <Form.Item>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select collaborators"
                        value={projectData.collaborators}
                        onChange={value => handleChange('collaborators', value)}
                        showSearch
                    >
                        {employeeOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            ),
        },
        {
            title: 'Confirmation',
            content: (
                <div>
                    <h3>Project Title:</h3>
                    <p>{projectData.title}</p>
                    <h3>Project Description:</h3>
                    <p>{projectData.description}</p>
                    <h3>Collaborators:</h3>
                    <ul>
                        {projectData.collaborators.map((collaboratorId, index) => (
                            <li key={index}>{employeeMap[collaboratorId]}</li>
                        ))}
                    </ul>
                    {/* Optionally display uploaded studies information */}
                </div>
            ),
        },
    ];

    return (
        <Form onFinish={handleSubmit} layout="vertical">
            <Steps current={currentStep}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content" style={{ marginTop: '24px' }}>
                {steps[currentStep].content}
            </div>
            <div className="steps-action" style={{ marginTop: '24px' }}>
                {currentStep < steps.length - 1 && (
                    <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                        Next
                    </Button>
                )}
                {currentStep === steps.length - 1 && (
                    <Button type="primary" htmlType="submit">
                        Confirm Project
                    </Button>
                )}
                {currentStep > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => setCurrentStep(currentStep - 1)}>
                        Previous
                    </Button>
                )}
            </div>
        </Form>
    );
}

export default ProjectForm;
