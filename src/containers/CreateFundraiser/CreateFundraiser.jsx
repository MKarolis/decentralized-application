import React, {useState} from "react";
import './CreateFundraiser.css';
import Modal from "react-bootstrap/cjs/Modal";
import {FadeLoader} from "react-spinners";
import LoadingOverlay from "react-loading-overlay";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {etherValueOptions} from "../../commons/constants/contants";
import ValueTypeSelect from "../../components/ValueTypeSelect/ValueTypeSelect";
import {ToastsStore} from "react-toasts";
import {toWei} from "web3-utils";

const CreateFundraiser = ({account, contract}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [valueType, setValueType] = useState(etherValueOptions[0]);
    const [goalValue, setGoalValue] = useState('');
    const [title, setTitle] = useState('');

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        setIsShowing(false);
        setValueType(etherValueOptions[0]);
        setTitle('');
        setGoalValue('');
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            ToastsStore.error('Could not create the fundraiser: title is required!');
            return;
        } else if (isNaN(goalValue) || Number(goalValue) <= 0) {
            ToastsStore.error("Could not create the fundraiser: invalid goal value provided!");
            return;
        }

        setIsLoading(true);
        try {
            await contract.methods.createFundraiser(title, toWei(String(Number(goalValue)), valueType))
                .send({from: account});
            ToastsStore.success("Fundraiser created successfully!");
        } catch (err) {
            ToastsStore.error("Could not create the fundraiser: Unexpected error");
        }

        setIsLoading(false);
        setIsShowing(false);
    };

    return(
        <div className='create-fundraiser-holder'>
            <button onClick={() => setIsShowing(true)} className='create-fundraiser-button'>
                Create a Fundraiser
            </button>
            <Modal keyboard={!isLoading} backdrop='static' show={isShowing} size='lg' centered onHide={handleClose}>
                <LoadingOverlay active={isLoading} spinner={<FadeLoader color='#FFF'/>}>
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
                                <ValueTypeSelect value={valueType} setValue={setValueType}/>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='close-modal-button' onClick={handleClose}>
                            Close
                        </button>
                        <button className='submit-modal-button' onClick={handleSubmit}>
                            Create a fundraiser
                        </button>
                    </Modal.Footer>
                </LoadingOverlay>
            </Modal>
        </div>
    )
};

export default CreateFundraiser;