# Problem: 739. Daily Temperatures
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0 for temp in temperatures]
        stack = [0]
        for i in range(1, len(temperatures)):
            if temperatures[i] <= temperatures[stack[-1]]:
                stack.append(i)
            else:
                while stack:
                    unresolved_idx = stack[-1]
                    current_idx = i
                    if temperatures[current_idx] > temperatures[unresolved_idx]:
                        res[unresolved_idx] = current_idx - unresolved_idx
                        stack.pop()
                    else:
                        break
                stack.append(current_idx)
        return res