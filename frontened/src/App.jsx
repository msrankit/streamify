import React from 'react'
import {Navigate, Route, Routes} from "react-router";
import toaster, {Toaster} from "react-hot-toast";
import Homepage from "./Pages/Homepage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import NotificationPage from "./Pages/NotificationPage.jsx";
import OnboardingPage from "./Pages/OnboardingPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import PageLoader from "./component/PageLoader.jsx";
import useAuthuser from "./hooks/useAuthuser.js";
import Layout from "./component/Layout.jsx";
import {useThemeStore} from "./store/useThemeStore.js";

const App = () => {

    // TANSTACK QUERY TO MAKE API CALL EASY AND OPTIMISE

     // const { data:authData , isLoading , error} = useQuery({
     //     queryKey: ['authUser'],
     //     queryFn: async() =>{
     //         const res = await axiosInstance.get('http://localhost:5001/api/auth/me')
     //
     //         return res.data
     //     },
     //     retry:false
     // })
    // const authUser = authData?.user;

 const {theme , setTheme} = useThemeStore()

    const { isLoading , authUser } = useAuthuser()

     const isAuthicated = Boolean(authUser)
    const isBoarded = authUser?.isOnboarded
     if(isLoading) return <div><PageLoader/></div>

    return (
        <div className={' h-screen overflow-y-auto '} data-theme={theme}>
            <Routes>
               <Route path="/" element={isAuthicated && isBoarded ?
                   <Layout>
                       <Homepage/>
                   </Layout>
                   : <Navigate to={!isAuthicated ? '/login':'/onboarding'}/>} />
                <Route path="/signup" element={!isAuthicated ? <SignupPage/> : <Navigate to='/'/> } />
                <Route path="/login" element={!isAuthicated ? <LoginPage/> : <Navigate to={!isBoarded ? '/onboarding':'/'}  /> } />
                <Route path="/notification" element={ isAuthicated  && isBoarded ?
                    <Layout>
                    <NotificationPage/>
                </Layout>: <Navigate to= {!isAuthicated ? '/login':'/onboarding'} /> } />
                <Route path="/onboarding" element={ isAuthicated ? (
                    !isBoarded ? <OnboardingPage/> : <Navigate to='/'/>
                ) : <Navigate to='/login'/> } />
                <Route path="/call/:id" element={ isAuthicated && isBoarded ? <CallPage/> : <Navigate to={!isAuthicated ? "/login" : '/onboarding' }  /> } />
                <Route path="/chat/:id" element={ isAuthicated && isBoarded ?
                    <Layout
                      showSideBar={false}
                    >
                    <ChatPage/>
                    </Layout>
                        : <Navigate to={!isAuthicated ? '/login':'/onboarding'} /> } />
            </Routes>
            <Toaster/>
        </div>
    )
}
export default App
