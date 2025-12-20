# Problem: 875. Koko Eating Bananas
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional
import math

def isValidSpeed(k: int, piles: List[int], h: int) -> bool:
    total_hours_at_speed_k = sum([math.ceil(item/k) for item in piles])
    return total_hours_at_speed_k <= h

def binsearch_first_occur(piles: List[int], h: int, left: int, right: int) -> int:
    if left == right:
        return left
    mid = left + (right - left) // 2
    if isValidSpeed(mid, piles, h):
        return binsearch_first_occur(piles, h, left, mid)
    else:
        return binsearch_first_occur(piles, h, mid + 1, right)

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        return binsearch_first_occur(piles, h, 1, max(piles))