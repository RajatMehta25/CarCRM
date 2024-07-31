import React from 'react';
import './Gift.css'
import { InnerContainer, SubInner, GrossTitle, GrossDesc, ButtonBox, TrialButton } from "./GiftCardElements"

const Gross = () => {
    // console.log(history);



    return (
        <>
            <div className="OurContainer">
                <div className="InnerContainer">
                    <div className="SubInner">
                        <div className="GrossTitle">
                            Where Your Business Grows
                        </div>
                        <div className="GrossDesc">
                            Thoolie is an advanced automation, collaboration, payment and company management tool that connects your business to clients, increases retention, and optimizes your business processes so that you can get more work done.
                        </div>
                        {/* < div className="ButtonBox">
                            <div className="TrialButton">START FREE TRIAL</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Gross;

