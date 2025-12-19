# Problem: 39. Combination Sum
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        f(idx, remaining) = LIST of all possible combinations (lists) that sum exactly to remaining, from idx onward
        for each elem we either take it or skip it
        take = candidates[idx] added to each list in f(idx, remaining - candidates[idx])
        skip = f(idx + 1, remaining)
        base cases:
        if remaining == 0: return [[]]
        if remaining < 0 or idx == len(candidates): return [] # so the receiver should use this in a way 
            that the result should be empty from appending to this, which is what we do in list comprehension
        Time: Time complexity is exponential, upper bounded by O(2^(n + target)), 
            because the recursion forms a binary tree with depth at most n + target.
            Note that we're constructing lists too which adds a polynomial factor, 
            so the worst case still remains exponential cause it dominates the polynomial factor
        Space: recursion stack space = O(n + T) ie height of the tree
            output storage for the lists that are stored = O(2^(n + T) * T)
            so final space complexity would be O(2^(n + T) * T)
        """
        def f(idx, remaining):
            if remaining == 0:
                return [[]]
            if remaining < 0 or idx == len(candidates):
                return []
            
            take = [
                [candidates[idx]] + rest
                for rest in f(idx, remaining - candidates[idx])
            ]
            skip = f(idx + 1, remaining)

            return take + skip
        
        return f(0, target)
