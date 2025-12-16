import pytest
from solution import Solution

sol = Solution()

def test_placeholder():
    # Replace these with real cases.
    piles = [3,6,7,11]
    h = 8

    assert sol.minEatingSpeed(piles, h) == 4
