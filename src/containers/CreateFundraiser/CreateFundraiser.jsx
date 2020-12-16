import React, {useState} from "react";
import './CreateFundraiser.css';
import Modal from "react-bootstrap/cjs/Modal";
import {FadeLoader} from "react-spinners";
import LoadingOverlay from "react-loading-overlay";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from'react-bootstrap/Form'

const valueOptions = ['Ether', 'Gwei', 'Wei'];

const CreateFundraiser = () => {
    const [isShowing, setIsShowing] = useState(false);
    const [valueType, setValueType] = useState(valueOptions[0]);
    const [goalValue, setGoalValue] = useState('');
    const [title, setTitle] = useState('');

    const handleClose = () => {
        setIsShowing(false);
        setValueType(valueOptions[0]);
        setTitle('');
        setGoalValue('');
    };

    return(
        <div className='create-fundraiser-holder'>
            <button onClick={() => setIsShowing(true)} className='create-fundraiser-button'>
                Create a Fundraiser
            </button>
            <Modal keyboard={false} backdrop='static' show={isShowing} size='lg' centered onHide={handleClose}>
                <LoadingOverlay active={false} spinner={<FadeLoader color='#FFF'/>}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Fundraiser</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className='align-items-center'>
                            <Col sm={3}>
                                <p className='modal-label'>Title</p>
                            </Col>
                            <Col>
                                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Fundraiser's title..." className='modal-input'/>
                            </Col>
                        </Row>
                        <Row className='align-items-center margin-top-s'>
                            <Col sm={3}>
                                <p className='modal-label'>Goal</p>
                            </Col>
                            <Col sm={6} xs={7}>
                                <input value={goalValue} onChange={e => setGoalValue(e.target.value)} placeholder="Goal..." className='modal-input'/>
                            </Col>
                            <Col sm={3} xs={5}>
                                <Form.Control as="select" value={valueType} onChange={(e) => setValueType(e.target.value)}>
                                    {valueOptions.map(opt => <option key={`cf-opt-${opt}`}>{opt}</option>)}
                                </Form.Control>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='close-modal-button' onClick={handleClose}>
                            Close
                        </button>
                        <button className='submit-modal-button' onClick={() => {}}>
                            Create a fundraiser
                        </button>
                    </Modal.Footer>
                </LoadingOverlay>
            </Modal>
        </div>
    )
};

export default CreateFundraiser;