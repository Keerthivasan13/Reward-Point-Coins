// Import the necessary libraries to access the Ethereum network
let fs = require('fs');
let Web3 = require('web3');

// Create an instance of the Web3 API to access the network
let web3 = new Web3();

// Connect the Web3 to Ganache local network
web3.setProvider(new web3.providers.HttpProvider('HTTP://127.0.0.1:7475'));

// Intialize the contract address for the Smart Contract RewardContract.sol
let contractAddress = "0xaFF52eC40f621050c6a994a8A97Deb9488096927";

// Read the compiled artifacts necessary to access the contract
let jsonStr = fs.readFileSync('build/contracts/RewardContract.json', 'utf8');
let abi = JSON.parse(jsonStr).abi;

//Initialize the variables to be used in the program
const maxMerchants = 5;
const maxUsers = 5;
let addresses = ["0x9E3179Bdd419c96c8e5800dD0E887b138D31502D", "0xCc33EdA7eC7c5193599c5aC55A1b5E629b0dA115", "0x30312F2F88ca51Acc73A70415F55c3e0b52C1b51", "0x27CC654c933439BB426E5d995e025Fb79Ae401fc", "0xD42A2a5432FC5Aa074107c1273C61bD4e8033241", "0xec9014C285DDe56D41AC40595c6D143846Ba89DD", "0xb8cd50Ecd6d41D6d65Bc73271e3B5b1b9Aa1E3AE", "0xb7f3B0e3ef6D854950cECbFA55825D2806B63417", "0x39762F198528d48708bA1C55DDbB7426A327b49A", "0x5e4eDB35105B8D77c03f1dF544852836Bd442fc4"]
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
    await useRewardPointsAtMerchant(1, 0, rewardPoint)
}

async function registerUser(address) {
    await reward.methods.registerUser().send({from: address})
}

async function registerMerchant(address) {
    await reward.methods.registerMerchant().send({from: address})
}

async function earnRewardPointsForUser(userIndex, rewardPoint) {
    await reward.methods.earnPoints(userInfoList[userIndex].address, rewardPoint.scope, rewardPoint.usePermissions, rewardPoint.amount)
}

async function useRewardPointsAtMerchant(userIndex, merchantIndex, rewardPoint) {
    await reward.methods.usePoints(merchantInfoList[merchantIndex].address, rewardPoint.scope, rewardPoint.usePermissions, rewardPoint.amount).send({from: userInfoList[userIndex].address})
}

function loadMerchants() {
    // Lily to populate Merchants from API
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
    loadMerchants()
    loadUsers()
    registerMerchants()
    .then(function() {
        console.log("Registered the Merchants");
    })
    .catch(function(error) {
        console.log(error);
    })

    registerUsers()
    .then(function() {
        console.log("Registered the Users");
    })
    .catch(function(error) {
        console.log(error);
    })

    earnAllRewardPoints()
    .then(function() {
        console.log("Gave Reward Points to the Users");
    })
    .catch(function(error) {
        console.log(error);
    })

    useAllRewardPoints()
    .then(function() {
        console.log("Used Reward Points at the Merchants");
    })
    .catch(function(error) {
        console.log(error);
    })
}

