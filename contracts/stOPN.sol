// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract stOPN is ERC20, Ownable {

    address public stakingContract;

    constructor()
        ERC20(
            "Staked OPN",
            "stOPN"
        )
        Ownable(msg.sender)
    {}

    modifier onlyStaking() {

        require(
            msg.sender ==
            stakingContract,
            "Not staking contract"
        );

        _;
    }

    function setStakingContract(
        address _staking
    )
        external
        onlyOwner
    {
        stakingContract =
            _staking;
    }

    function mint(
        address to,
        uint256 amount
    )
        external
        onlyStaking
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
        onlyStaking
    {
        _burn(
            from,
            amount
        );
    }
}
