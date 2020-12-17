import React from "react";
import {etherValueOptions} from "../../commons/constants/contants";
import Form from "react-bootstrap/Form";

const ValueTypeSelect = ({value, setValue}) => {
    return (
        <Form.Control as="select" value={value} onChange={(e) => setValue(e.target.value)}>
            {etherValueOptions.map(opt => <option key={`cf-opt-${opt}`}>{opt}</option>)}
        </Form.Control>
    );
};

export default ValueTypeSelect;