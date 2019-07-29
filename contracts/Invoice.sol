pragma solidity ^0.5.10;

import "./Admin.sol";


contract Invoice is Admin {

    bytes32 public seller_hash;
    bytes32 public customer_hash;
    bytes32 public product_hash;
    uint public delivery_time;
    uint public realDelivery_time;
    bool public delivery_status;
    bool public payment_status;
    bytes32 public doc_hash;
    address public registry;

    event ChangeRegistry(address registry);
    event SetDoc_hash(bytes32);
    event SetDelivery_status(bool);
    event SetPayment_status(bool);
    event SetRealDelivery_time(uint);
    event Costructor(address _registry, address admin);

    constructor(bytes32 _seller_hash, bytes32 _customer_hash,
                uint _delivery_time, address _registry, address _admin) public {

        seller_hash = _seller_hash;
        customer_hash = _customer_hash;
        delivery_time = _delivery_time;
        registry = _registry;
        admin = _admin;

        emit Costructor(registry, admin);
    }

    function setDoc_hash(bytes32 _doc_hash) public onlyAdmin {
        doc_hash = _doc_hash;
        emit SetDoc_hash(_doc_hash);
    }

    function setDeliveryStatus(bool _stat) public onlyAdmin {
        delivery_status = _stat;
        emit SetDelivery_status(_stat);
    }

    function setPaymentStatus(bool _stat) public onlyAdmin {
        payment_status = _stat;
        emit SetPayment_status(_stat);
    }

    function setRealDeliveryTime(uint _time) public onlyAdmin {
        realDelivery_time = _time;
        emit SetRealDelivery_time(_time);
        setDeliveryStatus(true);
    }

    function changeRegistry(address _newregistry) public onlyAdmin {
        registry = _newregistry;
        emit ChangeRegistry(registry);
    }
}