// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/reactive-lib/src/interfaces/IReactive.sol";
import "../lib/reactive-lib/src/abstract-base/AbstractReactive.sol";

/// @title StrategyWatcherRSC - Reactive Smart Contract that subscribes to APY change events
/// @notice Monitors MockLendingAdapter APY changes and triggers rebalancing when thresholds are met
/// @dev Extends AbstractReactive to subscribe to APYUpdated events
contract StrategyWatcherRSC is IReactive, AbstractReactive {
    
    // Events
    event APYThresholdMet(
        address indexed adapter,
        uint256 oldAPY,
        uint256 newAPY,
        uint256 timestamp,
        bool shouldRebalance
    );
    
    event RebalancingTriggered(
        address indexed adapter,
        uint256 currentAPY,
        uint256 timestamp
    );
    
    // Configuration
    address public immutable targetAdapter;
    address public immutable rebalancerRSC;
    uint256 public immutable chainId;
    
    // APY thresholds (in basis points)
    uint256 public constant MIN_APY_THRESHOLD = 300; // 3% - below this, consider rebalancing
    uint256 public constant MAX_APY_THRESHOLD = 1000; // 10% - above this, prioritize this adapter
    uint256 public constant REBALANCE_THRESHOLD = 200; // 2% - minimum APY difference to trigger rebalance
    
    // Event signatures
    uint256 private constant APY_UPDATED_TOPIC_0 = 0x5d2c285d7e7b18b6c9b3d06e98c47c5b0c2eefe7ac5c80c0d3ddcefe7c77bb7a;
    
    // Gas limit for callbacks
    uint64 private constant CALLBACK_GAS_LIMIT = 1000000;
    
    // State tracking
    mapping(address => uint256) public lastKnownAPY;
    uint256 public lastUpdateTime;
    
    constructor(
        address _targetAdapter,
        address _rebalancerRSC,
        uint256 _chainId
    ) payable {
        targetAdapter = _targetAdapter;
        rebalancerRSC = _rebalancerRSC;
        chainId = _chainId;
        lastUpdateTime = block.timestamp;
        
        // Subscribe to APYUpdated events from the target adapter
        if (!vm) {
            service.subscribe(
                _chainId,
                _targetAdapter,
                APY_UPDATED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
    }
    
    /// @notice React to incoming log events
    /// @param log The log record containing event data
    function react(LogRecord calldata log) external vmOnly {
        // Verify this is an APYUpdated event from our target adapter
        if (log._contract == targetAdapter && log.topic_0 == APY_UPDATED_TOPIC_0) {
            _handleAPYUpdate(log);
        }
    }
    
    /// @notice Handle APY update events
    /// @param log The log record from APYUpdated event
    function _handleAPYUpdate(LogRecord calldata log) internal {
        // Decode APYUpdated event data: (uint256 oldAPY, uint256 newAPY, uint256 timestamp)
        (uint256 oldAPY, uint256 newAPY, uint256 timestamp) = abi.decode(
            log.data,
            (uint256, uint256, uint256)
        );
        
        // Update state
        lastKnownAPY[log._contract] = newAPY;
        lastUpdateTime = timestamp;
        
        // Evaluate if rebalancing should be triggered
        bool shouldRebalance = _evaluateRebalancingNeed(oldAPY, newAPY);
        
        emit APYThresholdMet(
            log._contract,
            oldAPY,
            newAPY,
            timestamp,
            shouldRebalance
        );
        
        // Trigger rebalancing if conditions are met
        if (shouldRebalance) {
            _triggerRebalancing(log._contract, newAPY, timestamp);
        }
    }
    
    /// @notice Evaluate whether rebalancing should be triggered
    /// @param oldAPY The previous APY
    /// @param newAPY The new APY
    /// @return true if rebalancing should be triggered
    function _evaluateRebalancingNeed(uint256 oldAPY, uint256 newAPY) internal pure returns (bool) {
        // Trigger rebalancing if:
        // 1. APY dropped below minimum threshold
        // 2. APY increased significantly (above rebalance threshold)
        // 3. APY swing is substantial enough to warrant action
        
        if (newAPY < MIN_APY_THRESHOLD) {
            return true; // APY too low, need to find better opportunity
        }
        
        if (newAPY > MAX_APY_THRESHOLD && newAPY > oldAPY) {
            return true; // High APY opportunity, should prioritize
        }
        
        // Check for significant APY changes
        uint256 apyDiff = newAPY > oldAPY ? newAPY - oldAPY : oldAPY - newAPY;
        if (apyDiff >= REBALANCE_THRESHOLD) {
            return true; // Significant change warrants rebalancing
        }
        
        return false;
    }
    
    /// @notice Trigger rebalancing by calling the RebalancerRSC
    /// @param adapter The adapter address that had APY change
    /// @param currentAPY The current APY
    /// @param timestamp The timestamp of the change
    function _triggerRebalancing(
        address adapter,
        uint256 currentAPY,
        uint256 timestamp
    ) internal {
        // Prepare callback payload for RebalancerRSC
        bytes memory payload = abi.encodeWithSignature(
            "executeRebalancing(address,uint256,uint256,address)",
            address(0), // rvm_id placeholder
            adapter,
            currentAPY,
            timestamp
        );
        
        // Emit callback to trigger RebalancerRSC
        emit Callback(
            chainId,
            rebalancerRSC,
            CALLBACK_GAS_LIMIT,
            payload
        );
        
        emit RebalancingTriggered(adapter, currentAPY, timestamp);
    }
    
    /// @notice Get the last known APY for an adapter
    /// @param adapter The adapter address
    /// @return The last known APY
    function getLastKnownAPY(address adapter) external view returns (uint256) {
        return lastKnownAPY[adapter];
    }
    
    /// @notice Check if an APY change would trigger rebalancing
    /// @param oldAPY The old APY
    /// @param newAPY The new APY
    /// @return true if it would trigger rebalancing
    function wouldTriggerRebalancing(uint256 oldAPY, uint256 newAPY) external pure returns (bool) {
        return _evaluateRebalancingNeed(oldAPY, newAPY);
    }
    
    /// @notice Get rebalancing thresholds
    /// @return minThreshold The minimum APY threshold
    /// @return maxThreshold The maximum APY threshold  
    /// @return rebalanceThreshold The rebalance difference threshold
    function getThresholds() external pure returns (
        uint256 minThreshold,
        uint256 maxThreshold,
        uint256 rebalanceThreshold
    ) {
        return (MIN_APY_THRESHOLD, MAX_APY_THRESHOLD, REBALANCE_THRESHOLD);
    }
    
    /// @notice Emergency function to manually trigger rebalancing
    /// @param adapter The adapter to trigger rebalancing for
    /// @param currentAPY The current APY to report
    function manualTriggerRebalancing(
        address adapter,
        uint256 currentAPY
    ) external rnOnly {
        require(adapter != address(0), "Invalid adapter");
        _triggerRebalancing(adapter, currentAPY, block.timestamp);
    }
}