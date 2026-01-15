import type { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { palette } from '../theme/palette';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'ニュース一覧', path: '/' },
  { label: '収集履歴', path: '/history' },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${palette.secondary.main}, ${palette.secondary.light})`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              A
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, color: '#fff' }}
            >
              足立区ニュース
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {navItems.map((item) => (
              <MuiLink
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#fff' : 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  py: 1,
                  borderBottom: location.pathname === item.path
                    ? `2px solid ${palette.secondary.light}`
                    : '2px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: '#fff',
                    textDecoration: 'none',
                  },
                }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px', // AppBarの高さ分オフセット
          backgroundColor: palette.background.default,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          backgroundColor: palette.grey[100],
          borderTop: `1px solid ${palette.grey[200]}`,
        }}
      >
        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
          足立区ニュース収集ツール - 毎日自動で最新情報を収集
        </Typography>
      </Box>
    </Box>
  );
};
