import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText } from '@mui/material';

function AccountTab() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/user/info', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserInfo({
            email: response.data.email,
            username: response.data.name // api response goes here
          });
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, []);


  const [teamInfo, setTeamInfo] = useState([
    { id: 1, name: 'Stella', role: 'Project manager' },
    { id: 2, name: 'Aliki', role: 'Project manager' },
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <h3>Account</h3>
      <div><h5>Email: {userInfo.email}</h5></div>
      <div><h5>User Name: {userInfo.username}</h5></div>

      <h3>Team</h3>
      <List>
        {teamInfo.map((member) => (
          <ListItem key={member.id}>
            <ListItemText primary={`${member.name} - ${member.role}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AccountTab;
