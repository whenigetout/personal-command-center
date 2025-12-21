# Problem: 46. Permutations
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        """
        This is a problem where we're FILLING up spots as opposed to CHOOSING which elements
        to take or skip (combinations, subsets, knapsack etc)
        For each UNUSED elem, fill it in, then for each elem in the REST of the UNUSED, fill it in...

        """
        res = []
        path = []
        used = [False] * len(nums)
        def dfs():
            if len(path) == len(nums):
                res.append(path[:])
                return
            
            for i in range(len(nums)):
                if used[i]:
                    continue

                used[i] = True
                path.append(nums[i])

                dfs()

                path.pop()
                used[i] = False

        dfs()
        return res
        