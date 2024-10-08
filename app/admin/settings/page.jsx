"use client"
import React, { useState } from 'react'
import AppLayout from '@component/layouts/appLayout'
import PersonalInfo from '@/app/components/molecules/settings/PersonalInfo';
import ChangePassword from '@/app/components/molecules/settings/ChangePassword';
import Notifications from '@/app/components/molecules/settings/Notifications';
import DeleteAccount from '@/app/components/molecules/settings/DeleteAccount';
import Appearance from '@/app/components/molecules/settings/Appearance';

function Page() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [showNav, setShowNav] = useState(true)
  const settingsTabs = [
    {
      title: "Personal Info",
      id: "personal-info",
    },
    {
      title: "Change Password",
      id: "change-password",
    },
    // {
    //   title: "Notifications",
    //   id: "notifications",
    // },
    // {
    //   title: "Appearance",
    //   id: "appearance",
    // },
    // {
    //   title: "Delete Account",
    //   id: "delete-account",
    // },
  ];


  return (
    <AppLayout>
      <div className="text-xl">Settings</div>
      <div className="container md:grid grid-cols-3 gap-3">
        <div className="">
          <div className="md:w-[80%] md:border dark:border-gray-700 border-[#F2F4F7] p-3 rounded-lg">
            {settingsTabs.map((tab, i) => (
              <div
                key={i}
                className={
                  activeTab === `${tab.id}`
                    ? `md:bg-[#fff] border-b dark:border-gray-600 dark:md:bg-gray-700 dark:text-white-1 md:border-none md:px-4 py-3 mb-2 md:rounded-lg md:text-[#344051] font-medium cursor-pointer md:[boxShadow:0px_2px_4px_0px_rgba(52,_64,_81,_0.12)]`
                    : `md:px-4 py-3 dark:text-white-1 dark:border-gray-600 dark:md:text-gray-300 border-b md:border-none mb-2 md:rounded-lg md:text-[#637083] font-medium cursor-pointer`
                }
                onClick={() => { setActiveTab(`${tab.id}`); setShowNav(false) }}
              >
                <div className="flex items-center">
                  <div className="flex-grow">{tab.title}</div>
                  <div className="md:hidden"><i className="ri-arrow-right-s-line"></i></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`col-span-2 bg-gray-50 dark:bg-[#202B37] fixed md:relative h-screen md:h-auto w-screen md:w-full top-0 ${showNav ? "-right-full md:right-0" : "right-0"}`}>
          <div className="h-full md:h-auto col-span-2 pb-5 overflow-y-scroll md:overflow-y-auto">
            {activeTab === "personal-info" && <PersonalInfo reset={showNav} goBack={() => setShowNav(true)} />}

            {activeTab === "change-password" && <ChangePassword goBack={() => setShowNav(true)} />}

            {activeTab === "notifications" && <Notifications goBack={() => setShowNav(true)} />}

            {activeTab === "appearance" && <Appearance goBack={() => setShowNav(true)} />}

            {activeTab === "delete-account" && <DeleteAccount goBack={() => setShowNav(true)} />}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Page