// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4; 
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MeritToken1155 is ERC1155, Ownable {
    mapping(uint256 => uint256) public totalSupply;


    mapping(address => bool) mintAuthDic;
    modifier onlyAuthMint() {
        require(mintAuthDic[_msgSender()], "Ownable: caller is not the owner");
        _;
    }
    //tokenUri="https://example.com/api/token/{id}.json"
    constructor(string memory tokenUri) ERC1155(tokenUri) {
    }
    // 增加权限
    function addMintAuth(address to,bool bAdd) public onlyOwner{
        if(bAdd){
            mintAuthDic[to] = true;
        }
        else{
            delete mintAuthDic[to];
        }
    }
    function mint (
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyAuthMint() { 
        // mint(msg.sender, 1, 100, "MeritToken");
        _mint(account, id, amount, data);
        totalSupply[id] += amount;
    }

    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner { 
        require( totalSupply[id] >= amount,'not enough to burn!');
        _burn(account, id, amount);
        totalSupply[id] -= amount;
    }
}
contract MeritToken is ERC20, Ownable {
    mapping(uint256 => uint256) public totalSupply;


    mapping(address => bool) mintAuthDic;
    modifier onlyAuthMint() {
        require(mintAuthDic[_msgSender()], "Ownable: caller is not the owner");
        _;
    }
    //tokenUri="https://example.com/api/token/{id}.json"
    constructor(string memory name_, string memory symbol_) ERC20( name_, symbol_) {
    }
    // 增加权限
    function addMintAuth(address to,bool bAdd) public onlyOwner{
        if(bAdd){
            mintAuthDic[to] = true;
        }
        else{
            delete mintAuthDic[to];
        }
    }
    function mint (
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyAuthMint() { 
        // mint(msg.sender, 1, 100, "MeritToken");
        _mint(account, amount);
        totalSupply[id] += amount;
    }

    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner { 
        require( totalSupply[id] >= amount,'not enough to burn!');
        _burn(account, amount);
        totalSupply[id] -= amount;
    }
}

contract MorphingBlock is Ownable{
    struct ShareInfo { 
        address holder;  // 所属持有者
        uint256 shareAmount;
    }
    struct txInfo { 
        bool bValid;
        bool bFinished;
        uint256 txID;  // 交易id
        uint256 amount;
        uint256 txTime;
    }
    struct DeviceInfo {
        address owner;  // 所属商家
        ShareInfo [] shareList;  // 产权共有列表
        uint256 tokenBalance; // 里面存款
        uint256 regTime;  // 注册时间
        bool bValid;   // 是否有效
    }
    DeviceInfo cachedDeviceInfo;
    struct UserInfo {
        address owner;
        uint256 tokenBalance;
        uint256 lastTransferTime;
    }
    mapping(string => DeviceInfo) public deviceDic;
    mapping(address => UserInfo) public userTokenDic;
    mapping(uint256 => txInfo) public txInfoDic;
    
    string [] deviceList;
    address [] userList;
    uint256 [] txIDList;
    uint256 txCounter = 0;

    // 功德成功
    event onRewardMeritSuccess(address userAddr,uint256 tokenType,uint256 amount);
    // 投币过来
    event onInsertCoin(string macAddr,uint256 amount,uint256 txID);

    uint256 public constant TOKEN_AMOUNT = 10;
    uint256 public constant TRANSFER_INTERVAL = 5 seconds; 
    uint256 public constant MAX_SHARE_AMOUNT = 10000000; //  总计股份

    MeritToken morphingMeritInst ;


    function setMeritSlave(address intMeritTokenInst) public {
        morphingMeritInst= MeritToken(intMeritTokenInst);
    }
    // 注册设备
    function registerDevice(string memory macAddress, uint256 initialTokens,address to) public onlyOwner {   
        deviceDic[macAddress] = cachedDeviceInfo;
        deviceDic[macAddress].bValid = true;
        deviceDic[macAddress].owner  = to;
        deviceDic[macAddress].tokenBalance = initialTokens;
        deviceDic[macAddress].regTime = block.timestamp;
         deviceList.push(macAddress);
    }
    // 给一个设备增加持有者
    function addDeviceHolder(string memory macAddress, uint256 inShareAmount,address to) public onlyOwner {  
        require(deviceDic[macAddress].bValid,'device is not valid'); 
        deviceDic[macAddress].shareList.push(ShareInfo(to,inShareAmount)); 
    }
    // 给一个设备增加持有者
    function insertCoin(string memory macAddress,uint256 inAmount) public onlyOwner {  
        require(deviceDic[macAddress].bValid,'device is not valid'); 
        for(uint256 idx = 0; idx < deviceDic[macAddress].shareList.length; ++idx){
            // TODO: 根据股权进行分润
            //ShareInfo memory tmpShareInfo = deviceDic[macAddress].shareList[idx];
        } 
        /*
          struct txInfo { 
        bool bValid;
        uint256 bFinished;
        uint256 txID;  // 交易id
        uint256 amount;
        uint256 txTime;
    }
        */
        txInfoDic[txCounter] = txInfo(true,false,txCounter,inAmount,block.timestamp);
        emit onInsertCoin(macAddress,inAmount,txCounter);
        txCounter++;
    }
    // 功德回报
    function rewardMerit(string memory macAddress,uint256 inAmount,address to,uint256 tokenType,uint256 txID) public onlyOwner {  
        require(to != address(0),'address is not valid'); 
        require(deviceDic[macAddress].bValid,'device is not valid'); 
        require(txInfoDic[txID].bValid,'txID is not valid'); 
        require(!txInfoDic[txID].bFinished,'reward has finished'); 

        if(userTokenDic[to].owner == address(0)){
            userTokenDic[to] = UserInfo(to, 0,0);
            userList.push(to);
        }
        userTokenDic[to].tokenBalance += inAmount; 
        userTokenDic[to].lastTransferTime = block.timestamp;

        morphingMeritInst.mint(to, tokenType, inAmount, '');
        txInfoDic[txID].bFinished = true;
        emit onRewardMeritSuccess(to, tokenType, inAmount);
    } 

    function getDevice(string memory macAddress) public view returns (DeviceInfo memory) {
        return deviceDic[macAddress];
    }
     
    function getUser(address userAddr) public view returns (UserInfo memory) {
        return userTokenDic[userAddr];
    }
           // each can get 10 items
    function getDeviceList(uint256 startIdx) public view returns (uint256,DeviceInfo[]  memory) {
        //require(startIdx < whiteUserList.length,'invalid index');
         
        uint256 endIdx = startIdx+10; 
        endIdx = endIdx > deviceList.length ?  deviceList.length : endIdx;

        require(startIdx <= endIdx,'invalid index');
        DeviceInfo[] memory tempList = new DeviceInfo[](endIdx-startIdx);

        for(uint256 idx = startIdx;idx < endIdx; ++idx){ 
            tempList[idx-startIdx] = deviceDic[deviceList[idx]];
        } 
        return (deviceList.length,tempList);
    }
    // each can get 10 items
    function getUserList(uint256 startIdx) public view returns (uint256,UserInfo[]  memory) {
        
        uint256 endIdx = startIdx+10; 
        endIdx = endIdx > userList.length ?  userList.length : endIdx;

        require(startIdx <= endIdx,'invalid index');
        UserInfo[] memory tempList = new UserInfo[](endIdx-startIdx);

        for(uint256 idx = startIdx;idx < endIdx; ++idx){ 
            tempList[idx-startIdx] = userTokenDic[userList[idx]];
        } 
        return (userList.length,tempList);
    }
}
