# Problem: 131. Palindrome Partitioning
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

def isPalindrome(s: str) -> bool:
    if len(s) <= 1:
        return True
    l = 0
    r = len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1
        r -= 1
    return True

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []
        path = []

        def dfs(idx):
            if idx == len(s):
                res.append(path[:])
                return
            
            for j in range(idx, len(s)):
                substr = s[idx : j + 1]
                if isPalindrome(substr):
                    path.append(substr)
                    dfs(j + 1)
                    path.pop()
                else:
                    continue
                    
        dfs(0)
        return res
                