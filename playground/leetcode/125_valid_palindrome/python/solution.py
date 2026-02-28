# Problem: 125. Valid Palindrome
# URL: 
# Difficulty: Unknown
# Tags: 
# Time Complexity: 
# Space Complexity: 
# Notes: 

from typing import List, Optional

class Solution:
    def isPalindrome(self, s: str) -> bool:
        l = 0
        r = len(s) - 1
        if len(s) == 1:
            return True
        while l < r:
            lc = s[l]
            rc = s[r]
            if not lc.isalnum():
                l += 1
                continue
            if not rc.isalnum():
                r -= 1
                continue
            if lc.lower() != rc.lower():
                return False
            l += 1
            r -= 1
        return True