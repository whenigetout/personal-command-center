import pytest
from solution import is_potential_candidate, binsearch_rows, binsearch, Solution

def test_candidate_true():
    matrix = [
        [1, 3, 5],
        [7, 9, 11],
    ]
    assert is_potential_candidate(matrix, 3, 0) is True

def test_candidate_false():
    matrix = [
        [1, 3, 5],
        [7, 9, 11],
    ]
    assert is_potential_candidate(matrix, 6, 0) is False

matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]

def test_potential_candidate():
    assert binsearch_rows(matrix, 13, 0, 2) == 1
    assert binsearch_rows(matrix, 23, 0, 2) == 2
    assert binsearch_rows(matrix, 123, 0, 2) == -1

def test_binsearch():
    arr = [-3, -1, 0, 3, 6, 10]
    assert binsearch(arr, 2, 0, 5) == -1
    assert binsearch(arr, 3, 0, 5) == 3
    assert binsearch(arr, 6, 0, 5) == 4
    assert binsearch(arr, 16, 0, 5) == -1

def test_searchmatrix():
    obj = Solution()
    assert obj.searchMatrix(matrix, 3) is True
    assert obj.searchMatrix(matrix, 13) is False