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

def arrToStr(arr: List[str]):
    return "".join(arr)

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []
        path = []

        def dfs(idx):
            path.append(s[idx])
            pathStr = arrToStr(path)
            if not isPalindrome(pathStr):
                dfs(idx + 1)
            else:
                res.append(pathStr)
                