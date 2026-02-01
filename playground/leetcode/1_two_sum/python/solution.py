# Problem: 1. Two Sum
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: O(n^2), see solution2 for better solution

from typing import List, Optional

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        raise