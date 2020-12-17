import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import './FundraiserCard.css';
import ViewFundraiserModal from "../ViewFundraiserModal/ViewFundraiserModal";
import {fromWei} from "web3-utils";
import {fundraiserStates} from "../../commons/constants/contants";

const FundraiserCard = ({fundraiser, account, contract}) => {
    const [shouldShowModal, setShouldShowModal] = useState(false);

    return (
        <Card className='fundraiser-card' body>
            <p><span className='bold-highlight'>Title: </span>{fundraiser.title}</p>
            <p><span className='bold-highlight'>Goal: </span>{fromWei(fundraiser.goal, 'ether')} ETH</p>
            <p><span className='bold-highlight'>Raised: </span>{fromWei(fundraiser.raised, 'ether')} ETH</p>
            <p><span className='bold-highlight'>Status: </span>{fundraiserStates[fundraiser.state]}</p>
            <button className='view-fundraiser-button' onClick={() => setShouldShowModal(true)}>
                View
            </button>
            <ViewFundraiserModal
                account={account}
                contract={contract}
                fundraiser={fundraiser}
                show={shouldShowModal}
                closeModal={() => setShouldShowModal(false)}
            />
        </Card>
    );
};

export default FundraiserCard;