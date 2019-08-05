pragma solidity ^0.5.10;

import "./Admin.sol";
import "./IERC20.sol";

contract Conference is Admin {

    address payable public ethRecipient;
    bytes32 public fiatRecipient;
    uint public cost;
    uint public fcost;

    mapping(address => bool) public tickets;
    mapping(bytes32 => bool) public ftickets;

    constructor(address payable eth, bytes32 fiat, uint _cost, uint _fcost,
        address _admin, address _reg) Admin(_admin, _reg)
    public {
        ethRecipient = eth;
        fiatRecipient = fiat;
        cost = _cost;
        fcost = _fcost;
    }

    function payTicket() public payable{
        require(msg.value == cost);

        ethRecipient.transfer(msg.value);
        tickets[msg.sender] = true;
    }

    function fpayTicket(bytes32 payer, uint payment) public{
        require(payment == fcost);

        ftickets[payer] = true;
    }

    function isEqual(string memory _str, bytes32 _hash) public pure returns(bool) {
        bytes32 keccakHash = keccak256(abi.encodePacked(_str));
        return keccakHash == _hash;
    }
}