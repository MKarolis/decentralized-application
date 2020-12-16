import React from "react";
import Card from "react-bootstrap/Card";
import './FundraiserCard.css';

const FundraiserCard = () => {
    return (
        <Card className='fundraiser-card' body>
            <p><span className='bold-highlight'>Title: </span> Title</p>
            <p><span className='bold-highlight'>Goal: </span> 100000000 ETH</p>
            <p><span className='bold-highlight'>Raised: </span> 0 ETH</p>
            <p><span className='bold-highlight'>Status: </span> Active</p>
            <button className='view-fundraiser-button'>
                View
            </button>
        </Card>
    );
};

export default FundraiserCard;