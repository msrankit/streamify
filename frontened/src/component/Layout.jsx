import React from 'react'
import NavBar from "./NavBar.jsx";
import Sidebar from "./Sidebar.jsx";


const Layout = ({children , showSideBar = true}) => {
    return (
        <div className={'min-h-screen'}>

            <div className={'flex'}>

                {showSideBar && <Sidebar/>}
                <div className={'flex-1 flex-col flex'}>
                    <NavBar/>
                    <main className='flex-1 overflow-y-auto '>
                        {children}
                    </main>
                </div>

            </div>




        </div>
    )
}
export default Layout
