// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {

    mapping(address => uint256)
        public balances;

    uint256 public totalStaked;

    event Stake(
        address indexed user,
        uint256 amount
    );

    event Unstake(
        address indexed user,
        uint256 amount
    );

    constructor()
        Ownable(msg.sender)
    {}

    function stake()
        external
        payable
    {
        require(
            msg.value > 0,
            "Zero amount"
        );

        balances[msg.sender]
            += msg.value;

        totalStaked
            += msg.value;

        emit Stake(
            msg.sender,
            msg.value
        );
    }

    function unstake(
        uint256 amount
    )
        external
    {
        require(
            balances[msg.sender]
            >= amount,
            "Insufficient balance"
        );

        balances[msg.sender]
            -= amount;

        totalStaked
            -= amount;

        payable(msg.sender)
            .transfer(amount);

        emit Unstake(
            msg.sender,
            amount
        );
    }
}
