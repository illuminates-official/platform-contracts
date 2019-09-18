pragma solidity ^0.5.11;

import "./IRegistry.sol";

contract Admin {
    IRegistry public registry;

    modifier onlyAdmin() {
        require(registry.isAdmin(msg.sender), "Sender is not an admin");
        _;
    }

    constructor(address _registry) internal {
        registry = IRegistry(_registry);
    }

    function changeAdmin(address _newAdmin) public onlyAdmin {
        registry.changeAdmin(_newAdmin);
    }
}