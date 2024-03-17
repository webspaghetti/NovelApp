"use client"
function NotFound() {
    const handleNavigation = () => {
        window.location.href = `/`; // Navigate to homepage
    };

    return (
        <main className={"text-center"}>
            <h2 className={"text-5xl"}>Chapter Not Found</h2>
            <p className={'text-lg'}>We couldn&apos;t find the chapter you were looking for.</p>
            <div className={"flex justify-center my-5"}>
                <button onClick={handleNavigation}>Go back to the Homepage</button>
            </div>
        </main>
    );
}

export default NotFound;
