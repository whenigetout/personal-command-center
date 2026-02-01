# Problem: 242. Valid Anagram
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Using the Counter collection

"""
Docstring for playground.leetcode.242_valid_anagram.python.solution2
from collections import Counter

Counter("anagram")

# Produces:
{
    'a': 3,
    'n': 1,
    'g': 1,
    'r': 1,
    'm': 1
}

"""

from typing import List, Optional
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)