pragma solidity ^0.5.10;

import "./Admin.sol";


contract Article is Admin {

    bytes32 public author;
    string public text;
    address public _reference;
    address public registry;

    event AddingReference(address ref, address admin, uint time);
    event RegistryChanging(address changer, address newRegistry, uint time);
    event Constructor(address _admin, address _registry);

    constructor(bytes32 _auth, string memory _text, address admin, address _reg) public {
        author = _auth;
        text = _text;

        cur_admin = admin;
        registry = _reg;

        emit Constructor(cur_admin, registry);
    }

    function AddReference(address _ref) public onlyAdmin {
        require(_reference != _ref);

        _reference = _ref;

        emit AddingReference(_reference, msg.sender, now);
    }

    function changeRegistry(address _newRegistry) public onlyAdmin {
        registry = _newRegistry;
        emit RegistryChanging(msg.sender, registry, now);
    }

}