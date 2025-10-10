"use client"
import { useState } from "react";
import AddNovelPopup from "@/components/homepage/popup/AddNovelPopup";
import AnimatedIconButton from "@/components/common/AnimatedIconButton";


function AddNovelButton() {
    const [popupTrigger, setPopupTrigger] = useState(false);


    return (
        <>
            <AnimatedIconButton label={'Add novel'} onClick={() => setPopupTrigger(true)} animation={'svg-animate-scale'} shape={'M12 4.5v15m7.5-7.5h-15'} />
            <AddNovelPopup trigger={popupTrigger} setTrigger={setPopupTrigger} />
        </>
    );
}


export default AddNovelButton;