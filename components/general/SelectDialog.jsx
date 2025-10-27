import React from "react";
import CircularProgress from "@mui/material/CircularProgress";


export default function SelectDialog({
                                         isOpen,
                                         title = "Select an option",
                                         message = "",
                                         defaultOptionText,
                                         options = [],
                                         selectText,
                                         cancelText,
                                         onConfirm,
                                         onCancel,
                                         selectedTemplate,
                                         setSelectedTemplate,
                                         isLoading = false,
                                     }) {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-navbar border border-gray-700 rounded-2xl p-6 shadow-2xl w-full max-w-sm animate-fadeIn">
                <h2 className="text-lg font-semibold text-secondary mb-3">{title}</h2>
                {message && <p className="text-gray-400 mb-4">{message}</p>}

                <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 bg-navbar border border-gray-700 rounded-lg text-secondary focus:outline-none focus:border-primary transition-colors"
                    disabled={isLoading}
                    autoFocus
                >
                    <option value="" disabled>{defaultOptionText}</option>
                    {options.map((template) => (
                        <option key={template.id} value={template.id}>
                            {template.name}
                        </option>
                    ))}
                </select>


                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-secondary transition-all"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 border-green-700 text-secondary font-medium disabled:opacity-60"
                        disabled={isLoading || !selectedTemplate}
                    >
                        {isLoading
                            ? <CircularProgress sx={{ color: "#FAFAFA" }} size={24} thickness={6}/>
                            : selectText
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}