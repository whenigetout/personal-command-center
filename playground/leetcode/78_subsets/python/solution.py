# Problem: 78. Subsets
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        Docstring for subsets
        invariant: f(idx) = all possible subsets from idx onward
            take = [nums[idx]] + f(idx + 1)
            skip = f(idx + 1)
        base case: if idx == len(nums): return [[]]
        """
        def recur(idx: int):
            if idx == len(nums):
                return [[]]
            return (
                [([nums[idx]] + list_) for list_ in recur(idx + 1)]
                +
                recur(idx + 1)
            )
        
        return recur(0)