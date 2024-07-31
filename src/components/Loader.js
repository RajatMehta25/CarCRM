import React from 'react'

export default function Loader() {
    return (
        <div>
            <div id="preloader" className="transprent">
            <div id="status">
                <div className="spinner">
                    <i className="ri-loader-line spin-icon"></i>
                </div>
            </div>
        </div>
        </div>
    )
}
