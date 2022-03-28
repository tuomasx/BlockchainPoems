// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;
// A simple smart contract

contract WelcomeContract {
    string message = "Hello World";

    function getWelcome() public view returns (string memory) {
        return message;
    }

    function setWelcome(string memory _message) public {
        message = _message;
    }
}