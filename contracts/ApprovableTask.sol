pragma solidity ^0.5.10;

import "./Admin.sol";
import "./IERC20.sol";

contract ApprovableTask is Admin {

    bytes32 public executor;
    bytes32 public customer;
    address public registry;
    address public approvement;
    bool public isApproved;
    address public token;
    uint public pay;
    address public customerAddr;

    event ExecutorChanging(bytes32 newExecutor, address admin, uint time);
    event RegistryChanging(address changer, address newRegistry, uint time);
    event Approvement(address approve, uint time);
    event Constructor(address _admin, address _registry);

    constructor(bytes32 exec, bytes32 cust, uint _pay,
        address _admin, address _reg)
    public {
        executor = exec;
        customer = cust;
        pay = _pay;

        admin = _admin;
        registry = _reg;

        emit Constructor(admin, registry);
    }

    function isEqual(string memory _str, bytes32 _hash) public pure returns(bool) {
        bytes32 keccakHash = keccak256(abi.encode(_str));
        if (keccakHash == _hash)
            return true;
        else
            return false;
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

    function changeRegistry(address _newRegistry) public onlyAdmin {
        registry = _newRegistry;
        emit RegistryChanging(msg.sender, registry, now);
    }
}