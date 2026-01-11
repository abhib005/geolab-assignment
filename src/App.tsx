import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Button
} from '@mui/material';

import {
  Home as HomeIcon,
  Science as ScienceIcon,
  Article as ArticleIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material';

import SamplesPage from './components/SamplesPage';
import NewsPage from './components/NewsPage';

const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  });

const DRAWER_WIDTH = 240;

const GeoLabApp: React.FC = () => {
  const [page, setPage] = useState<'home' | 'samples' | 'news'>('home');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [headerText, setHeaderText] = useState<string>('Home');

  React.useEffect(() => {
    if (page === 'home') setHeaderText('Home');
    else if (page === 'samples') setHeaderText('Samples');
    else if (page === 'news') setHeaderText('News');
  }, [page]);

  const theme = createAppTheme(themeMode);
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              GeoLab
            </Typography>
          </Toolbar>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={page === 'home'} onClick={() => setPage('home')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={page === 'samples'} onClick={() => setPage('samples')}>
                <ListItemIcon><ScienceIcon /></ListItemIcon>
                <ListItemText primary="Samples" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={page === 'news'} onClick={() => setPage('news')}>
                <ListItemIcon><ArticleIcon /></ListItemIcon>
                <ListItemText primary="News" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
          <AppBar position='static'>
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {headerText}
              </Typography>
              <Button
                onClick={toggleTheme}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  ml: 'auto',
                  color: 'inherit',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth={false} sx={{ width: `calc(100vw - ${DRAWER_WIDTH}px)`, display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            {page === 'home' && (
              <Box>
                <Typography variant="h3" gutterBottom>
                  GeoLab Home
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage soil sample data and stay updated with geotechnical news.
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid>
                    <Card>
                      <CardActionArea onClick={() => setPage('samples')}>
                        <CardContent>
                          <ScienceIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                          <Typography variant="h5" gutterBottom>
                            Samples
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Upload and analyze soil sample data with automatic calculations
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid>
                    <Card>
                      <CardActionArea onClick={() => setPage('news')}>
                        <CardContent>
                          <ArticleIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                          <Typography variant="h5" gutterBottom>
                            Geo News
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Latest news in environment, science, and technology
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {page === 'samples' && (
              <SamplesPage setHeaderText={setHeaderText} />
            )}

            {page === 'news' && (
              <NewsPage setHeaderText={setHeaderText} />
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GeoLabApp;