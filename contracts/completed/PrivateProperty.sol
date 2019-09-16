pragma solidity ^0.5.10;

import "./Admin.sol";

contract PrivateProperty is Admin {

    bytes32 public doc_hash;
    bytes32 public owner_hash;
    string public doc;

    event New_Dochash(bytes32);
    event New_Doc(string);

    constructor(bytes32 _owner_hash, address _registry) Admin(_registry) public {
        owner_hash = _owner_hash;
    }

    function setDoc_hash(bytes32 _str) public onlyAdmin {
        doc_hash = _str;
        emit New_Dochash(doc_hash);
    }

    function setDoc(string memory _str) public onlyAdmin {
        doc = _str;
        emit New_Doc(doc);
    }
}