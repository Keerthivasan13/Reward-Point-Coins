pragma solidity ^0.5.16;


contract RewardContract {
    struct RewardPoint {
        string scope;
        string usePermissions;
        uint balance;
    }
    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
    
    mapping(address => bool) registeredUsers;
    mapping(address => bool) registeredMerchants;
    
    address owner = msg.sender;
    mapping(address => RewardPoint[]) public RewardStatus;
    
    function registerUser() public{
        require(!registeredUsers[msg.sender], "User already registered!");
        registeredUsers[msg.sender] = true;
    }
    
    function registerMerchant() public{
        require(!registeredMerchants[msg.sender], "Merchant already registered!");
        registeredMerchants[msg.sender] = true;
    }
    
    function earnPoints(address targetUser, string memory scope, string memory usePermissions, uint amount) public{
        require(registeredUsers[targetUser], "Unregistered user!");
        for(uint i = 0; i < RewardStatus[targetUser].length; i++){
            if(compareStrings(RewardStatus[targetUser][i].scope, scope) && compareStrings(RewardStatus[targetUser][i].usePermissions, usePermissions)){
                RewardStatus[targetUser][i].balance += amount;
                return;
            }
        }
        RewardStatus[targetUser].push(RewardPoint({
            scope: scope,
            usePermissions: usePermissions,
            balance: amount
        }));
    }
    
    function usePoints(address merchant, string memory scope, string memory usePermissions, uint amount) public{
        require(registeredMerchants[merchant], "Unregistered merchant!");
        for(uint i = 0; i < RewardStatus[msg.sender].length; i++){
            if(compareStrings(RewardStatus[msg.sender][i].scope, scope) && compareStrings(RewardStatus[msg.sender][i].usePermissions, usePermissions)){
                    require(RewardStatus[msg.sender][i].balance >= amount, "Insufficient points!");
                    RewardStatus[msg.sender][i].balance -= amount;
                    return;
                    }
                }
                
            }
        
    }
