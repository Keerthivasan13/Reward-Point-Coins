// Import the necessary libraries to access the Ethereum network
let fs = require('fs');
let Web3 = require('web3');

// Create an instance of the Web3 API to access the network
let web3 = new Web3();

// Connect the Web3 to Ganache local network
web3.setProvider(new web3.providers.HttpProvider('HTTP://127.0.0.1:7475'));

// Intialize the contract address for the Smart Contract RewardContract.sol
let contractAddress = "0x6355b14d40280e5D37eD10a0D6F87Ae4517c2440";

// Read the compiled artifacts necessary to access the contract
let jsonStr = fs.readFileSync('build/contracts/RewardContract.json', 'utf8');
let abi = JSON.parse(jsonStr).abi;

//Initialize the variables to be used in the program
const maxMerchants = 5;
const maxUsers = 5;
let addresses = ["0x1A68F413B3680e289204A6A4A6A7123dc9F05F07",
"0xbF8F8Bc142A96e69a47889a63Da0714000C30E2E",
"0x342C3C417E4746942aEf2De36181ec9ea93f9102",
"0xbb28b416351440Be4BD5620f0109A283C32ef9F5",
"0xB4f3ad256d6a4fdD3960feCf8563FD07Df191666",
"0x0d870F51aEe90b353a4f0098a46be99AAaE1e3e4",
"0x7b8dC35B207774c36c7E0947f5E58544B56Fba88",
"0x658f8EBB7CD94EF06D6F5d04f97948B55a449d29",
"0x7Ea35da7217B600A9eD1fC2d99c4f21F27FF4fA6",
"0xf3dFcea6606BbD0370De513F97e3Cb3e894Bf68d"]
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

function loadMerchants() {
    let merchantList = ["Merchant1", "Merchant2", "Merchant3", "Merchant4", "Merchant5"]

    for (var i = 0; i < maxMerchants; i++) {
        var merchantInfo = {name: merchantList[i], address: addresses[i]}
        merchantInfoList.push(merchantInfo)
    }
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
    loadMerchants()
    loadUsers()
    registerMerchants()
    .then(function() {
        console.log("-----Registered the Merchants-----\n");
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


}

