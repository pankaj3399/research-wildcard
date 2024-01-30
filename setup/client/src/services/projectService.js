import axios from 'axios';

const API_URL = 'http://localhost:3000/project';
export const createProject = async (projectData, usertoken) => {
    try {
        const res = await axios.post(`${API_URL}/create`, projectData, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': usertoken
            }
        });
        return res;
    }
    catch (err) {
        console.error('Error creating project', err);
        throw err;
    }
}