import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import './FundraiserCard.css';
import ViewFundraiserModal from "../ViewFundraiserModal/ViewFundraiserModal";

const FundraiserCard = () => {
    const [shouldShowModal, setShouldShowModal] = useState(false);

    return (
        <Card className='fundraiser-card' body>
            <p><span className='bold-highlight'>Title: </span> Title</p>
            <p><span className='bold-highlight'>Goal: </span> 100000000 ETH</p>
            <p><span className='bold-highlight'>Raised: </span> 0 ETH</p>
            <p><span className='bold-highlight'>Status: </span> Active</p>
            <button className='view-fundraiser-button' onClick={() => setShouldShowModal(true)}>
                View
            </button>
            <ViewFundraiserModal show={shouldShowModal} closeModal={() => setShouldShowModal(false)}/>
        </Card>
    );
};

export default FundraiserCard;