const geoCacheContract = artifacts.require("geoCacheContract");

module.exports = function (deployer) {
  deployer.deploy(geoCacheContract);
};
