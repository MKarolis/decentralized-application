import React from "react";
import FundraiserCard from "../FundraiserCard/FundraiserCard";
import './FundraiserList.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FundraiserList = ({fundraisers, account, contract}) => {

    return (
        <div className='fundraiser-list'>
            <Row>
                {
                    fundraisers.map(fundraiser =>
                        <Col md={6} sm={12} key={`col-fl-${fundraiser.id}`}>
                            <FundraiserCard
                                contract={contract}
                                fundraiser={fundraiser}
                                account={account}
                            />
                        </Col>
                    )
                }
            </Row>
        </div>
    );
};

export default FundraiserList;