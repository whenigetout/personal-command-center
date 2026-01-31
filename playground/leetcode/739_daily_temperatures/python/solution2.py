# Problem: 739. Daily Temperatures
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Cleaner version compared to the 1st one

from typing import List, Optional

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0] * len(temperatures)
        stack = []
        for i in range(len(temperatures)):
            while stack and temperatures[i] > temperatures[stack[-1]]:
                res[stack[-1]] = i - stack[-1]
                stack.pop()
            stack.append(i)
        return res