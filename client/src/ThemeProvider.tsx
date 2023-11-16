import { ThemeProvider } from "@emotion/react";
import { createTheme } from '@mui/material/styles';
import { PropsWithChildren } from "react";

export const Theme = (prop: PropsWithChildren) => {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#26a69a',
      },
      secondary: {
        main: '#69f0ae',
      },
    },
  });

  return <ThemeProvider theme={theme}>
    {prop.children}
  </ThemeProvider>
}