import pytest
from solution import Solution

sol = Solution()

res = sol.generateParenthesis(3)

for s in res:
    print( s)