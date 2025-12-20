# Problem: 75. Sort Colors
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Sub-optimal, 2 passes

from typing import List, Optional

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        count = [0,0,0]
        for color in nums:
            if color==0:
                count[0] +=1
            elif color==1:
                count[1] +=1
            else:
                count[2] +=1
        
        if len(nums) == 1:
            return
        if len(nums) == 2:
            nums.sort()
            return

        i = 0
        for color, no_of_copies in enumerate(count):
            for i in range(i, i + no_of_copies):
                nums[i] = color
            if no_of_copies:
                i +=1
        
obj = Solution()
a=[0,0,2]
obj.sortColors(a)
print(a)

