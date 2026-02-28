# Problem: 128. Longest Consecutive Sequence
# URL: 
# Difficulty: Unknown
# Tags: 
# Time Complexity: 
# Space Complexity: 
# Notes: 

from typing import List, Optional

class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        set_ = set(nums)
        longest = 0
        for x in set_:
            if x - 1 not in set_:
                current = x
                length = 1

                while current + 1 in set_:
                    current += 1
                    length += 1

                longest = max(longest, length)
        return longest

