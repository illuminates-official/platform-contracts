pragma solidity ^0.5.10;

import "./Admin.sol";


contract Patent is Admin {

    bytes32 public owner;
    bytes32 public doc;

    constructor(
        bytes32 _owner,
        bytes32 _doc,
        address _registry
    )
        Admin(_registry)
        public
    {
        owner = _owner;
        doc = _doc;
    }
}