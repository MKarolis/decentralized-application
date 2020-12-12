// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Application {

    enum FundraiserState {ACTIVE, COMPLETED, CANCELLED}
    
    struct Fundraiser {
        uint32 id;
        address owner;
        string title;
        uint256 goal; // In wei
        uint256 raised; // In wei
        FundraiserState state;
    }

    struct UserFundings {
        mapping(uint32 => uint256) funded; // fundraiser id => funded amount
    }

    uint32 public fundraiserCount = 0;

    mapping(uint32 => Fundraiser) public fundraisers;
    mapping(address => UserFundings) fundingsByUser;

    struct FundersMapping {
        mapping(address => uint) addressIndex;
        address payable[] fundersAddreses; // Dummy element at 0
    }
    mapping(uint32 => FundersMapping) fundersByFundraiserId;

    modifier onlyOwner(uint32 fundraiserId) {
        require(msg.sender == fundraisers[fundraiserId].owner, "Operation only allowed for fundrayser's owner");
        _;
    }

    modifier activeFundraiser(uint32 fundraiserId) {
        require(fundraiserId < fundraiserCount, "Fundrayser does not exist");
        require(fundraisers[fundraiserId].state == FundraiserState.ACTIVE, "Operation only available for ACTIVE fundraysers");
        _;
    }

    function getAllFundraisers() public view returns 
        (uint32[] memory, address[] memory, string[] memory, uint256[] memory, uint256[] memory, FundraiserState[] memory) {
        
        uint32[] memory ids = new uint32[](fundraiserCount);
        address[] memory adresses = new address[](fundraiserCount);
        string[] memory titles = new string[](fundraiserCount);
        uint256[] memory goals = new uint256[](fundraiserCount);
        uint256[] memory raised = new uint256[](fundraiserCount);
        FundraiserState[] memory states = new FundraiserState[](fundraiserCount);

        for(uint32 i = 0; i < fundraiserCount; i++) {
            Fundraiser memory raiser = fundraisers[i];
            ids[i] = raiser.id;
            adresses[i] = raiser.owner;
            titles[i] = raiser.title;
            goals[i] = raiser.goal;
            raised[i] = raiser.raised;
            states[i] = raiser.state;
        }

        return(ids, adresses, titles, goals, raised, states);
    }


    function createFundraiser(string memory title, uint256 goal) public returns(uint32) {
        require(goal > 0);
        require(bytes(title).length > 0);

        fundraisers[fundraiserCount] = Fundraiser(
            fundraiserCount, msg.sender, title, goal, 0, FundraiserState.ACTIVE
        );

        fundersByFundraiserId[fundraiserCount].fundersAddreses = [address(0)];
        fundraiserCount++;
        
        return(fundraiserCount - 1);
    }

    function supportFundraiser(uint32 fundraiserId) public payable activeFundraiser(fundraiserId) {
        require(msg.value > 0);

        fundraisers[fundraiserId].raised += msg.value;
        fundingsByUser[msg.sender].funded[fundraiserId] += msg.value;

        if(fundersByFundraiserId[fundraiserId].addressIndex[msg.sender] == 0) {
            fundersByFundraiserId[fundraiserId].addressIndex[msg.sender] = fundersByFundraiserId[fundraiserId].fundersAddreses.length;
            fundersByFundraiserId[fundraiserId].fundersAddreses.push(msg.sender);
        }
    }

    function refundFundraiser(uint32 fundraiserId) public activeFundraiser(fundraiserId) {
        require(fundingsByUser[msg.sender].funded[fundraiserId] > 0);

        uint256 funded = fundingsByUser[msg.sender].funded[fundraiserId];
        delete fundingsByUser[msg.sender].funded[fundraiserId];
        fundraisers[fundraiserId].raised -= funded;

        // Delete funding from the fundersByFundraiserId lookup
        uint userIndex = fundersByFundraiserId[fundraiserId].addressIndex[msg.sender];
        address payable lastAddress = fundersByFundraiserId[fundraiserId].fundersAddreses[
            fundersByFundraiserId[fundraiserId].fundersAddreses.length - 1
        ];

        fundersByFundraiserId[fundraiserId].addressIndex[msg.sender] = 0;
        fundersByFundraiserId[fundraiserId].fundersAddreses[userIndex] = lastAddress;
        fundersByFundraiserId[fundraiserId].addressIndex[lastAddress] = userIndex;
        fundersByFundraiserId[fundraiserId].fundersAddreses.pop();

        msg.sender.transfer(funded);
    }

    function completeTheFundraiser(uint32 fundraiserId) public activeFundraiser(fundraiserId) onlyOwner(fundraiserId) {
        fundraisers[fundraiserId].state = FundraiserState.COMPLETED;
        msg.sender.transfer(fundraisers[fundraiserId].raised);
    }

    function cancelTheFundraiser(uint32 fundraiserId) public activeFundraiser(fundraiserId) onlyOwner(fundraiserId) {
        fundraisers[fundraiserId].state = FundraiserState.CANCELLED;

        uint256 refundsCount = fundersByFundraiserId[fundraiserId].fundersAddreses.length;
        for(uint256 i = 0; i < refundsCount; i++) {
            address payable refundAddress = fundersByFundraiserId[fundraiserId].fundersAddreses[i];
            refundAddress.transfer(
                fundingsByUser[refundAddress].funded[fundraiserId]
            );
        }
    }
}