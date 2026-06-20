// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Restaking is Ownable {

    mapping(address => uint256)
        public restakedBalance;

    uint256 public totalRestaked;

    event Restaked(
        address indexed user,
        uint256 amount
    );

    event Withdrawn(
        address indexed user,
        uint256 amount
    );

    constructor()
        Ownable(msg.sender)
    {}

    function restake()
        external
        payable
    {
        require(
            msg.value > 0,
            "Zero amount"
        );

        restakedBalance[msg.sender]
            += msg.value;

        totalRestaked
            += msg.value;

        emit Restaked(
            msg.sender,
            msg.value
        );
    }

    function withdraw(
        uint256 amount
    )
        external
    {
        require(
            amount > 0,
            "Invalid amount"
        );

        require(
            restakedBalance[msg.sender]
            >= amount,
            "Insufficient balance"
        );

        restakedBalance[msg.sender]
            -= amount;

        totalRestaked
            -= amount;

        payable(msg.sender)
            .transfer(amount);

        emit Withdrawn(
            msg.sender,
            amount
        );
    }

    function getUserBalance(
        address user
    )
        external
        view
        returns(uint256)
    {
        return restakedBalance[user];
    }

    function getTVL()
        external
        view
        returns(uint256)
    {
        return totalRestaked;
    }

    receive()
        external
        payable
    {}

    fallback()
        external
        payable
    {}
}
