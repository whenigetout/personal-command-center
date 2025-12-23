# Problem: 5. Longest Palindromic Substring
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        f(idx) = longest palindromic substr from elems idx onwards
        try every substr s[idx, j] where j:: idx -> len(s), check if it's a palindrome 

        """