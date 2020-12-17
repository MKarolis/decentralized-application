import React, {useState} from "react";
import LoadingOverlay from "react-loading-overlay";
import {FadeLoader} from "react-spinners";
import Modal from "react-bootstrap/cjs/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ValueTypeSelect from "../../components/ValueTypeSelect/ValueTypeSelect";
import {etherValueOptions, fundraiserStates} from "../../commons/constants/contants";
import './ViewFundraiserModal.css';
import {fromWei} from "web3-utils";

const ViewFundraiserModal = ({show, closeModal, account, contract, fundraiser}) => {
    const [valueType, setValueType] = useState(etherValueOptions[0]);

    return(
        <Modal keyboard={false} backdrop='static' show={show} size='lg' centered onHide={closeModal}>
            <LoadingOverlay active={false} spinner={<FadeLoader color='#FFF'/>}>
                <Modal.Header closeButton>
                    <Modal.Title>{fundraiser.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><span className='bold-highlight grey'>Created by: </span>{fundraiser.owner}</p>
                    <p><span className='bold-highlight grey'>Goal: </span>{fromWei(fundraiser.goal, 'ether')} ETH</p>
                    <p><span className='bold-highlight grey'>Raised: </span>{fromWei(fundraiser.raised, 'ether')} ETH</p>
                    <p><span className='bold-highlight grey'>State: </span>{fundraiserStates[fundraiser.state]}</p>
                    <p className='modal-label'>Support the fundraiser:</p>
                    <Row className='align-items-center'>
                        <Col sm={6} xs={4}>
                            <input placeholder="Funds..." className='modal-input'/>
                        </Col>
                        <Col sm={3} xs={4}>
                            <ValueTypeSelect value={valueType} setValue={setValueType}/>
                        </Col>
                        <Col sm={3} xs={4}>
                            <button className='submit-modal-button full-width'>
                                Fund
                            </button>
                        </Col>
                    </Row>
                    <p className='modal-label'>Fundraiser controls:</p>

                    <div className='fundraiser-controls'>
                        <button className='simple-button'>
                            Refund
                        </button>
                        <button className='simple-button'>
                            Cancel the Fundraiser
                        </button>
                        <button className='simple-button'>
                            Complete the Fundraiser
                        </button>
                    </div>
                    {/*<Row className='align-items-center margin-top-s'>*/}
                    {/*    <Col sm={3}>*/}
                    {/*        <p className='modal-label'>Goal</p>*/}
                    {/*    </Col>*/}
                    {/*    <Col sm={6} xs={7}>*/}
                    {/*        <input value={goalValue} onChange={e => setGoalValue(e.target.value)} placeholder="Goal..." className='modal-input'/>*/}
                    {/*    </Col>*/}
                    {/*    <Col sm={3} xs={5}>*/}
                    {/*        <Form.Control as="select" value={valueType} onChange={(e) => setValueType(e.target.value)}>*/}
                    {/*            {valueOptions.map(opt => <option key={`cf-opt-${opt}`}>{opt}</option>)}*/}
                    {/*        </Form.Control>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                </Modal.Body>
                <Modal.Footer>
                    <button className='close-modal-button' onClick={closeModal}>
                        Close
                    </button>
                </Modal.Footer>
            </LoadingOverlay>
        </Modal>
    );
};

export default ViewFundraiserModal;