"use client";
import { useOfflineSync } from "@/components/offline/hooks/useOfflineSync";
import { useEffect, useState } from "react";


function OfflineSyncProvider() {
    const { isSyncing, pendingCount, lastSyncResult } = useOfflineSync();
    const [toasts, setToasts] = useState([]);


    // Show toast when syncing or updates pending
    useEffect(() => {
        if (pendingCount > 0) {
            const message = isSyncing
                ? `Syncing ${pendingCount} updates...`
                : `${pendingCount} updates pending sync`;
            addToast(message, "info");
        }
    }, [pendingCount, isSyncing]);


    // Show success toast
    useEffect(() => {
        if (lastSyncResult && lastSyncResult.synced > 0) {
            addToast(`✔ Synced ${lastSyncResult.synced} updates successfully`, "success");
        }
    }, [lastSyncResult]);


    function addToast(message, type) {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000); // Auto-dismiss after 4s
    }

    return (
        <>
            <div className={"fixed bottom-4 left-4 z-50 flex flex-col space-y-2"}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-4 py-2 rounded shadow-lg text-white text-sm animate-slide-up ${
                            toast.type === "success"
                                ? "bg-green-600/90"
                                : "bg-blue-600/90"
                        }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>

            <style jsx>
                {`
                  @keyframes slide-up { 
                    0% {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    100% {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                  }
                `}
            </style>
        </>
    );
}

export default OfflineSyncProvider;