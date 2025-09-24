// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FluxToken - Simple ERC20 token for FluxVault demo
/// @notice A test token that can be minted for demonstration purposes
contract FluxToken is ERC20, Ownable {
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    
    /// @notice Mint tokens to an address (only owner)
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /// @notice Faucet function for demo - anyone can request tokens
    /// @param amount The amount to request (max 1000 tokens)
    function faucet(uint256 amount) external {
        require(amount <= 1000 * 10**decimals(), "Max 1000 tokens per request");
        _mint(msg.sender, amount);
    }
}