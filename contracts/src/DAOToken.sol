// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract DAOToken is ERC20, ERC20Burnable, ERC20Permit {
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _totalSupply
    ) ERC20(_tokenName, _tokenSymbol) ERC20Permit("DAOToken") {
        _mint(msg.sender, _totalSupply * 10 ** decimals());
    }
}
