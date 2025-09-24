// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/reactive-lib/src/abstract-base/AbstractCallback.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RebalancerRSC - Executes migrations when callbacks fire
/// @notice Handles vault rebalancing triggered by StrategyWatcherRSC
/// @dev Receives callbacks and executes vault migrations to optimal strategies
contract RebalancerRSC is AbstractCallback, Ownable {
    
    // Events
    event RebalancingExecuted(
        address indexed vault,
        address indexed fromAdapter,
        address indexed toAdapter,
        uint256 triggerAPY,
        uint256 timestamp,
        bytes32 txHash
    );
    
    event VaultRegistered(address indexed vault, bool enabled);
    event AdapterRegistered(address indexed adapter, uint256 expectedAPY, bool enabled);
    
    event RebalancingFailed(
        address indexed vault,
        address indexed adapter,
        string reason,
        uint256 timestamp
    );
    
    // Configuration
    mapping(address => bool) public authorizedVaults;
    mapping(address => AdapterInfo) public adapterRegistry;
    mapping(address => uint256) public lastRebalanceTime;
    
    struct AdapterInfo {
        bool enabled;
        uint256 expectedAPY;
        uint256 lastUpdated;
        string name;
    }
    
    // Rebalancing constraints
    uint256 public constant MIN_REBALANCE_INTERVAL = 1 hours; // Minimum time between rebalances
    uint256 public constant MAX_GAS_PRICE = 50 gwei; // Maximum gas price for rebalancing
    
    // Strategy scoring
    uint256 public constant APY_WEIGHT = 70; // 70% weight on APY
    uint256 public constant STABILITY_WEIGHT = 20; // 20% weight on stability
    uint256 public constant LIQUIDITY_WEIGHT = 10; // 10% weight on liquidity
    
    constructor(address _callbackSender) 
        AbstractCallback(_callbackSender) 
        Ownable(msg.sender) 
    {}
    
    /// @notice Execute rebalancing triggered by StrategyWatcherRSC
    /// @param rvm_id The reactive VM ID (for authorization)
    /// @param triggerAdapter The adapter that triggered the rebalancing
    /// @param triggerAPY The APY that triggered the rebalancing
    /// @param timestamp The timestamp of the trigger event
    function executeRebalancing(
        address rvm_id,
        address triggerAdapter,
        uint256 triggerAPY,
        uint256 timestamp
    ) external authorizedSenderOnly rvmIdOnly(rvm_id) {
        // Find the best vault to rebalance based on the trigger
        address targetVault = _findOptimalVaultForRebalancing(triggerAdapter);
        
        if (targetVault == address(0)) {
            emit RebalancingFailed(
                address(0),
                triggerAdapter,
                "No suitable vault found",
                timestamp
            );
            return;
        }
        
        // Check rebalancing constraints
        if (!_canRebalance(targetVault)) {
            emit RebalancingFailed(
                targetVault,
                triggerAdapter,
                "Rebalancing constraints not met",
                timestamp
            );
            return;
        }
        
        // Find the optimal adapter to migrate to
        address optimalAdapter = _findOptimalAdapter(triggerAdapter, triggerAPY);
        
        if (optimalAdapter == address(0)) {
            emit RebalancingFailed(
                targetVault,
                triggerAdapter,
                "No optimal adapter found",
                timestamp
            );
            return;
        }
        
        // Execute the migration
        bool success = _executeMigration(targetVault, triggerAdapter, optimalAdapter);
        
        if (success) {
            lastRebalanceTime[targetVault] = block.timestamp;
            
            emit RebalancingExecuted(
                targetVault,
                triggerAdapter,
                optimalAdapter,
                triggerAPY,
                timestamp,
                blockhash(block.number - 1)
            );
        } else {
            emit RebalancingFailed(
                targetVault,
                optimalAdapter,
                "Migration execution failed",
                timestamp
            );
        }
    }
    
    /// @notice Register a vault for rebalancing
    /// @param vault The vault contract address
    /// @param enabled Whether the vault is enabled for rebalancing
    function registerVault(address vault, bool enabled) external onlyOwner {
        require(vault != address(0), "Invalid vault address");
        authorizedVaults[vault] = enabled;
        
        emit VaultRegistered(vault, enabled);
    }
    
    /// @notice Register an adapter with its expected performance metrics
    /// @param adapter The adapter contract address
    /// @param expectedAPY The expected APY in basis points
    /// @param enabled Whether the adapter is enabled
    /// @param name The adapter name for identification
    function registerAdapter(
        address adapter,
        uint256 expectedAPY,
        bool enabled,
        string calldata name
    ) external onlyOwner {
        require(adapter != address(0), "Invalid adapter address");
        require(expectedAPY <= 10000, "APY cannot exceed 100%");
        
        adapterRegistry[adapter] = AdapterInfo({
            enabled: enabled,
            expectedAPY: expectedAPY,
            lastUpdated: block.timestamp,
            name: name
        });
        
        emit AdapterRegistered(adapter, expectedAPY, enabled);
    }
    
    /// @notice Find the optimal vault for rebalancing based on trigger
    /// @param triggerAdapter The adapter that triggered rebalancing
    /// @return The optimal vault address or zero if none found
    function _findOptimalVaultForRebalancing(address triggerAdapter) internal view returns (address) {
        // For demo purposes, we'll return the first authorized vault
        // In production, this would implement sophisticated vault selection logic
        
        // This is a simplified implementation - would need vault enumeration
        // For the demo, we assume the vault is registered and return a mock address
        // In reality, you'd iterate through registered vaults and find the one using triggerAdapter
        
        return triggerAdapter; // Placeholder - would be replaced with actual vault finding logic
    }
    
    /// @notice Check if a vault can be rebalanced based on constraints
    /// @param vault The vault address
    /// @return true if rebalancing is allowed
    function _canRebalance(address vault) internal view returns (bool) {
        // Check time constraints
        if (block.timestamp - lastRebalanceTime[vault] < MIN_REBALANCE_INTERVAL) {
            return false;
        }
        
        // Check gas price constraints
        if (tx.gasprice > MAX_GAS_PRICE) {
            return false;
        }
        
        // Check vault authorization
        if (!authorizedVaults[vault]) {
            return false;
        }
        
        return true;
    }
    
    /// @notice Find the optimal adapter based on current conditions
    /// @param currentAdapter The current adapter
    /// @param currentAPY The current APY that triggered rebalancing
    /// @return The optimal adapter address
    function _findOptimalAdapter(
        address currentAdapter,
        uint256 currentAPY
    ) internal view returns (address) {
        address bestAdapter = address(0);
        uint256 bestScore = 0;
        
        // For demo purposes, we'll implement a simplified selection
        // In production, this would evaluate all registered adapters
        
        // If current APY is below threshold, find any adapter with higher expected APY
        for (uint256 i = 0; i < 5; i++) { // Simplified iteration
            address candidateAdapter = address(uint160(uint256(keccak256(abi.encodePacked(currentAdapter, i)))));
            AdapterInfo memory info = adapterRegistry[candidateAdapter];
            
            if (!info.enabled || candidateAdapter == currentAdapter) {
                continue;
            }
            
            uint256 score = _calculateAdapterScore(info.expectedAPY, block.timestamp - info.lastUpdated);
            
            if (score > bestScore) {
                bestScore = score;
                bestAdapter = candidateAdapter;
            }
        }
        
        return bestAdapter;
    }
    
    /// @notice Calculate adapter score based on multiple factors
    /// @param expectedAPY The expected APY
    /// @param timeSinceUpdate Time since last update
    /// @return The calculated score
    function _calculateAdapterScore(
        uint256 expectedAPY,
        uint256 timeSinceUpdate
    ) internal pure returns (uint256) {
        // Higher APY is better
        uint256 apyScore = (expectedAPY * APY_WEIGHT) / 100;
        
        // More recent updates are better (stability factor)
        uint256 stabilityScore = timeSinceUpdate > 1 days ? 
            (STABILITY_WEIGHT * 50) / 100 : // Penalize old data
            STABILITY_WEIGHT;
        
        // Simplified liquidity score (constant for demo)
        uint256 liquidityScore = LIQUIDITY_WEIGHT;
        
        return apyScore + stabilityScore + liquidityScore;
    }
    
    /// @notice Execute the actual migration between adapters
    /// @param vault The vault to migrate
    /// @param fromAdapter The source adapter
    /// @param toAdapter The destination adapter
    /// @return true if migration was successful
    function _executeMigration(
        address vault,
        address fromAdapter,
        address toAdapter
    ) internal returns (bool) {
        try IOriginVault(vault).executeMigration() {
            return true;
        } catch {
            return false;
        }
    }
    
    /// @notice Get adapter information
    /// @param adapter The adapter address
    /// @return info The adapter information
    function getAdapterInfo(address adapter) external view returns (AdapterInfo memory info) {
        return adapterRegistry[adapter];
    }
    
    /// @notice Check if a vault is authorized for rebalancing
    /// @param vault The vault address
    /// @return true if authorized
    function isVaultAuthorized(address vault) external view returns (bool) {
        return authorizedVaults[vault];
    }
    
    /// @notice Get the last rebalance time for a vault
    /// @param vault The vault address
    /// @return The timestamp of last rebalance
    function getLastRebalanceTime(address vault) external view returns (uint256) {
        return lastRebalanceTime[vault];
    }
    
    /// @notice Emergency function to force rebalancing (owner only)
    /// @param vault The vault to rebalance
    /// @param toAdapter The target adapter
    function emergencyRebalance(address vault, address toAdapter) external onlyOwner {
        require(authorizedVaults[vault], "Vault not authorized");
        require(adapterRegistry[toAdapter].enabled, "Adapter not enabled");
        
        bool success = _executeMigration(vault, address(0), toAdapter);
        require(success, "Emergency rebalancing failed");
        
        lastRebalanceTime[vault] = block.timestamp;
        
        emit RebalancingExecuted(
            vault,
            address(0),
            toAdapter,
            0,
            block.timestamp,
            blockhash(block.number - 1)
        );
    }
}

/// @dev Interface for OriginVault interaction
interface IOriginVault {
    function executeMigration() external;
    function currentAdapter() external view returns (address);
    function authorizedAdapters(address) external view returns (bool);
}