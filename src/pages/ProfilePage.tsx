import React from "react";
import UserSidebar from "../components/client/profile/UserSidebar";
import ProfileForm from "../components/client/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex bg-slate-50 text-neutral-dark font-sans antialiased">
      
      {/* Left Sidebar */}
      <UserSidebar />

      {/* Right Content Area */}
      <main className="flex-grow p-8 bg-slate-50 min-h-screen overflow-y-auto">
        <ProfileForm />
      </main>

    </div>
  );
}
