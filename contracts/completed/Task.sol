pragma solidity ^0.5.10;

import "./Admin.sol";

contract Task is Admin {

    bytes32 public executor;
    bytes32 public customer;
    bytes32 public tor;
    bytes32 public correspondenceStatus;

    event ExecutorChanging(bytes32 newExecutor, address admin, uint time);
    event TorChanging(bytes32 newTorm, address admin, uint time);
    event cStatusChanging(bytes32 newStatus, address admin, uint time);

    constructor(bytes32 exec, bytes32 cust, bytes32 _tor, bytes32 cStat,
        address _admin, address _reg) Admin(_admin, _reg)
    public {
        executor = exec;
        customer = cust;
        tor = _tor;
        correspondenceStatus = cStat;
    }

    function isEqual(string memory _str, bytes32 _hash) public pure returns(bool) {
        bytes32 keccakHash = keccak256(abi.encode(_str));
        return keccakHash == _hash;
    }

    function changeExecutor(bytes32 newExecutor) public onlyAdmin {
        executor = newExecutor;
        emit ExecutorChanging(executor, admin, now);
    }

    function changeTor(bytes32 newTor) public onlyAdmin {
        tor = newTor;
        emit TorChanging(tor, admin, now);
    }

    function changeCStatus(bytes32 newCStatus) public onlyAdmin {
        correspondenceStatus = newCStatus;
        emit cStatusChanging(correspondenceStatus, admin, now);
    }
}