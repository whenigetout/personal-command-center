# Problem: 17. Letter Combinations Of A Phone Number
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

map_ = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz"
}

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        res = []
        path = []
        strings = [map_[d] for d in digits]

        def dfs(idx):
            if idx == len(strings):
                res.append("".join(path))
                return
            for c in strings[idx]:
                path.append(c)
                dfs(idx + 1)
                path.pop()

        dfs(0)
        return res