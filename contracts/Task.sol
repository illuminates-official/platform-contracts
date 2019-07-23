import "./Admin.sol";

contract Task is Admin {

    bytes32 public executor;
    bytes32 public customer;
    bytes32 public tor;
    bytes32 public correspondenceStatus;
    address public registry;

    event ExecutorChanging(bytes32 newExecutor, address admin, uint time);
    event TorChanging(bytes32 newTorm, address admin, uint time);
    event cStatusChanging(bytes32 newStatus, address admin, uint time);
    event RegistryChanging(address changer, address newRegistry, uint time);
    event Constructor(address _admin, address _registry);

    constructor(bytes32 exec, bytes32 cust, bytes32 _tor, bytes32 cStat,
        address admin, address _reg)
    public {
        executor = exec;
        customer = cust;
        tor = _tor;
        correspondenceStatus = cStat;

        cur_admin = admin;
        registry = _reg;

        emit Constructor(cur_admin, registry);
    }

    function isEqual(string memory _str, bytes32 _hash) public pure returns(bool) {
        bytes32 keccakHash = keccak256(abi.encode(_str));
        if (keccakHash == _hash)
            return true;
        else
            return false;
    }

    function changeExecutor(bytes32 newExecutor) public onlyAdmin {
        executor = newExecutor;
        emit ExecutorChanging(executor, cur_admin, now);
    }

    function changeTor(bytes32 newTor) public onlyAdmin {
        tor = newTor;
        emit TorChanging(tor, cur_admin, now);
    }

    function changeCStatus(bytes32 newCStatus) public onlyAdmin {
        correspondenceStatus = newCStatus;
        emit cStatusChanging(correspondenceStatus, cur_admin, now);
    }

    function changeRegistry(address _newRegistry) public onlyAdmin {
        registry = _newRegistry;
        emit RegistryChanging(msg.sender, registry, now);
    }
}