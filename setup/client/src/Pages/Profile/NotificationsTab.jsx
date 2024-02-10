import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Badge } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail'; // Icon for unread notifications

function NotificationsTab() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Project is waiting for review.', timestamp: '2023-02-10 14:00', read: false },
    { id: 2, message: 'New comment on your data extraction.', timestamp: '2023-02-12 09:30', read: true },
    //more notifications
  ]);

  // mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <Box sx={{ p: 2 }}>
      <h3>Notifications</h3>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.id} button onClick={() => markAsRead(notification.id)}>
            <ListItemText 
              primary={notification.message} 
              secondary={notification.timestamp} 
            />
            {!notification.read && (
              <IconButton edge="end" aria-label="mark as read">
                <Badge color="secondary" variant="dot">
                  <MailIcon />
                </Badge>
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default NotificationsTab;
