# Problem: 238. Product Of Array Except Self
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        left_products = [1] * len(nums)
        product = 1
        for i in range(len(nums)):
            left_products[i] = product
            product *= nums[i]
        
        right_products = [1] * len(nums)
        product = 1
        for i in range(len(nums) - 1, -1, -1):
            right_products[i] = product
            product *= nums[i]

        res = [left_products[i] * right_products[i] for i in range(len(nums))]
        return res