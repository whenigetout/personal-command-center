import pytest
from solution import RecursionWorkbook

obj = RecursionWorkbook()

def test_sum_of_array():
    # Replace these with real cases.
    nums = [1, 2, 3, 4]
    assert obj.sum_of_array(nums) == 10
 
def test_reverse_string():
    assert obj.reverse_string("abcd") == "dcba"
    assert obj.reverse_string("") == ""
    assert obj.reverse_string("5") == "5"

def test_is_palindrome():
    assert obj.is_palindrome("") == True
    assert obj.is_palindrome("racecar") == True
    assert obj.is_palindrome("6") == True
    assert obj.is_palindrome("4456") == False
    assert obj.is_palindrome("abccba") == True
    assert obj.is_palindrome("abcxcba") == True
    assert obj.is_palindrome("abcxcbda") == False

def test_can_reach_end():
    assert obj.can_reach_end([2,3,1,1,4]) == True
    assert obj.can_reach_end([3,2,1,0,4]) == False

def test_subsets():
    res = obj.subsets([1,2,3])
    for item in res:
        print(item)

def test_subset_sum_exists():
    assert obj.subset_sum_exists([1,2,3,7], 6) == True

def test_fib():
    assert obj.fib(5) == 5
    assert obj.fib(10) == 55

def test_climbstairs():
    assert obj.climb_stairs(4) == 5
    assert obj.climb_stairs(5) == 8