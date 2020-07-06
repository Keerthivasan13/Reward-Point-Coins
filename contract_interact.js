// Import the necessary libraries to access the Ethereum network
let fs = require('fs');
let Web3 = require('web3');

// Create an instance of the Web3 API to access the network
let web3 = new Web3();

// Connect the Web3 to Ganache local network
web3.setProvider(new web3.providers.HttpProvider('HTTP://127.0.0.1:7475'));

// Intialize the contract address for the Smart Contract RewardContract.sol
let contractAddress = "0x631FE836E7295b784304c1876F128C50B2217AeA";

// Read the compiled artifacts necessary to access the contract
let jsonStr = fs.readFileSync('build/contracts/RewardContract.json', 'utf8');
let abi = JSON.parse(jsonStr).abi;

//Initialize the variables to be used in the program
const maxMerchants = 5;
const maxUsers = 5;
let addresses = ["0x5c77be80E44A6bc5A65abD8c95eA9B2716533E8F",
"0xc12b27ce60Fc45559977bA434e231b050Ec858Ba",
"0x4A39F7c9219C5B2E680f643be432704ebC4E31ba",
"0x81644F6286F3eF37F9da54145680A342986fac37",
"0x1Fa12dFEc068d20547344fd6594d7f941E6Dc947",
"0xdB589F81285BB75D57E94bB913DbC2bBC7f1c011",
"0x251bFA85b8928E35Fa589B309f5730746cBfdD84",
"0x6944a7Eb52EaB5b5BC9Bec8fA6B3e7490CA534EF",
"0xe3DF1de6fB5736eE1553820EceA60d88D9D0E0c9",
"0x0aC0c692AB982EB25059AB049ac411EDd640E62e"]
let merchantInfoList = []
let userInfoList = []
let reward = new web3.eth.Contract(abi, contractAddress);

// Start the transactions
sendMainTransaction()
    .then(function() {
        console.log("All transactions are done successfully");
    })
    .catch(function(error) {
        console.log(error);
    })

async function registerUsers() {
    for(var i = 0; i < userInfoList.length; i++) {
        await registerUser(userInfoList[i].address)
        console.log(userInfoList[i].name + " registered with the address " + userInfoList[i].address);
    }
}

async function registerMerchants() {
    for(var i = 0; i < merchantInfoList.length; i++) {
        await registerMerchant(merchantInfoList[i].address)
        console.log(merchantInfoList[i].name + " registered with the address " + merchantInfoList[i].address);
    }
}

// Series of sample Earn Reward Transactions for the Users
async function earnAllRewardPoints() {
    let rewardPoint = {     
        scope : "general",
        usePermissions : "gift",
        amount : 10
    }
    await earnRewardPointsForUser(0, rewardPoint)
    await earnRewardPointsForUser(1, rewardPoint)
    await earnRewardPointsForUser(2, rewardPoint)
}

// Series of sample Use Reward Transactions for the Users
async function useAllRewardPoints() {
    let rewardPoint = {     
        scope : "general",
        usePermissions : "gift",
        amount : 5
    }
    await useRewardPointsAtMerchant(0, 0, rewardPoint)
    await useRewardPointsAtMerchant(1, 1, rewardPoint)
   
}

async function registerUser(address) {
    await reward.methods.registerUser().send({from: address});
}

async function registerMerchant(address) {
    await reward.methods.registerMerchant().send({from: address})
}

async function earnRewardPointsForUser(userIndex, rewardPoint) {
    await reward.methods.earnPoints(userInfoList[userIndex].address, rewardPoint.scope, rewardPoint.usePermissions, rewardPoint.amount)
    console.log("User " + userInfoList[userIndex].name + " earned "+ rewardPoint.amount +" reward points of category " + rewardPoint.scope + " and permissions "+ rewardPoint.usePermissions);
}

async function useRewardPointsAtMerchant(userIndex, merchantIndex, rewardPoint) {
    await reward.methods.usePoints(merchantInfoList[merchantIndex].address, rewardPoint.scope, rewardPoint.usePermissions, rewardPoint.amount).send({from: userInfoList[userIndex].address})
    console.log("User " + userInfoList[userIndex].name + " used "+ rewardPoint.amount +" reward points of category " + rewardPoint.scope + " and permissions "+ rewardPoint.usePermissions +" at "+ merchantInfoList[merchantIndex].name);
}

async function loadMerchants() {
    let loadedMerchants = new Set()

        // Parse the json file to get merchant names and IDs.
        var fs = require('fs');
        await fs.readFile('merchants.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it's an object
                var index = 0;
                var z = 0;
                console.log("Getting the Merchant Details from the Visa API Static store\n");
                for (var i = 0; i < obj.Offers.length; i++) {
                    var merchants = obj.Offers[i].merchantList;
                    for (var j = 0; j < merchants.length; j++) {
                        var name = merchants[j].merchant;
                        var id = merchants[j].merchantId;
                        if (!(loadedMerchants.has(id))) {
                            let json = {name: name, id: id, address: addresses[z]}
                            console.log("Merchant - "+ name + " with ID "+ id + " is loaded with the address "+ addresses[z])
                            z += 1
                            merchantInfoList.push(json)
                            loadedMerchants.add(id)
                        }

                    }           
                }
            }
            
            console.log("-----Registered the Merchants-----\n");
        });
}

function loadUsers() {
    let userList  = ["User1", "User2", "User3", "User4", "User5"]

    for (var i = 0; i < maxUsers; i++) {
        var userInfo = {name: userList[i], address: addresses[maxMerchants + i]}
        userInfoList.push(userInfo)
    }
}

async function sendMainTransaction() {
    console.log("----- Reward Point Coins using Ethereum -----\n");
    loadUsers()
    loadMerchants().then(function() {
        registerMerchants()
        .then(function() {
            registerUsers()
            .then(function() {
                earnAllRewardPoints()
                .then(function() {
                    console.log("-----Gave Reward Points to the Users-----\n");
                    useAllRewardPoints()
                    .then(function() {
                        console.log("-----Used Reward Points at the Merchants-----\n");
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                })
                .catch(function(error) {
                    console.log(error);
                })
                console.log("-----Registered the Users-----\n");
            })
            .catch(function(error) {
                console.log(error);
            })
        })
        .catch(function(error) {
            console.log(error);
        })
    })

}

