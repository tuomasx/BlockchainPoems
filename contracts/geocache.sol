// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract geoCacheContract {
    
    /*
    The purpose of this smart is to track found geocaches based on user addresses.
    Here the cache is represented by an identifier (any string) and a name (word "cache" after id).
    On a later version the cache could be replaced with an NFT, e.g. in a way that first finder owns the NFT but others can still find it. 
    This version works as a showcase of the core functionality.
    */

    //the data structure for the items stored in blockchain
    struct geoCacheFound {
        uint foundId;       //iterates 1, 2, 3, ... for each person
        string cacheId;     //unique identifier that the user will give as an input (e.g. something from real world)
        string name;        //name the name for the geocache
        uint foundTime;     //timestamp
    }

    //mappings for user data. 
    mapping (address => geoCacheFound[]) myCacheList;   //mapping that locates the array of structs based on user's address. 
    mapping (address => uint) counter;  //mapping that connects an uint value to an address. This works as a counter of items. 

    constructor() public
    {
        addGeoCache("holy grail");
    }

    //get methods for data
    function getName(uint number) public view returns (string memory) {
        return myCacheList[msg.sender][number].name;
    }
    function getSightingTime(uint number) public view returns (uint) {
        return myCacheList[msg.sender][number].foundTime;
    }
    function getMyTotal() public view returns (uint) {
        return counter[msg.sender];
    }
    
    //compares the hash values of a gived id and the ids in user's cachelist to prevent finding same cache
    function checkFindable(string memory _cacheId) private view returns (bool) {
        for (uint i = 0; i < myCacheList[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(_cacheId)) == keccak256(abi.encodePacked(myCacheList[msg.sender][i].cacheId))) {
                return false;
            }
        }
        return true;
    }

    //function for storing found geocaches on the blockchain
    function addGeoCache(string memory _cacheId) public {
        if(checkFindable(_cacheId)) {       //check for duplicates
            counter[msg.sender]++;          //+1 to counter
            myCacheList[msg.sender].push(geoCacheFound( //add the values as dictated by the geoCacheFound struct
                counter[msg.sender],        
                _cacheId,
                nameById(_cacheId),
                block.timestamp
            ));
        }
    }
    
    //Ideally there would be some kind of generation method or way of fetching data for cache names, but now it's just cache + id
    function nameById(string memory _cacheId) private pure returns (string memory) {
        return append("Cache ", _cacheId);
    }

    //append strings
    function append(string memory first, string memory second) internal pure returns (string memory) {
        return string(abi.encodePacked(first, second));
    }
    
}