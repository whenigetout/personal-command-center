import pytest
from solution import Solution, binsearch

sol = Solution()

def test_binsearch():
    assert binsearch(0, 10) == 6

def test_guessNumber():
    # Replace these with real cases.
    assert sol.guessNumber(10) == 6
