# Problem: 74. Search A 2D Matrix
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

def is_potential_candidate(matrix: List[List[int]], target: int, row_idx: int) -> bool:
    if row_idx < 0 or row_idx >= len(matrix):
        return False
    return matrix[row_idx][0] <= target <= matrix[row_idx][-1]

def binsearch_rows(matrix: List[List[int]], target: int, left: int, right: int) -> int:
    if left > right:
        return -1
    mid = left + (right - left) // 2
    if is_potential_candidate(matrix, target, mid):
        return mid
    elif target < matrix[mid][0]:
        return binsearch_rows(matrix, target, left, mid-1)
    else:
        return binsearch_rows(matrix, target, mid + 1, right)
    
def binsearch(arr: List[int], target: int, left: int, right: int) -> int:
    if left > right:
        return -1
    mid = left + (right - left) // 2
    if arr[mid] == target:
        return mid
    elif target < arr[mid]:
        return binsearch(arr, target, left, mid-1)
    else:
        return binsearch(arr, target, mid + 1, right)

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m = len(matrix)
        n = len(matrix[0])
        # if the target is outside the given range of numbers
        if matrix[0][0] > target or matrix[m-1][n-1] < target:
            return False

        # search for the row which could potentially have the target in it
        potential_candidate_row = binsearch_rows(matrix, target, 0, m-1)

        # now search the row for the target
        target_idx = binsearch(matrix[potential_candidate_row], target, 0, n-1)

        return target_idx >= 0


                
