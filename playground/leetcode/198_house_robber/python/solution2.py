# Problem: 198. House Robber
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def rob(self, nums: List[int]) -> int:
        def dp_bottom_up():
            next1 = 0
            next2 = 0
            for idx in range(len(nums)-1, -1, -1):
                curr = max(nums[idx] + next2, next1)
                next2 = next1
                next1 = curr
            return next1
        
        return dp_bottom_up()