let fs = require('fs');
let Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

let contractAddress = "0xaFF52eC40f621050c6a994a8A97Deb9488096927";
let fromAddress = "0x9E3179Bdd419c96c8e5800dD0E887b138D31502D";

let jsonStr = fs.readFileSync('build/contracts/RewardContract.json', 'utf8');
let abi = JSON.parse(jsonStr).abi;
address[100] = []
let reward = new web3.eth.Contract(abi, contractAddress);

loadMerchants ()

sendTransaction()
    .then(function() {
        console.log("Done");
    })
    .catch(function(error) {
        console.log(error);
    })

function loadMerchants() {
    http request = list of loadMerchants
    for (i= 0; i ){
        registerMarchnt("anasd") => address[i]
    }
}

async function registerUser() {
    await reward.methods.registerUser("0x27CC654c933439BB426E5d995e025Fb79Ae401fc")
    await reward.methods.registerUser("0xD42A2a5432FC5Aa074107c1273C61bD4e8033241")
}

async function registerMerchants() {
    await reward.methods.registerMerchants("0xCc33EdA7eC7c5193599c5aC55A1b5E629b0dA115");
    await reward.methods.registerMerchants("0x30312F2F88ca51Acc73A70415F55c3e0b52C1b51");
}

function UsePointUser("Merhcnat") {
    
}
async function sendTransaction() {
    console.log("Adding Merchants");


    await reward.methods.earnPoints("0x27CC654c933439BB426E5d995e025Fb79Ae401fc", "general", "gift", 10)
    await reward.methods.usePoints("0xD42A2a5432FC5Aa074107c1273C61bD4e8033241", "0xCc33EdA7eC7c5193599c5aC55A1b5E629b0dA115", "general", "gift", 5)
    await reward.methods.usePoints("0x27CC654c933439BB426E5d995e025Fb79Ae401fc", "0xCc33EdA7eC7c5193599c5aC55A1b5E629b0dA115", "general", "gift", 5)
    /*console.log("Adding option 'coffee'");
    await voter.methods.addOption("coffee").send({from: fromAddress});

    console.log("Adding option 'tea'");
    await voter.methods.addOption("tea").send({from: fromAddress});

    await voter.methods.startVoting().send({from: fromAddress, gas: 600000});

    console.log("Voting");
    await voter.methods['vote(uint256)'](0).send({from: fromAddress, gas: 600000});

    console.log("Getting votes");
    let votes = await voter.methods.getVotes().call({from: fromAddress});

    console.log(`Votes: ${votes}`)*/
}
