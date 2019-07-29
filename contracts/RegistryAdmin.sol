pragma solidity ^0.5.10;


contract RegistryAdmin {
    address public admin;

    event AdminChanging(address indexed previousAdmin, address indexed nextAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    constructor(address _admin) internal {
        admin = _admin;
        emit AdminChanging(address(0), admin);
    }

    function changeRegistryAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0));

        emit AdminChanging(admin, _newAdmin);
        admin = _newAdmin;
    }
}