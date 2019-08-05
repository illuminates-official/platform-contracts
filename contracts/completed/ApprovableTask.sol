pragma solidity ^0.5.10;

import "./Admin.sol";
import "./IERC20.sol";

contract ApprovableTask is Admin {

    bytes32 public executor;
    bytes32 public customer;
    address public approvement;
    bool public isApproved;
    address public token;
    uint public pay;
    address public customerAddr;

    event ExecutorChanging(bytes32 newExecutor, address admin, uint time);
    event Approvement(address approve, uint time);

    constructor(bytes32 exec, bytes32 cust, uint _pay,
        address _admin, address _reg) Admin(_admin, _reg)
    public {
        executor = exec;
        customer = cust;
        pay = _pay;
    }

    function isEqual(string memory _str, bytes32 _hash) public pure returns(bool) {
        bytes32 keccakHash = keccak256(abi.encode(_str));
        return keccakHash == _hash;
    }

    function changeExecutor(bytes32 newExecutor) public onlyAdmin {
        executor = newExecutor;
        emit ExecutorChanging(executor, admin, now);
    }

    function approve(address _approvement) public onlyAdmin {
        IERC20(token).transfer(customerAddr, pay);
        approvement = _approvement;
        isApproved = true;
        emit Approvement(approvement, now);
    }
}