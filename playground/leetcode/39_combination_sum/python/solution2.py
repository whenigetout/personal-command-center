# Problem: 39. Combination Sum
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: memoized version

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
        Time: total no. of states = O(n * T) and with memo each state is computed only once
            and we also have output lists that we are constructing
            so final time is O(n * T + total_output_size)
        Space: 
        """
        memo = {}
        def f(idx, remaining):
            if remaining == 0:
                return [[]]
            if remaining < 0 or idx == len(candidates):
                return []
            
            key = (idx, remaining)
            if key in memo:
                return memo[key]
            
            take = [
                [candidates[idx]] + rest
                for rest in f(idx, remaining - candidates[idx])
            ]
            skip = f(idx + 1, remaining)

            memo[key] = take + skip

            return memo[key]
        
        return f(0, target)
