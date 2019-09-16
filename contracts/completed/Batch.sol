pragma solidity ^0.5.11;

import "./SafeMath.sol";
import "./Admin.sol";


contract Batch is Admin {

    using SafeMath
    for uint;

    bytes32 public manufacturer;
    bytes32 public batch;
    string public batchInformation;
    bytes32[] public distributors;
    uint public totalSupply;

    mapping(bytes32 => uint) public products;

    event Assigment(bytes32 indexed distributor, uint indexed products, uint indexed time);
    event Selling(bytes32 indexed distributor, uint indexed products, uint indexed time);

    constructor(
        bytes32 _manufacturer,
        bytes32 _batch,
        string memory _batchInformation,
        bytes32[] memory _distributors,
        uint[] memory _productAmount,
        address _registry
    )
        Admin(_registry)
        public
    {
        manufacturer = _manufacturer;
        batch = _batch;
        batchInformation = _batchInformation;
        distributors = _distributors;

        _amountAssigment(distributors, _productAmount);
    }

    function _amountAssigment(bytes32[] memory _distributors, uint[] memory _products) private {
        for (uint i = 0; i < _distributors.length; i++) {
            products[_distributors[i]] = products[_distributors[i]].add(_products[i]);
            totalSupply = totalSupply.add(_products[i]);
            emit Assigment(_distributors[i], _products[i], now);
        }
    }

    function amountAssigment(bytes32[] memory _distributors, uint[] memory _products) public onlyAdmin {
        _amountAssigment(_distributors, _products);
    }

    function sale(bytes32[] memory _distributors, uint[] memory _products) public onlyAdmin {
        for (uint i = 0; i < _distributors.length; i++) {
            products[_distributors[i]] = products[_distributors[i]].sub(_products[i]);
            totalSupply = totalSupply.sub(_products[i]);
            emit Selling(_distributors[i], _products[i], now);
        }
    }
}