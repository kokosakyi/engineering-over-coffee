import { Outlet } from "react-router";
import { Navigation } from "../components/Navigation";
import { ScrollToTop } from "../components/ScrollToTop";

export const RootLayout = () => {
    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 transition-colors duration-200">
            <ScrollToTop />
            <Navigation />
            <Outlet />
        </div>
    )
}