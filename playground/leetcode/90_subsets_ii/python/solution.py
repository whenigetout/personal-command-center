# Problem: 90. Subsets Ii
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        """
        Sort and then skip all copies when skipping, the "take" path remains as usual
        """
        nums.sort()
        res = []
        path = []
        def dfs(idx):
            if idx == len(nums):
                res.append(path[:])
                return
            
            # skip
            j = idx
            # skip all copies of the current elem
            while j + 1 < len(nums) and nums[j] == nums[j + 1]:
                j += 1
            dfs(j + 1)

            # take
            path.append(nums[idx])
            dfs(idx + 1)
            path.pop()

        dfs(0)
        return res