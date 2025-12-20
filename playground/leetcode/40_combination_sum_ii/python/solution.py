# Problem: 40. Combination Sum Ii
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        res = []
        path = []
        def backtrack(idx, remaining):
            if remaining == 0:
                res.append(path[:])
                return
            if remaining < 0 or idx == len(candidates):
                return
            
            # skip
            j = idx
            while j + 1 < len(candidates) and candidates[j] == candidates[j + 1]:
                j += 1
            backtrack(j + 1, remaining)

            # take
            path.append(candidates[idx])
            backtrack(idx + 1, remaining - candidates[idx])
            path.pop()

        backtrack(0, target)
        return res