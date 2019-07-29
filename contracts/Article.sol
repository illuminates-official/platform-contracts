pragma solidity ^0.5.10;

import "./Admin.sol";


contract Article is Admin {

    bytes32 public author;
    string public text;
    address public _reference;

    event AddingReference(address ref, address admin, uint time);
    event RegistryChanging(address changer, address newRegistry, uint time);
    event Constructor(address _admin, address _registry);

    constructor(bytes32 _auth, string memory _text, address _admin, address _reg) Admin(_admin, _reg) public {
        author = _auth;
        text = _text;

        emit Constructor(_admin, _reg);
    }

    function AddReference(address _ref) public onlyAdmin {
        require(_reference != _ref);

        _reference = _ref;

        emit AddingReference(_reference, msg.sender, now);
    }
}