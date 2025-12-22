# Problem: 746. Min Cost Climbing Stairs
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Bottom up DP

from typing import List, Optional

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        """
        From the recursion (solution.py), f(idx) depends on f(idx + 1) and f(idx + 2)
        So we calculate from the last 2 and move up
        """
        def dp_bottom_up():
            n = len(cost)
            next1 = 0
            next2 = 0
            for idx in range(n - 1, -1, -1):
                curr = min(cost[idx] + next1, cost[idx] + next2)
                next2 = next1
                next1 = curr
            return min(
                next1, 
                next2
            )
        return dp_bottom_up()
