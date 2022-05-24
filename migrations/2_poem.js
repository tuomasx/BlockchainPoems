const poemContract = artifacts.require("poemContract");

module.exports = function (deployer) {
  deployer.deploy(poemContract);
};
