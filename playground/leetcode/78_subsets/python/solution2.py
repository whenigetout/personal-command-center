# Problem: 78. Subsets
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Backtracking

from typing import List, Optional

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        Docstring for subsets
        Backtracking solution
        """
        res = []
        path = []
        def backtrack(idx):
            if idx == len(nums):
                res.append(path[:])
                return
            
            backtrack(idx + 1)

            path.append(nums[idx])
            backtrack(idx + 1)

            path.pop()

        backtrack(0)
        return res