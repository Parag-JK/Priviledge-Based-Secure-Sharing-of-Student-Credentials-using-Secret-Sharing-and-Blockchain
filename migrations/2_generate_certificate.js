const generate = artifacts.require("CertificateGenerator")
const institute = artifacts.require("InstituteRegistry")


module.exports = function(deployer) {
    deployer.deploy(generate, institute.address)
}