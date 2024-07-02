import BlurPage from "@/components/global/blur-page";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <BlurPage>{children}</BlurPage>;
};

export default Layout;
