import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Main from "../layouts/Main";
import PlaceAnAdPage from "../pages/PlaceAnAdPage";
import EditPropertyForm from "../pages/EditPropertyForm";
import PropertyDetails from "../pages/PropertyDetails";
import PropertiesPage from "../pages/PropertiesPage";
import Login from "../pages/Login"; 
import Signup from "../pages/Signup";
import TermsAndConditions from "../pages/TermsAndConditions";
import MyAds from "../pages/MyAds";
import ProfilePage from "../pages/ProfilePage";
import GetVerifiedPage from '../pages/GetVerifiedPage';
import AboutUsPage from '../pages/AboutUsPage';  // New Page
import ContactUsPage from '../pages/ContactUsPage';  // New Page
import VerifyPage from '../pages/VerifyPage'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from "../pages/ResetPassword";
import ConsultancyPage from '../pages/ConsultancyPage'
import Broker from '../pages/Broker'
import AgentProfile from '../pages/AgentProfile'


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/place-an-ad",
                element: <PlaceAnAdPage />,
            },
            {
                path: "/edit-property/:id",
                element: <EditPropertyForm />,
            },
            {
                path: "/property/:id",
                element: <PropertyDetails />,
            },
            {
                path: "/properties",
                element: <PropertiesPage />, 
            },
            {
                path: "/login",  
                element: <Login />,
            },
            {
                path: "/signup",  
                element: <Signup />,
            },
            {
                path: "/terms-and-conditions",   
                element: <TermsAndConditions />,
            },
            { path:"/my-ads", element:<MyAds />},
            {
                path: "/profile",
                element: <ProfilePage />, 
            },
            {
                path: "/get-verified",
                element: <GetVerifiedPage />, 
            },
            {
                path: "/about-us",
                element: <AboutUsPage />, 
            },
            {
                path: "/Broker",
                element: <Broker />, 
            }
            ,
            {
                path: "/AgentProfile",
                element: <AgentProfile />, 
            },
            
            {
                path: "/contact-us",
                element: <ContactUsPage />, 
            }
            ,
            {
                path: "/ConsultancyPage",
                element: <ConsultancyPage />, 
            },
            {
                path: "/verify/:token",
                element: <VerifyPage />, 
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />, 
            },
            {
                path: "/reset-password/:token",
                element: <ResetPassword />,
            },
        ],
    },
]);

export default router;
