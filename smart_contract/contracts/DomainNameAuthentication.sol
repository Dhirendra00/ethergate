// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DomainNameAuthentication {

    struct Domain {
        string domainName;
        address owner;
        bool exists;
    }
    

    mapping (address => Domain) public domains;
      address public contractOwner;
    mapping(string => address) public domainToAddress;

    constructor() {
        contractOwner = msg.sender;
    }

    event DomainRegistered(address indexed owner, string indexed domainName);
    event DomainUpdated(address indexed owner, string indexed domainName);

    function registerDomain(string memory domainName, bytes memory proof) public {
        require(!domains[msg.sender].exists, "Domain already registered");
        
        // Verify domain ownership using the proof
        bytes32 proofHash = keccak256(proof);
        bytes32 domainHash = keccak256(abi.encode(domainName, msg.sender));
        require(proofHash == domainHash, "Domain ownership could not be verified");
        
        domains[msg.sender] = Domain(domainName, msg.sender, true);
        emit DomainRegistered(msg.sender, domainName);
    }

    function updateDomain(string memory domainName, bytes memory proof) public {
        require(domains[msg.sender].exists, "Domain not registered");
        
        // Verify domain ownership using the proof
        bytes32 proofHash = keccak256(proof);
        bytes32 domainHash = keccak256(abi.encode(domainName, msg.sender));
        require(proofHash == domainHash, "Domain ownership could not be verified");
        
        domains[msg.sender].domainName = domainName;
        emit DomainUpdated(msg.sender, domainName);
    }

   function getDomainOwner() public view returns (address) {
    require(domains[msg.sender].exists, "Domain not registered");
    return domains[msg.sender].owner;
}

    function getDomainName(address owner) public view returns (string memory) {
        require(domains[owner].exists, "Domain not registered");
        return domains[owner].domainName;
    }
     function authenticate(string memory domainName, address domainAddress) public {
        require(msg.sender == contractOwner, "Only the contractOwner can authenticate a domain name");
        domainToAddress[domainName] = domainAddress;
    }

    function resolveDomain(string memory domainName) public view returns (address) {
        require(domainToAddress[domainName] != address(0), "Domain is not authenticated");
        return domainToAddress[domainName];
    }

}
