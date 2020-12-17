import React from "react";
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className='error-container'>
            <h1 className='error-heading'>Error!</h1>
            <p>Please make sure you have Metamask installed in your browser and
                that you're connected to a network with the application deployed.
            </p>
        </div>
    )
};

export default ErrorPage;