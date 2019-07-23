import "./Admin.sol";

contract Registry is Admin {

    enum types {
        task,
        news,
        private_property,
        invoice,
        patent,
        dedicated_registry
    }

    struct info{
        types cur_type;
        bool is_active;
        address admin;
    }

    mapping(address => info) registry;
    string[] types_list = ["task", "news", "private property", "invoice", "patent", "dedicated_registry"];

    event addContract(address _contract, address _admin);
    event Constructor(address _admin);

    constructor(address _admin) public {
        cur_admin = _admin;
        emit Constructor(cur_admin);
    }

    function addContractToRegistry(uint _type, address _contract) public onlyAdmin returns(bool success) {
        require(!registry[_contract].is_active);
        require(_type < types_list.length);
        registry[_contract].cur_type = types(_type);
        registry[_contract].is_active = true;
        registry[_contract].admin = msg.sender;
        emit addContract(_contract, msg.sender);

        return true;
    }

    function getContractInfo(address _contract) public view returns(string memory, bool, address) {
        return(getTypeContract(_contract), registry[_contract].is_active, registry[_contract].admin);
    }

    function isRegistered(address _contract) public view returns(bool) {
        return registry[_contract].is_active;
    }

    function getType(uint _num) public view returns(string memory) {
        require(_num < types_list.length);
        return types_list[_num];
    }

    function getTypeContract(address _contract) public view returns(string memory) {
        require(isRegistered(_contract));
        return getType(uint(registry[_contract].cur_type));
    }
}