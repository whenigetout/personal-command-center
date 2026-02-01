# Problem: 853. Car Fleet
# URL: 
# Difficulty: Unknown
# Tags: 

"""
Car Fleet (Monotonic Stack)

Key idea:
Cars cannot pass each other, so only their arrival times at the target matter.
Sort cars by starting position (closest to target first), compute each car’s
time to reach the target, and process them in that order.

Maintain a monotonic stack of fleet arrival times:
- If a car behind arrives earlier than or at the same time as the fleet ahead,
    it will catch up and merge into that fleet.
- Otherwise, it forms a new fleet.

The number of fleets equals the size of the stack.
"""


from typing import List, Optional

class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        # sort cars by position
        pos_speed_pairs = sorted(list(zip(position, speed)), reverse=True)
        stack = []
        for pair in pos_speed_pairs:
            if not stack:
                stack.append(pair)
                continue
            top = stack[-1]
            if (target - pair[0]) / pair[1] > (target - top[0]) / top[1]:
                stack.append(pair)
        return len(stack)