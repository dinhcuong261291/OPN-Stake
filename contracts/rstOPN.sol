// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract rstOPN is ERC20, Ownable {

    address public restakingContract;

    constructor()
        ERC20(
            "Restaked OPN",
            "rstOPN"
        )
        Ownable(msg.sender)
    {}

    modifier onlyRestaking() {

        require(
            msg.sender ==
            restakingContract,
            "Not restaking contract"
        );

        _;
    }

    function setRestakingContract(
        address _restaking
    )
        external
        onlyOwner
    {
        restakingContract =
            _restaking;
    }

    function mint(
        address to,
        uint256 amount
    )
        external
        onlyRestaking
    {
        _mint(
            to,
            amount
        );
    }

    function burn(
        address from,
        uint256 amount
    )
        external
        onlyRestaking
    {
        _burn(
            from,
            amount
        );
    }
}
