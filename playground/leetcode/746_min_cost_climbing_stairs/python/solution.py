# Problem: 746. Min Cost Climbing Stairs
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        """
        Basic recursion with memo because the without memo it will exceed time limit
        f(idx) represents the min cost for steps idx onward
        f(idx) = min (
            cost[idx] + f(idx + 1),
            cost[idx] + f(idx + 2)
        )
        base cases:
            if idx >= len(cost): return 0
        """
        memo = {}
        def recur(idx):
            if idx >= len(cost):
                return 0
            if idx in memo:
                return memo[idx]
            memo[idx] = min (
                cost[idx] + recur(idx + 1),
                cost[idx] + recur(idx + 2)
            )
            return memo[idx]
        return min(recur(0), recur(1))
