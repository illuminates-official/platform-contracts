import "./Admin.sol";

contract PrivateProperty is Admin {

    bytes32 public doc_hash;
    bytes32 public owner_hash;
    address public registry;
    string public doc;

    event New_Dochash(bytes32);
    event New_Doc(string);
    event Change_registry(address _who, address _newregistry);
    event Constructor(address _admin, address _registry);

    constructor(address _admin, bytes32 _owner_hash, address _registry) public {
        cur_admin = _admin;
        owner_hash = _owner_hash;
        registry = _registry;

        emit Constructor(_admin, _registry);
    }

    function setDoc_hash(bytes32 _str) public onlyAdmin {
        doc_hash = _str;
        emit New_Dochash(doc_hash);
    }

    function setDoc(string memory _str) public onlyAdmin {
        doc = _str;
        emit New_Doc(doc);
    }
    
    function changeRegistry(address _newregistry) public onlyAdmin {
        registry = _newregistry;
        emit Change_registry(msg.sender, registry);
    }
 
}