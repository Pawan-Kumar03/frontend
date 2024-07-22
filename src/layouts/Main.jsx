import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

export default function Main() {
    return (
        <div className="bg-gray-800 min-h-screen relative">
            <Navbar />
            <Outlet />
        </div>
    );
}
