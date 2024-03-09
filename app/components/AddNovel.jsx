"use client"
import {useState} from "react";
import PopupForm from "@/app/components/PopupForm";

function AddNovel() {

    const [buttonPopup, setButtonPopup] = useState(false);

    return (
        <>
            <button onClick={() => setButtonPopup(true)} className={"text-secondary"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add novel
            </button>
            <PopupForm trigger={buttonPopup} setTrigger={setButtonPopup} />
        </>
    );
}

export default AddNovel;