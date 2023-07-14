//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract InstituteRegistry {
    struct Institute {
        string name;
        string email;
        address ins_address;
        string link;
        string acronym;
    }

    mapping(address => Institute) public institutes;
    address[] public instituteAddresses;

    function registerInstitute(
        string memory _name,
        string memory _email,
        address  _address,
        string memory _link,
        string memory _acronym
    ) public {
        require(
            bytes(institutes[msg.sender].name).length == 0,
            "Institute already registered"
        );

        Institute memory newInstitute = Institute({
            name: _name,
            email: _email,
            ins_address: _address,
            link: _link,
            acronym: _acronym
        });

        institutes[msg.sender] = newInstitute;
        instituteAddresses.push(msg.sender);
    }

    function getInstitute(address _address) public view returns (string memory,string memory,address,string memory,string memory) {
        Institute memory institute = institutes[_address];
            return (
                institute.name,
                institute.email,
                institute.ins_address,
                institute.link,
                institute.acronym
            );
        }

    function getInstituteCount() public view returns (uint256) {
        return instituteAddresses.length;
    }

     function isRegisteredInstitute(address _address) public view returns (bool) {
        for (uint256 i = 0; i < instituteAddresses.length; i++) {
            if (instituteAddresses[i] == _address) {
                return true;
            }
        }
        return false;
    }
}



