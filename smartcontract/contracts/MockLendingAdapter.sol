// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title MockLendingAdapter - Simple adapter contract with adjustable APY for demo
/// @notice A mock lending protocol adapter that simulates yield farming with configurable APY
/// @dev Used for demonstrating reactive rebalancing based on APY changes
contract MockLendingAdapter is Ownable, ReentrancyGuard {
    IERC20 public immutable asset;
    
    // APY in basis points (100 = 1%)
    uint256 public currentAPY;
    
    // User balances
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastUpdateTime;
    
    // Total deposited
    uint256 public totalDeposits;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event APYUpdated(uint256 oldAPY, uint256 newAPY, uint256 timestamp);
    event YieldAccrued(address indexed user, uint256 amount);
    
    constructor(
        address _asset,
        uint256 _initialAPY
    ) Ownable(msg.sender) {
        asset = IERC20(_asset);
        currentAPY = _initialAPY;
    }
    
    /// @notice Deposit assets to start earning yield
    /// @param amount The amount to deposit
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot deposit zero");
        
        // Accrue any pending yield before updating balance
        _accrueYield(msg.sender);
        
        // Transfer assets from user
        asset.transferFrom(msg.sender, address(this), amount);
        
        // Update user balance and total deposits
        balances[msg.sender] += amount;
        totalDeposits += amount;
        lastUpdateTime[msg.sender] = block.timestamp;
        
        emit Deposit(msg.sender, amount);
    }
    
    /// @notice Withdraw assets plus any accrued yield
    /// @param amount The amount to withdraw (excluding yield)
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Accrue yield before withdrawal
        _accrueYield(msg.sender);
        
        // Calculate total withdrawal (principal + yield)
        uint256 totalWithdraw = amount + _calculatePendingYield(msg.sender);
        
        // Update balances
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        lastUpdateTime[msg.sender] = block.timestamp;
        
        // Transfer assets back to user
        asset.transfer(msg.sender, totalWithdraw);
        
        emit Withdraw(msg.sender, totalWithdraw);
    }
    
    /// @notice Get user's balance including accrued yield
    /// @param user The user address
    /// @return The total balance including yield
    function balanceOf(address user) external view returns (uint256) {
        return balances[user] + _calculatePendingYield(user);
    }
    
    /// @notice Get user's principal balance (excluding yield)
    /// @param user The user address
    /// @return The principal balance
    function principalOf(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /// @notice Calculate pending yield for a user
    /// @param user The user address
    /// @return The pending yield amount
    function pendingYield(address user) external view returns (uint256) {
        return _calculatePendingYield(user);
    }
    
    /// @notice Get current APY
    /// @return The current APY in basis points
    function getCurrentAPY() external view returns (uint256) {
        return currentAPY;
    }
    
    /// @notice Update the APY (only owner)
    /// @param newAPY The new APY in basis points
    function updateAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 10000, "APY cannot exceed 100%"); // Max 100% APY
        
        uint256 oldAPY = currentAPY;
        currentAPY = newAPY;
        
        emit APYUpdated(oldAPY, newAPY, block.timestamp);
    }
    
    /// @notice Batch update APY and accrue yield for multiple users (gas efficient)
    /// @param newAPY The new APY in basis points
    /// @param users Array of user addresses to update
    function batchUpdateAPY(uint256 newAPY, address[] calldata users) external onlyOwner {
        require(newAPY <= 10000, "APY cannot exceed 100%");
        
        // Accrue yield for specified users before changing APY
        for (uint256 i = 0; i < users.length; i++) {
            if (balances[users[i]] > 0) {
                _accrueYield(users[i]);
            }
        }
        
        uint256 oldAPY = currentAPY;
        currentAPY = newAPY;
        
        emit APYUpdated(oldAPY, newAPY, block.timestamp);
    }
    
    /// @notice Emergency function to pause all operations by setting APY to 0
    function emergencyPause() external onlyOwner {
        currentAPY = 0;
        emit APYUpdated(currentAPY, 0, block.timestamp);
    }
    
    /// @notice Accrue yield for a user
    /// @param user The user address
    function _accrueYield(address user) internal {
        uint256 pendingYieldAmount = _calculatePendingYield(user);
        if (pendingYieldAmount > 0) {
            balances[user] += pendingYieldAmount;
            lastUpdateTime[user] = block.timestamp;
            emit YieldAccrued(user, pendingYieldAmount);
        } else if (lastUpdateTime[user] == 0 && balances[user] > 0) {
            // First time depositor
            lastUpdateTime[user] = block.timestamp;
        }
    }
    
    /// @notice Calculate pending yield for a user
    /// @param user The user address
    /// @return The pending yield amount
    function _calculatePendingYield(address user) internal view returns (uint256) {
        if (balances[user] == 0 || lastUpdateTime[user] == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - lastUpdateTime[user];
        if (timeElapsed == 0) {
            return 0;
        }
        
        // Calculate annual yield: principal * APY / 10000
        // Then convert to time elapsed: annualYield * timeElapsed / 365 days
        uint256 annualYield = (balances[user] * currentAPY) / 10000;
        uint256 pendingYieldAmount = (annualYield * timeElapsed) / 365 days;
        
        return pendingYieldAmount;
    }
    
    /// @notice Get total value locked in the adapter
    /// @return The total value locked
    function totalValueLocked() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }
    
    /// @notice Simulate protocol conditions by manually setting APY to specific values
    /// @param scenario The scenario number (1: low yield, 2: medium yield, 3: high yield)
    function simulateMarketConditions(uint256 scenario) external onlyOwner {
        uint256 newAPY;
        
        if (scenario == 1) {
            newAPY = 200; // 2% APY - Low yield scenario
        } else if (scenario == 2) {
            newAPY = 500; // 5% APY - Medium yield scenario  
        } else if (scenario == 3) {
            newAPY = 1200; // 12% APY - High yield scenario
        } else {
            revert("Invalid scenario");
        }
        
        uint256 oldAPY = currentAPY;
        currentAPY = newAPY;
        
        emit APYUpdated(oldAPY, newAPY, block.timestamp);
    }
}