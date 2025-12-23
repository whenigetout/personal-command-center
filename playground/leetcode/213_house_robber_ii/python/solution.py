# Problem: 213. House Robber Ii
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        This is the same as 198. House Robber (solved in this repo), but with a twist.
        Any valid solution cannot contain both the first and the last house. So we calculate
        max amt for arr[0...n-2] and arr[1...n-1] and return the max of these 2
        """
        if len(nums) < 3:
            return max(nums)
        def dp_bottom_up(start, end):
            next1 = 0
            next2 = 0
            for idx in range(start, end + 1):
                curr = max(nums[idx] + next2, next1)
                next2 = next1
                next1 = curr
            return next1
        return max(dp_bottom_up(0, len(nums) - 2), dp_bottom_up(1, len(nums) - 1))
