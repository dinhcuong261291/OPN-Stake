// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OPN is ERC20, Ownable {

    constructor()
        ERC20(
            "OPN Token",
            "OPN"
        )
        Ownable(msg.sender)
    {
        _mint(
            msg.sender,
            1_000_000_000 ether
        );
    }

    function mint(
        address to,
        uint256 amount
    )
        external
        onlyOwner
    {
        _mint(
            to,
            amount
        );
    }

    function burn(
        uint256 amount
    )
        external
    {
        _burn(
            msg.sender,
            amount
        );
    }
}
