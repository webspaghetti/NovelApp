import React from "react";
import CircularProgress from "@mui/material/CircularProgress";


export default function AlertDialog({
                                        isOpen,
                                        title = "Are you sure?",
                                        message = "",
                                        confirmText = "Confirm",
                                        cancelText = "Cancel",
                                        onConfirm,
                                        onCancel,
                                        isLoading = false,
                                    }) {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-b from-main_background to-[#070707] border border-gray-700 rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center animate-fadeIn">
                <h2 className="text-lg font-semibold text-secondary mb-3">{title}</h2>
                {message && <p className="text-gray-400 mb-6">{message}</p>}

                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-secondary transition-all"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 border-red-800 text-secondary font-medium transition-all disabled:opacity-60"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <CircularProgress sx={{ color: "#FAFAFA" }} size={24} thickness={6}/>
                            : confirmText
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}