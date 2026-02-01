# Problem: 217. Contains Duplicate
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        memo = set()
        for n in nums:
            if n in memo:
                return True
            memo.add(n)
        return False