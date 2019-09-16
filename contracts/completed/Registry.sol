pragma solidity ^0.5.11;

import "./RegistryAdmin.sol";
import "./IRegistry.sol";
import "./StringUtils.sol";

contract Registry is RegistryAdmin {

    using StringUtils for string;

    struct info {
        string type_;
        bool active;
        address admin;
    }

    mapping(address => info) public registry;
    string[] public types = ["ApprovableTask", "Article", "Batch", "Conference", "Invoice", "Patent", "PrivateProperty", "Task"];

    modifier onlyContractAdmin(address _contract) {
        require(msg.sender == registry[_contract].admin, "Sender not the admin of the contract");
        _;
    }

    modifier onlyActiveContract() {
        require(registry[msg.sender].active, "Request not from active contract");
        _;
    }

    event ContractStatusChanged(address indexed _contract, string indexed _type, address indexed _admin);
    event ContractStatusChanging(address indexed _contract, bool indexed _status);

    constructor(address _admin) RegistryAdmin(_admin) public {}

    function addContractToRegistry(address _contract, uint _type, address _admin) public onlyAdmin {
        _addContractToRegistry(_contract, _type, _admin);
    }

    function addContractToRegistry(address _contract) public {
        IRegistry prevRegistry = IRegistry(IRegistry(_contract).registry());
        require(msg.sender == address(prevRegistry), "Request not from current registry");

        (string memory _type, bool _active, address _admin) = prevRegistry.getContractInfo(_contract);
        require(_active, "Contract inactive");

        _addContractToRegistry(_contract, getContractType(_type), _admin);
    }

    function changeRegistry(address _newRegistry) public onlyActiveContract {
        IRegistry(_newRegistry).addContractToRegistry(msg.sender);

        registry[msg.sender].active = false;
    }

    function _addContractToRegistry(address _contract, uint _type, address _admin) internal {
        require(!registry[_contract].active, "Contract already in registry");
        require(_type < types.length, "Type number out of range");
        registry[_contract].type_ = types[_type];
        registry[_contract].active = true;
        registry[_contract].admin = _admin;

        emit ContractStatusChanged(_contract, types[_type], _admin);
    }

    function getContractInfo(address _contract) public view returns(string memory, bool, address) {
        return(registry[_contract].type_, registry[_contract].active, registry[_contract].admin);
    }

    function getContractType(string memory _type) public view returns(uint) {
        for (uint i = 0; i < types.length; i++)
            if (types[i].hashCompareWithLengthCheck(_type))
                return i;
        revert("Type not found");
    }

    function addType(string memory _newType) public onlyAdmin {
        types.push(_newType);
    }

    function removeType(uint index) public onlyAdmin {
        require(index < types.length, "Index out of range");
        // for (uint i = index; i < types.length - 1; i++)
        //     types[i] = types[i + 1];
        types[index] = types[types.length - 1];
        types.pop();
    }

    // by registry admin?
    function deactivateContract(address _contract) public onlyContractAdmin(_contract) {
        registry[_contract].active = false;
    }

    function deactivateContract() public onlyContractAdmin(msg.sender) {
        registry[msg.sender].active = false;
    }

    function changeAdmin(address _contract, address _newAdmin) public onlyContractAdmin(_contract) {
        _changeContractAdmin(_contract, _newAdmin);
    }

    function changeAdmin(address _newAdmin) public onlyActiveContract {
        _changeContractAdmin(msg.sender, _newAdmin);
    }

    function _changeContractAdmin(address _contract, address _newAdmin) internal {
        require(_newAdmin != address(0), "New admin is the zero address");
        registry[_contract].admin = _newAdmin;
        emit ContractStatusChanged(_contract, registry[_contract].type_, _newAdmin);
    }

    function isAdmin(address _sender) public view returns(bool) {
        return registry[msg.sender].admin == _sender;
    }
}