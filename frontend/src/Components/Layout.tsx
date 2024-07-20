import { Outlet } from "react-router-dom"
import AppBar from "./AppBar"
import Footer from "./Footer"

function Layout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <AppBar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout