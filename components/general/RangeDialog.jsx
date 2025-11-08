import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function RangeDialog({
                                        isOpen,
                                        title = "Select range",
                                        message = "",
                                        minPlaceholder = "Min",
                                        maxPlaceholder = "Max",
                                        confirmText = "Confirm",
                                        cancelText = "Cancel",
                                        onConfirm,
                                        minValue,
                                        setMinValue,
                                        maxValue,
                                        setMaxValue,
                                        onCancel,
                                        isLoading = false,
                                        error = "",
                                        minLimit = null,
                                        maxLimit = null,
                                    }) {
    if (!isOpen) return null;

    const handleMinChange = (e) => {
        const value = e.target.value;
        // Allow empty string or positive integers only
        if (value === "" || /^[1-9]\d*$/.test(value)) {
            setMinValue(value);
        }
    };

    const handleMaxChange = (e) => {
        const value = e.target.value;
        // Allow empty string or positive integers only
        if (value === "" || /^[1-9]\d*$/.test(value)) {
            setMaxValue(value);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isLoading ? 'pointer-events-none' : ''} backdrop-blur-sm p-4`}>
            <div className="bg-gradient-to-b from-main_background to-[#070707] border border-gray-700 rounded-2xl p-6 shadow-2xl w-full max-w-sm animate-fadeIn">
                <h2 className="text-lg font-semibold text-secondary mb-3">{title}</h2>
                {message && <p className="text-gray-400 mb-4">{message}</p>}

                <div className="space-y-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={minValue}
                        onChange={handleMinChange}
                        placeholder={minPlaceholder}
                        className="w-full px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary disabled:opacity-60"
                        disabled={isLoading}
                        autoFocus
                    />

                    <input
                        type="text"
                        inputMode="numeric"
                        value={maxValue}
                        onChange={handleMaxChange}
                        placeholder={maxPlaceholder}
                        className="w-full px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary disabled:opacity-60"
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-1 mb-4 text-left">{error}</p>
                )}

                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-secondary transition-all disabled:opacity-60"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 border-green-800 text-secondary font-medium transition-all disabled:opacity-60"
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