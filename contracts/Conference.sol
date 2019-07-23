


import "./Admin.sol";
import "./IERC20.sol";

contract Conference is Admin {

    address public registry;
    address payable public ethRecipient;
    bytes32 public fiatRecipient;
    uint public cost;
    uint public fcost;

    mapping(address => bool) public tickets;
    mapping(bytes32 => bool) public ftickets;

    event RegistryChanging(address changer, address newRegistry, uint time);
    event Constructor(address _admin, address _registry);

    constructor(address payable eth, bytes32 fiat, uint _cost, uint _fcost,
        address admin, address _reg)
    public {
        ethRecipient = eth;
        fiatRecipient = fiat;
        cost = _cost;
        fcost = _fcost;

        cur_admin = admin;
        registry = _reg;

        emit Constructor(cur_admin, registry);
    }

    function payTicket() public payable{
        require(msg.value == cost);

        ethRecipient.transfer(msg.value);
        tickets[msg.sender] = true;
    }

    function fpayTicket(bytes32 payer, uint payment) public{
        require(payment == fcost);

        ftickets[payer] = true;
    }

    function isEqual(string memory _str, bytes32 _hash) public pure returns(bool) {
        bytes32 keccakHash = keccak256(abi.encode(_str));
        if (keccakHash == _hash)
            return true;
        else
            return false;
    }


    function changeRegistry(address _newRegistry) public onlyAdmin {
        registry = _newRegistry;
        emit RegistryChanging(msg.sender, registry, now);
    }
    

}