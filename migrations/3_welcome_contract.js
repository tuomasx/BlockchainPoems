const WelcomeContract = artifacts.require("WelcomeContract");

module.exports = function (deployer) {
  deployer.deploy(WelcomeContract);
};
