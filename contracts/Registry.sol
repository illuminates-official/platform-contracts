pragma solidity ^0.5.10;

import "./RegistryAdmin.sol";
import "./IAR.sol";

contract Registry is RegistryAdmin {

    struct info {
        string type_;
        bool active;
        address admin;
    }

    mapping(address => info) private registry;
    string[] public types = ["ApprovableTask", "Article", "Batch", "Conference", "Invoice", "Patent", "PrivateProperty", "Task"];

    event ContractStatusChanged(address indexed _contract, string indexed _type, address indexed _admin);

    constructor(address _admin) RegistryAdmin(_admin) public {}

    function addContractToRegistry(address _contract, uint _type, address _admin) public onlyAdmin {
        require(!registry[_contract].active);
        require(_type < types.length);
        registry[_contract].type_ = types[_type];
        registry[_contract].active = true;
        registry[_contract].admin = _admin;

        emit ContractStatusChanged(_contract, types[_type], _admin);
    }

    function getContractInfo(address _contract) public view returns(string memory, bool, address) {
        return(registry[_contract].type_, registry[_contract].active, registry[_contract].admin);
    }

    function addType(string memory _newType) public onlyAdmin {
        types.push(_newType);
    }

    function removeType(uint index) public onlyAdmin {
        require(index < types.length);
        for (uint i = index; i < types.length - 1; i++)
            types[i] = types[i + 1];
        // types[index] = types[types.length - 1];
        types.pop();
    }

    // by registry admin?
    function deactivateContract(address _contract) public {
        require(msg.sender == registry[_contract].admin);

        registry[_contract].active = false;
    }

    function changeAdmin(address _contract, address _newAdmin) public {
        require(msg.sender == registry[_contract].admin);

        IAR(_contract).changeAdmin(_newAdmin);
    }

    function changeAdmin(address _newAdmin) public {
        require(registry[msg.sender].active);

        changeContractAdmin(msg.sender, _newAdmin);
    }

    function changeContractAdmin(address _contract, address _newAdmin) internal {
        registry[_contract].admin = _newAdmin;
        emit ContractStatusChanged(_contract, registry[_contract].type_, _newAdmin);
    }
}