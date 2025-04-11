import "./globlas.css"

import { CustomThemeProvider } from "../main/theme-provider"


const RootLayout = ({ children }) => {
  return (
    <CustomThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </CustomThemeProvider>
  );
};

export default RootLayout;
