# Problem: 51. N-Queens
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

def constructBoard(boards: List[List[int]]) -> List[List[str]]:
    res = []
    for board in boards:
        n = len(board)
        res.append([
            "." * col + "Q" + "." * (n - col - 1)
            for col in board
        ])
    return res

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        res = []
        path = []
        cols = set()
        diag1 = set()
        diag2 = set()
        def dfs(row):
            if row == n:
                board = path[:]

                res.append(path[:])
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue

                path.append(col)
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)

                dfs(row + 1)

                path.pop()
                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)
        
        dfs(0)
        return constructBoard(res)
        