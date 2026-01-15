import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

// Professional Blue テーマ
export const theme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
});

export { palette } from './palette';
export { typography } from './typography';
export { components } from './components';
