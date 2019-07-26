pragma solidity ^0.5.10;

contract Admin {
    address public cur_admin;
    event ChangeAdmin(address oldAdmin, address newAdmin);
    
    modifier onlyAdmin() {
        require(msg.sender == cur_admin);
        _;
    }
    
    function changeAdmin(address newAdmin) public onlyAdmin {
        cur_admin = newAdmin;
    }
    
}