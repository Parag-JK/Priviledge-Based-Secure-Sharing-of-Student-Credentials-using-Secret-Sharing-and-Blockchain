const register = artifacts.require("InstituteRegistry")


module.exports = function(deployer) {
    deployer.deploy(register)
}