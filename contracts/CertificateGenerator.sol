// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InstituteRegistry.sol";

contract CertificateGenerator {
    struct Certificate {
        address instituteAddress;
        string instituteName;
        string studentName;
        address studentAddress;
        string recordName;
        string description;
        bool isRevoked;
        string ipfs;
    }

    InstituteRegistry public instituteRegistry;
    bool public isReg;
    mapping(uint256 => Certificate) public certificates;
    uint256 public certificateCount;

    constructor (address _instituteRegistryAddress) {
        instituteRegistry = InstituteRegistry(_instituteRegistryAddress);
    }

    function generateCertificate(address _studentAddress, string memory _studentName, string memory _recordName, string memory _description, string memory _ipfs) public {
        require(instituteRegistry.isRegisteredInstitute(msg.sender), "Institute not registered");
        (string memory instituteName,, address instituteAddress,,) = instituteRegistry.getInstitute(msg.sender);
        bool canGenerate = true;
        for (uint i = 0; i < certificateCount; i++) {
            if (certificates[i].studentAddress == _studentAddress) {
                require(keccak256(abi.encodePacked(certificates[i].studentName)) == keccak256(abi.encodePacked(_studentName)), "Student name does not match");
                if (keccak256(abi.encodePacked(certificates[i].recordName)) == keccak256(abi.encodePacked(_recordName))) {
                    require(certificates[i].isRevoked == true, "Record already exists and is not revoked");
                }
            }
        }
        if (canGenerate) {
            Certificate memory newCertificate = Certificate({
                instituteAddress: instituteAddress,
                instituteName: instituteName,
                studentName: _studentName,
                studentAddress: _studentAddress,
                recordName: _recordName,
                description: _description,
                isRevoked: false,
                ipfs: _ipfs
            });
            certificates[certificateCount] = newCertificate;
            certificateCount++;
        }
    }

    function revokeCertificate(string memory studentName, string memory recordName) public {
        bool certificateFound = false;
        for (uint i = 0; i < certificateCount; i++) {
            if (keccak256(abi.encodePacked(certificates[i].studentName)) == keccak256(abi.encodePacked(studentName)) && keccak256(abi.encodePacked(certificates[i].recordName)) == keccak256(abi.encodePacked(recordName))) {
                require(
                    certificates[i].instituteAddress == msg.sender,
                    "Only the issuing institute can revoke the certificate"
                );
                certificates[i].isRevoked = true;
                certificateFound = true;
                break;
            }
        }
        require(certificateFound, "Certificate not found");
    }


    function getCertificatesByStudent(address _studentAddress) public view returns (Certificate[] memory) {
        require(_studentAddress != address(0), "Invalid student address");
        Certificate[] memory result = new Certificate[](certificateCount);
        uint counter = 0;
        for (uint i = 0; i < certificateCount; i++) {
            if (certificates[i].studentAddress == _studentAddress) {
                result[counter] = certificates[i];
                counter++;
            }
        }
        return result;
    }

    function getCertificate(string memory instituteName, string memory studentName, string memory recordName) public view returns (Certificate memory) {
        for (uint i = 0; i < certificateCount; i++) {
            if (
                keccak256(abi.encodePacked(toLower(certificates[i].instituteName))) == keccak256(abi.encodePacked(toLower(instituteName))) &&
                keccak256(abi.encodePacked(toLower(certificates[i].studentName))) == keccak256(abi.encodePacked(toLower(studentName))) &&
                keccak256(abi.encodePacked(toLower(certificates[i].recordName))) == keccak256(abi.encodePacked(toLower(recordName)))
            ) {
                return certificates[i];
            }
        }
        revert("Certificate not found");
    }

    function toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}

