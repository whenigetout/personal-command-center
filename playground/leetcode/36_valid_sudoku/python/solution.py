# Problem: 36. Valid Sudoku
# URL: 
# Difficulty: Unknown
# Tags: 
# Time Complexity: 
# Space Complexity: 
# Notes: 

from typing import List, Optional

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        n = len(board)
        row_sets =  [set() for _ in range(n)]
        col_sets =  [set() for _ in range(n)]
        box_sets =  [set() for _ in range(n)]
        for r in range(n):
            for c in range(n):
                entry = board[r][c]
                if entry == '.':
                    continue
                if entry in row_sets[r] or entry in col_sets[c]:
                    return False
                box_idx = (r // 3) * 3 + (c // 3)
                if entry in box_sets[box_idx]:
                    return False
                row_sets[r].add(entry)
                col_sets[c].add(entry)
                box_sets[box_idx].add(entry)
        return True
