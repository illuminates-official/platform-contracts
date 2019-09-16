pragma solidity ^0.5.11;


interface IRegistry {

    function changeAdmin(address _newAdmin) external;
    function changeRegistry(address _newRegistry) external;

    function admin() external view returns(address);
    function registry() external view returns(address);
    function isAdmin(address _sender) external view returns(bool);

    function deactivateContract() external;
    // function addContractToRegistry(address _contract, uint _type, address _admin) external;
    // function addContractToRegistry(address _contract, uint _type) external;
    function addContractToRegistry(address _contract) external;

    function getContractInfo(address _contract) external view returns(string memory, bool, address);

}