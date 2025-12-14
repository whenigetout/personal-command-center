# Problem: 70. Climbing Stairs
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def climbStairs(self, n: int) -> int:
        # let ways to reach step n be defined as ways(n)
        # we have ways(n) = ways(n-1)+ways(n-2)
        if n <=2 :
            return n

        dp = [0] * (n+1)
        dp[1] = 1
        dp[2] = 2
        for i in range(3, n+1):
            dp[i] = dp[i-1] + dp[i-2]

        return dp[n]


    
obj = Solution()
print(obj.climbStairs(2))
print(obj.climbStairs(3))
print(obj.climbStairs(44))