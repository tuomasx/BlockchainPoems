// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract poemContract {
    /* Purpose of this smart contract is to track poems based on address. Poem is identified as string
    */

    // structure of contract
    struct poem {
        uint authorId;
        string poemAuthor;
        string poemName;
        string poemContent;
    }

    mapping (address => poem[]) myPoemList;
    mapping (address => uint) counter;

    constructor() public {
        addPoem("Tekija", "nimi", "liirum laarum");
    }

    function getPoemName(uint number) public view returns (string memory) {
        return myPoemList[msg.sender][number].poemName;
    }

    function getMyPoemCount() public view returns (uint) {
        return counter[msg.sender];
    }

    function poemContentByName(string _poemName) public view returns (string memory) {
        for (uint i = 0; i < myPoemList[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(_poemName)) == keccak256(abi.encodePacked(myPoemList[msg.sender][i].poemName))) {
                return myPoemList[msg.sender][i].poemContent;
            }
        }
        return ("No such poem in list");
    }

    function checkPoemsNames(string memory _poemName) private view returns (bool) {
        for (uint i = 0; i < myPoemList[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(_poemName)) == keccak256(abi.encodePacked(myPoemList[msg.sender][i].poemName))) {
                return false;
            }
        }
        return true;
    }

    function addPoem(string memory _poemAuthor, string memory _poemName, string memory _poemcontent) public {
        if(checkPoemsNames(_poemName)) {
            counter[msg.sender]++;
            myPoemList[msg.sender].push(poem(
                counter[msg.sender],
                _poemAuthor,
                _poemName,
                _poemcontent

            ));
        }
    }

    function poemById(string memory _poemName) private pure returns (string memory){
        return (_poemName);
    }

}