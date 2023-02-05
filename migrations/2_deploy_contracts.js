var MathLibrary = artifacts.require("./MathLibrary.sol");

module.exports = function(deployer) {
  deployer.deploy(MathLibrary);
};
