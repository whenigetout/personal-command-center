# Problem: 39. Combination Sum
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: backtracking version

from typing import List, Optional

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Time: 
        Space: 
        """
        res = []
        path = []
        def f(idx, remaining):
            candidates.sort()
            if remaining == 0:
                res.append(path[:])
                return
            
            if remaining < 0 or idx == len(candidates):
                return
            
            # skip, and skip all copies of the elem if skipping
            j = idx
            while j + 1 < len(candidates) and candidates[j] == candidates[j+1]:
                j += 1

            f(j + 1, remaining)

            # take curr elem (only once)
            path.append(candidates[idx])
            f(idx, remaining - candidates[idx])
            path.pop()

        f(0, target)
        return res
