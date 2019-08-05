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

    event SetDoc_hash(bytes32);
    event SetDelivery_status(bool);
    event SetPayment_status(bool);
    event SetRealDelivery_time(uint);

    constructor(bytes32 _seller_hash, bytes32 _customer_hash,
                uint _delivery_time, address _admin, address _registry) Admin(_admin, _registry)
    public {
        seller_hash = _seller_hash;
        customer_hash = _customer_hash;
        delivery_time = _delivery_time;
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
}