import "./SafeMath.sol";
import "./Admin.sol";


contract Batch is Admin {

    using SafeMath
    for uint;

    bytes32 public manufacturer;
    bytes32 public batch;
    string public batchInformation;
    bytes32[] public distributors;
    address public registry;
    uint public totalSupply;

    mapping(bytes32 => uint) public products;

    event Assigment(bytes32 distributor, uint products, uint time);
    event Selling(bytes32 distributor, uint products, uint time);
    event RegistryChanging(address changer, address newRegistry, uint time);
    event Constructor(address _admin, address _registry);

    constructor(bytes32 _manufacturer, bytes32 _batch, string memory _batchInformation,
        bytes32[] memory _distributors, uint[] memory _productAmount,
        address admin, address _registry)
    public {
        manufacturer = _manufacturer;
        batch = _batch;
        batchInformation = _batchInformation;
        distributors = _distributors;

        cur_admin = admin;
        registry = _registry;

        _amountAssigment(distributors, _productAmount);

        emit Constructor(cur_admin, registry);
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

    function changeRegistry(address _newRegistry) public onlyAdmin {
        registry = _newRegistry;
        emit RegistryChanging(msg.sender, registry, now);
    }

}