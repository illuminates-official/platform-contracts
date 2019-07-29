pragma solidity ^0.5.10;


interface IAR {

    function changeAdmin(address _newAdmin) external;
    function changeRegistry(address _newRegistry) external;

}