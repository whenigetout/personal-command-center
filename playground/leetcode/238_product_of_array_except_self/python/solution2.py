# Problem: 238. Product Of Array Except Self
# URL: 
# Difficulty: Unknown
# Tags: 
# Notes: This is an optimization in space, uses O(1) space by removing the
#   left and right product arrays from prev version. Note that the problem
#   mentions the output array doesn't count toward the space used

from typing import List, Optional

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        res = [1] * len(nums)
        left_product = 1
        for i in range(len(nums)):
            res[i] = left_product
            left_product *= nums[i]
        
        right_product = 1
        for i in range(len(nums) - 1, -1, -1):
            res[i] *= right_product
            right_product *= nums[i]

        return res