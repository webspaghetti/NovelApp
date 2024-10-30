import React from 'react';
//import { LogOut, BookOpen, Clock, BookMarked } from 'lucide-react';

const ProfilePage = () => {
    const user = {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        joinDate: "March 2024",
        booksRead: 47,
        currentlyReading: 3,
        bookmarked: 12,
        avatar: "/logo.png"
    };

    return (
        <main className={'pt-24'}>
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img
                        src={user.avatar}
                        alt="Profile"
                        className="rounded-full size-32 object-cover border-4 border-primary"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl mb-2">{user.name}</h1>
                        <p>Member since {user.joinDate}</p>
                        <p>{user.email}</p>
                    </div>
                </div>
                <button className="svg-animate-scale bg-red-700">
                    {/*<LogOut className="size-4" />*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Logout
                </button>
            </div>

            {/* Reading Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3>Finished Novels</h3>
                        {/*<BookOpen className="size-5 text-primary" />*/}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-primary">{user.booksRead}</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3>Currently Reading</h3>
                        {/*<Clock className="size-5 text-primary" />*/}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-primary">{user.currentlyReading}</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3>Bookmarked</h3>
                        {/*<BookMarked className="size-5 text-primary" />*/}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                    </div>
                    <p className="text-3xl font-bold text-primary">{user.bookmarked}</p>
                </div>
            </div>

            {/* Currently Reading Section */}
            <div className="card p-6">
                <h2 className="text-left mb-6">Currently Reading</h2>
                <div className="space-y-4">
                    {[
                        "The Dragon's Prophecy - Chapter 156",
                        "Eternal Cultivation - Chapter 89",
                        "Modern City Cultivator - Chapter 234"
                    ].map((novel, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-navbar rounded-2xl"
                        >
                            <span className="text-center sm:text-left">{novel}</span>
                            <button className="svg-animate-scale">
                                {/*<BookOpen className="size-4" />*/}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
                                Continue Reading
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;