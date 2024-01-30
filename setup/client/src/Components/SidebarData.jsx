import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SettingsIcon from '@mui/icons-material/Settings';

export const SidebarData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/dashboard",
  },
  {
    title: "PRISMA",
    icon: <NoteAddIcon />,
    link: "/prisma",
  },
  {
    title: "Export",
    icon: <FileDownloadIcon />,
    link: "/export",
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    link: "/settings",
  },
];