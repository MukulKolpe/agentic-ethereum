// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {DAOToken} from "./DAOToken.sol";

contract CreateDAOToken {
    mapping(uint256 => address[]) public userIdtoDeployedTokens;

    function deployToken(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _totalSupply,
        uint256 _userId
    ) public {
        address funcCaller = msg.sender;
        address tokenAddress = address(
            new DAOToken(_tokenName, _tokenSymbol, _totalSupply)
        );
        userIdtoDeployedTokens[_userId].push(tokenAddress);
        DAOToken daoToken = DAOToken(tokenAddress);
        daoToken.transfer(funcCaller, _totalSupply * 1000000000000000000);
    }

    function getBalance(
        address _tokenAddress,
        address _userAddress
    ) public view returns (uint256) {
        DAOToken daoToken = DAOToken(_tokenAddress);
        return daoToken.balanceOf(_userAddress);
    }

    function getTotalTokesnDeployed(
        uint256 _userId
    ) public view returns (uint256) {
        return userIdtoDeployedTokens[_userId].length;
    }
}
