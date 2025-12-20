# Problem: 374. Guess Number Higher Or Lower
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

pick = 6

def guess(num: int) -> int:
    return (num < pick) - (num > pick)

def binsearch(left: int, right: int):
    if left > right:
        return -1
    mid = left + (right - left) // 2
    if guess(mid) == 0:
        return mid
    elif guess(mid) == -1:
        return binsearch(left, mid - 1)
    else:
        return binsearch(mid + 1, right)

class Solution:
    def guessNumber(self, n: int) -> int:
        return binsearch(1, n)
        
