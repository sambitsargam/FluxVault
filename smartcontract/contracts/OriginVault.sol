// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title OriginVault - ERC-20 vault where users deposit tokens and get shares
/// @notice A vault contract that allows users to deposit tokens and receive shares representing their ownership
/// @dev Implements ERC-20 for shares with deposit/withdraw functionality
contract OriginVault is ERC20, ReentrancyGuard, Ownable {
    IERC20 public immutable asset;
    
    // Events
    event Deposit(address indexed user, uint256 assets, uint256 shares);
    event Withdraw(address indexed user, uint256 assets, uint256 shares);
    event Migrate(address indexed from, address indexed to, uint256 amount);
    event AdapterUpdated(address indexed oldAdapter, address indexed newAdapter);
    
    // Strategy management
    address public currentAdapter;
    mapping(address => bool) public authorizedAdapters;
    
    // Migration settings
    bool public migrationEnabled = false;
    address public pendingAdapter;
    
    constructor(
        address _asset,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        asset = IERC20(_asset);
    }
    
    /// @notice Deposit assets into the vault and receive shares
    /// @param assets The amount of assets to deposit
    /// @param receiver The address to receive the shares
    /// @return shares The amount of shares minted
    function deposit(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
        require(assets > 0, "Cannot deposit zero assets");
        require(receiver != address(0), "Invalid receiver");
        
        // Calculate shares to mint
        shares = convertToShares(assets);
        require(shares > 0, "Cannot mint zero shares");
        
        // Transfer assets from user
        asset.transferFrom(msg.sender, address(this), assets);
        
        // Mint shares to receiver
        _mint(receiver, shares);
        
        // If we have an active adapter, deposit the assets
        if (currentAdapter != address(0)) {
            asset.transfer(currentAdapter, assets);
        }
        
        emit Deposit(msg.sender, assets, shares);
    }
    
    /// @notice Withdraw assets from the vault by burning shares
    /// @param shares The amount of shares to burn
    /// @param receiver The address to receive the assets
    /// @param owner The owner of the shares
    /// @return assets The amount of assets withdrawn
    function redeem(uint256 shares, address receiver, address owner) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "Cannot redeem zero shares");
        require(receiver != address(0), "Invalid receiver");
        
        // Check allowance if not owner
        if (msg.sender != owner) {
            uint256 allowed = allowance(owner, msg.sender);
            require(allowed >= shares, "Insufficient allowance");
            if (allowed != type(uint256).max) {
                _approve(owner, msg.sender, allowed - shares);
            }
        }
        
        // Calculate assets to withdraw
        assets = convertToAssets(shares);
        require(assets > 0, "Cannot withdraw zero assets");
        
        // Burn shares from owner
        _burn(owner, shares);
        
        // Withdraw from adapter if needed
        if (currentAdapter != address(0) && asset.balanceOf(address(this)) < assets) {
            uint256 needed = assets - asset.balanceOf(address(this));
            // This would call the adapter's withdraw function
            // For simplicity, we assume the adapter transfers back immediately
        }
        
        // Transfer assets to receiver
        asset.transfer(receiver, assets);
        
        emit Withdraw(owner, assets, shares);
    }
    
    /// @notice Convert asset amount to shares
    /// @param assets The amount of assets
    /// @return shares The equivalent amount of shares
    function convertToShares(uint256 assets) public view returns (uint256 shares) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            return assets;
        }
        return (assets * supply) / totalAssets();
    }
    
    /// @notice Convert shares amount to assets
    /// @param shares The amount of shares
    /// @return assets The equivalent amount of assets
    function convertToAssets(uint256 shares) public view returns (uint256 assets) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            return shares;
        }
        return (shares * totalAssets()) / supply;
    }
    
    /// @notice Get total assets under management
    /// @return The total amount of assets
    function totalAssets() public view returns (uint256) {
        uint256 vaultBalance = asset.balanceOf(address(this));
        if (currentAdapter != address(0)) {
            // Add assets deployed to current adapter
            // For demo purposes, we'll get this from the adapter
            try IMockLendingAdapter(currentAdapter).balanceOf(address(this)) returns (uint256 adapterBalance) {
                return vaultBalance + adapterBalance;
            } catch {
                return vaultBalance;
            }
        }
        return vaultBalance;
    }
    
    /// @notice Authorize an adapter for strategy deployment
    /// @param adapter The adapter address to authorize
    function authorizeAdapter(address adapter) external onlyOwner {
        require(adapter != address(0), "Invalid adapter");
        authorizedAdapters[adapter] = true;
    }
    
    /// @notice Remove adapter authorization
    /// @param adapter The adapter address to remove
    function removeAdapter(address adapter) external onlyOwner {
        authorizedAdapters[adapter] = false;
        if (currentAdapter == adapter) {
            currentAdapter = address(0);
        }
    }
    
    /// @notice Set the current active adapter
    /// @param adapter The new adapter address
    function setCurrentAdapter(address adapter) external onlyOwner {
        require(authorizedAdapters[adapter], "Adapter not authorized");
        
        address oldAdapter = currentAdapter;
        currentAdapter = adapter;
        
        // Deploy available funds to new adapter
        uint256 balance = asset.balanceOf(address(this));
        if (balance > 0) {
            asset.transfer(adapter, balance);
        }
        
        emit AdapterUpdated(oldAdapter, adapter);
    }
    
    /// @notice Enable migration mode
    function enableMigration() external onlyOwner {
        migrationEnabled = true;
    }
    
    /// @notice Disable migration mode
    function disableMigration() external onlyOwner {
        migrationEnabled = false;
        pendingAdapter = address(0);
    }
    
    /// @notice Set pending adapter for migration
    /// @param adapter The new adapter to migrate to
    function setPendingAdapter(address adapter) external onlyOwner {
        require(authorizedAdapters[adapter], "Adapter not authorized");
        require(adapter != currentAdapter, "Cannot migrate to same adapter");
        pendingAdapter = adapter;
    }
    
    /// @notice Execute migration to pending adapter
    /// @dev This function is called by the RebalancerRSC
    function executeMigration() external {
        require(migrationEnabled, "Migration not enabled");
        require(pendingAdapter != address(0), "No pending adapter");
        require(msg.sender == owner() || authorizedAdapters[msg.sender], "Unauthorized migration");
        
        address oldAdapter = currentAdapter;
        address newAdapter = pendingAdapter;
        
        // Update current adapter
        currentAdapter = newAdapter;
        pendingAdapter = address(0);
        migrationEnabled = false;
        
        // Move funds from old to new adapter
        if (oldAdapter != address(0)) {
            // In a real implementation, this would call oldAdapter.withdrawAll()
            // and then deposit to newAdapter
        }
        
        emit Migrate(oldAdapter, newAdapter, totalAssets());
        emit AdapterUpdated(oldAdapter, newAdapter);
    }
    
    /// @notice Emergency withdraw all funds from adapters
    function emergencyWithdraw() external onlyOwner {
        currentAdapter = address(0);
        // In a real implementation, this would call adapter.emergencyWithdraw()
    }
}

/// @dev Simple interface for adapter interaction
interface IMockLendingAdapter {
    function balanceOf(address account) external view returns (uint256);
    function getCurrentAPY() external view returns (uint256);
}