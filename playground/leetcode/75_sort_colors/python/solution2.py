# Problem: 75. Sort Colors
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: best solution, single pass, uses the classic "Dutch National Flag" pattern

from typing import List, Optional

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        low = 0
        mid = 0
        high = len(nums) - 1

        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else: # == 2
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
        
obj = Solution()
a=[2,0,2,1,1,0]
obj.sortColors(a)
print(a)

