import React, {useState} from "react";
import LoadingOverlay from "react-loading-overlay";
import {FadeLoader} from "react-spinners";
import Modal from "react-bootstrap/cjs/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ValueTypeSelect from "../../components/ValueTypeSelect/ValueTypeSelect";
import {etherValueOptions, fundraiserStates} from "../../commons/constants/contants";
import './ViewFundraiserModal.css';
import {fromWei, toWei} from "web3-utils";
import {ToastsStore} from "react-toasts";

const ViewFundraiserModal = ({show, closeModal, account, contract, fundraiser}) => {
    const [valueType, setValueType] = useState(etherValueOptions[0]);
    const [fundValue, setFundValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        resetInputs();
        closeModal();
    };

    const resetInputs = () => {
        setValueType(etherValueOptions[0]);
        setFundValue('');
    };

    const handleFund = async () => {
        if (isNaN(fundValue) || Number(fundValue) <= 0) {
            ToastsStore.error("Could not create the fundraiser: invalid goal value provided!");
            return;
        }

        setIsLoading(true);
        try {
            await contract.methods.supportFundraiser(fundraiser.id)
                .send({from: account, value: toWei(String(Number(fundValue)), valueType)});
            ToastsStore.success("Fundraiser supported successfully!");
        } catch (err) {
            ToastsStore.error('Could not support the fundraiser: Unexpected error!');
        }

        setIsLoading(false);
        resetInputs();
    };

    const handleRefund = async () => {
        setIsLoading(true);

        try {
            await contract.methods.refundFundraiser(fundraiser.id).send({ from: account });
            ToastsStore.success('Refund completed successfully');
        } catch (err) {
            ToastsStore.error('Could not refund: You may not have a right to complete this operation');
        }

        setIsLoading(false);
    };

    const handleCancelFundraiser = async () => {
        setIsLoading(true);

        try {
            await contract.methods.cancelTheFundraiser(fundraiser.id).send({ from: account });
            ToastsStore.success("Fundraiser cancelled successfully");
        } catch (err) {
            ToastsStore.error('Could not cancel the fundraiser: You may not have a right to complete this operation');
        }

        setIsLoading(false);
    };

    const handleCompleteFundraiser = async () => {
        setIsLoading(true);

        try {
            await contract.methods.completeTheFundraiser(fundraiser.id).send({ from: account });
            ToastsStore.success("Fundraiser cancelled successfully");
        } catch (err) {
            ToastsStore.error('Could not cancel the fundraiser: You may not have a right to complete this operation');
        }

        setIsLoading(false);
    };

    const isFundraiserClosed = fundraiser.state != 0;
    const isOwner = account === fundraiser.owner;

    return(
        <Modal keyboard={!isLoading} backdrop='static' show={show} size='lg' centered onHide={handleClose}>
            <LoadingOverlay active={isLoading} spinner={<FadeLoader color='#FFF'/>}>
                <Modal.Header closeButton>
                    <Modal.Title>{fundraiser.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><span className='bold-highlight grey'>Created by: </span>{fundraiser.owner}</p>
                    <p><span className='bold-highlight grey'>Goal: </span>{fromWei(String(fundraiser.goal), 'ether')} ETH</p>
                    <p><span className='bold-highlight grey'>Raised: </span>{fromWei(String(fundraiser.raised), 'ether')} ETH</p>
                    <p><span className='bold-highlight grey'>State: </span>{fundraiserStates[fundraiser.state]}</p>
                    <p className='modal-label'>Support the fundraiser:</p>
                    <Row className='align-items-center'>
                        <Col sm={6} xs={4}>
                            <input value={fundValue} onChange={(e) => setFundValue(e.target.value)} placeholder="Funds..." className='modal-input'/>
                        </Col>
                        <Col sm={3} xs={4}>
                            <ValueTypeSelect value={valueType} setValue={setValueType}/>
                        </Col>
                        <Col sm={3} xs={4}>
                            <button disabled={isFundraiserClosed} onClick={handleFund} className='submit-modal-button full-width'>
                                Fund
                            </button>
                        </Col>
                    </Row>
                    <p className='modal-label'>Fundraiser controls:</p>
                    <div className='fundraiser-controls'>
                        <button disabled={isFundraiserClosed} onClick={handleRefund} className='simple-button'>
                            Refund
                        </button>
                        <button disabled={isFundraiserClosed || !isOwner} onClick={handleCancelFundraiser} className='simple-button'>
                            Cancel the Fundraiser
                        </button>
                        <button disabled={isFundraiserClosed || !isOwner} onClick={handleCompleteFundraiser} className='simple-button'>
                            Complete the Fundraiser
                        </button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='close-modal-button' onClick={handleClose}>
                        Close
                    </button>
                </Modal.Footer>
            </LoadingOverlay>
        </Modal>
    );
};

export default ViewFundraiserModal;