# Problem: 70. Climbing Stairs
# URL: 
# Difficulty: Unknown
# Tags: 
# Notes: Cleanest bottom up DP with O(1) space

from typing import List, Optional

class Solution:
    def climbStairs(self, n: int) -> int:
        # let ways to reach step n be defined as ways(n)
        # we have ways(n) = ways(n-1)+ways(n-2)
        if n <=2 :
            return n

        a,b = 1,2
        for _ in range(3, n+1):
            b,a = a+b, b

        return b

obj = Solution()
print(obj.climbStairs(2))
print(obj.climbStairs(3))
print(obj.climbStairs(44))