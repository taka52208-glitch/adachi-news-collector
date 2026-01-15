import type { Components, Theme } from '@mui/material/styles';
import { palette } from './palette';

// Professional Blue テーマ - コンポーネントスタイル
export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: palette.grey[100],
        },
        '&::-webkit-scrollbar-thumb': {
          background: palette.grey[400],
          borderRadius: '4px',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        padding: '8px 16px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 2px 8px rgba(30, 58, 95, 0.3)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: `1px solid ${palette.grey[200]}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(30, 58, 95, 0.15)',
          borderColor: palette.secondary.main,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
      elevation1: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorDefault': {
          backgroundColor: palette.grey[100],
          color: palette.grey[600],
          '&:hover': {
            backgroundColor: palette.grey[200],
          },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 4px 20px rgba(30, 58, 95, 0.3)',
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: palette.secondary.main,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
};
