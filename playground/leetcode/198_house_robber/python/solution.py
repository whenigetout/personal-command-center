# Problem: 198. House Robber
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        f(idx) represents the max amt that can be robbed from idx onward
        f(idx) = max(
            nums[idx] + f(idx + 2),
            f(idx + 1)
        )
        base cases:
        if idx == len(nums): return 0
        """
        memo = {}
        def recur(idx):
            if idx >= len(nums):
                return 0
            if idx in memo:
                return memo[idx]
            memo[idx] = max(
                nums[idx] + recur(idx + 2),
                recur(idx + 1)
            )

            return memo[idx]
        
        return recur(0)