"use client"
import {useState} from "react";
import PopupForm from "@/app/components/PopupForm";
import HoverRevealButton from "@/app/components/HoverRevealButton";

function AddNovel() {

    const [buttonPopup, setButtonPopup] = useState(false);

    return (
        <>
            <HoverRevealButton label={'Add novel'} onClick={() => setButtonPopup(true)} animation={'svg-animate-scale'} shape={'M12 4.5v15m7.5-7.5h-15'} />
            <PopupForm trigger={buttonPopup} setTrigger={setButtonPopup} />
        </>
    );
}

export default AddNovel;