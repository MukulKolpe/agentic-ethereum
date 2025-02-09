// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {CreateDAOToken} from "../src/CreateDAOToken.sol";
import {DAOManager} from "../src/DAOManager.sol";
import {console2} from "forge-std/console2.sol";

contract DeployContracts is Script {
    uint256 public constant INITIAL_SUPPLY = 10000000 ether;
    string public constant TOKEN_NAME = "Agent Token";
    string public constant TOKEN_SYMBOL = "ATK";

    function run() external returns (DAOToken, CreateDAOToken, DAOManager) {
        vm.startBroadcast();
        DAOToken governanceToken = new DAOToken(
            TOKEN_NAME,
            TOKEN_SYMBOL,
            INITIAL_SUPPLY
        );
        CreateDAOToken createDaoToken = new CreateDAOToken();
        DAOManager daoManager = new DAOManager();
        vm.stopBroadcast();
        console2.log("Contracts deployed successfully");
        console2.log("DAO Token Contract: ", address(governanceToken));
        console2.log("Create DAO Token: ", address(createDaoToken));
        console2.log("DAO Manager: ", address(daoManager));
        return (governanceToken, createDaoToken, daoManager);
    }
}
