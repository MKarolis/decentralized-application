import React from "react";
import FundraiserCard from "../FundraiserCard/FundraiserCard";
import './FundraiserList.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FundraiserList = () => {
    return (
        <div className='fundraiser-list'>
            <Row>
                <Col md={6} sm={12}>
                    <FundraiserCard/>
                </Col>
                <Col md={6} sm={12}>
                    <FundraiserCard/>
                </Col>
                <Col md={6} sm={12}>
                    <FundraiserCard/>
                </Col>
            </Row>
        </div>
    );
};

export default FundraiserList;