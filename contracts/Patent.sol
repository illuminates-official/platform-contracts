import "./Admin.sol";


contract Patent is Admin {

    bytes32 public owner;
    bytes32 public doc;
    address public registry;

    event RegistryChanging(address changer, address newRegistry, uint time);
    event Constructor(address _admin, address _registry);

    constructor(bytes32 _owner, bytes32 _doc, address admin, address _registry) public {
        owner = _owner;
        doc = _doc;

        cur_admin = admin;
        registry = _registry;

        emit Constructor(cur_admin, registry);
    }


    function changeRegistry(address _newRegistry) public onlyAdmin {
        registry = _newRegistry;
        emit RegistryChanging(msg.sender, registry, now);
    }

}