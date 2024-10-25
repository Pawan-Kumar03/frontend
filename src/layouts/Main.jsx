import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer'
export default function Main() {
    return (
        <div className="bg-gray-800 min-h-screen relative">
            <Navbar />
            <Outlet />
            <Footer/>
        </div>
    );
}
