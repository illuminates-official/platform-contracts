pragma solidity ^0.5.10;

import "./IAR.sol";

contract Admin {
    address public admin;
    address public registry;

    event AdminChanging(address indexed previousAdmin, address indexed nextAdmin);
    event RegistryChanging(address indexed previousRegistry, address indexed nextRegistry);

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    constructor(address _admin, address _registry) internal {
        admin = _admin;
        registry = _registry;
        emit AdminChanging(address(0), admin);
        emit RegistryChanging(address(0), registry);
    }

    function changeAdmin(address _newAdmin) public {
        require(msg.sender == admin || msg.sender == registry);
        require(_newAdmin != address(0));

        emit AdminChanging(admin, _newAdmin);

        admin = _newAdmin;
        IAR(registry).changeAdmin(_newAdmin);
    }

    function changeRegistry(address _newRegistry) public onlyAdmin {
        require(_newRegistry != address(0));

        emit RegistryChanging(registry, _newRegistry);

        IAR(registry).changeRegistry(_newRegistry);

        registry = _newRegistry;

    }
}