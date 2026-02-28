# Problem: 15. 3Sum
# URL: 
# Difficulty: Unknown
# Tags: 
# Time Complexity: 
# Space Complexity: 
# Notes: 

from typing import List, Optional

class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        res = []
        sorted_nums = sorted(nums)
        for i in range(len(sorted_nums) - 2):
            if i > 0 and sorted_nums[i] == sorted_nums[i - 1]:
                continue
            l = i + 1
            r = len(sorted_nums) - 1
            target = -sorted_nums[i]
            while l < r:
                cur_sum = sorted_nums[l] + sorted_nums[r]
                if cur_sum == target:
                    res.append([
                        sorted_nums[i],
                        sorted_nums[l],
                        sorted_nums[r],
                    ])
                    l += 1
                    r -= 1
                    while l < r and sorted_nums[l] == sorted_nums[l - 1]:
                        l += 1
                    while l < r and sorted_nums[r] == sorted_nums[r + 1]:
                        r -= 1
                elif cur_sum < target:
                    l += 1
                else:
                    r -= 1
        return res