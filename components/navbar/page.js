"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation'; 
import { useSession } from 'next-auth/react';
import { createTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import StarsIcon from '@mui/icons-material/Stars';
import HelpIcon from '@mui/icons-material/Help';
import StyleIcon from '@mui/icons-material/Style';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import ROUTES from '@/routes';

export default function Navbar({children, ...props}) {

const { HOME, AUTH, PROFILE, COMMUNITY, COLLECTIONS, JOBS, TAGS, QUESTIONS, NOT_FOUND } = ROUTES

const { data: data } = useSession();

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
    icon: <DashboardIcon />,
  },
  {
    icon: <HomeIcon />,
    url: HOME,
  },
  {
    segment: 'community',
    title: 'Community',
    icon: <PeopleIcon />,
    url: COMMUNITY,
  },
  {
    segment: 'collections',
    title: 'Collections',
    icon: <StarsIcon />,
    url: COLLECTIONS,
  },
  {
    segment: 'jobs',
    title: 'Jobs',
    icon: <WorkIcon />,
    url: JOBS,
  },
  {
    segment: 'tags',
    title: 'Tags',
    icon: <StyleIcon />,
    url: TAGS,
  },
  {
    segment: 'ask-a-question',
    title: 'Ask a question',
    icon: <HelpIcon />,
    url: QUESTIONS,
  },
  (data ? {
    segment: 'profile',
    title: 'Profile',
    icon: <PersonIcon />,
    url: PROFILE,
  }: {
    segment: 'auth',
    title: 'Authenticate',
    icon: <LoginIcon />,
    url: PROFILE,
  })
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
  const { window } = props;
  const router = useRouter();
  const demoWindow = window ? window() : undefined;
  
  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        ...item,
        onClick: item?.url ? () => router.push(item.url) : undefined, 
      }))}
    >
      <DashboardLayout>
        <PageContainer>
          {children}  
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
