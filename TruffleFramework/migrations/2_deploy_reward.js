let Reward = artifacts.require("./RewardContract.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Reward);
};
