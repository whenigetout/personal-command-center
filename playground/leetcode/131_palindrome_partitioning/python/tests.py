import pytest
from solution import Solution, isPalindrome

sol = Solution()

def test_placeholder():
    # Replace these with real cases.
    assert isPalindrome("") == True
    assert isPalindrome("a") == True
    assert isPalindrome("aab") == False
    assert isPalindrome("abc") == False
    assert isPalindrome("abcxcba") == True
    assert isPalindrome("adda") == True

print(sol.partition("efe"))