# Problem: 1. Two Sum
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: 

from typing import List, Optional

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}

        for i, x in enumerate(nums):
            need = target - x
            if need in seen:
                return [seen[need], i]
            seen[x] = i

        return []