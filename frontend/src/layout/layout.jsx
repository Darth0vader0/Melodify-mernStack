import "./globals.css"

import { CustomThemeProvider } from "../"

// ✅ Inter font via CDN (Google Fonts)
import "@fontsource/inter"; // Alternative: Use Google Fonts in index.html

const RootLayout = ({ children }) => {
  return (
    <CustomThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>{children}</SidebarProvider>
    </CustomThemeProvider>
  );
};

export default RootLayout;
