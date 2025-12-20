# Problem: 79. Word Search
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows = len(board)
        cols = len(board[0])
        marked = [[False for col in range(cols)] for row in range(rows)]
        self.res = False

        def dfs(m, n, word_idx):
            if self.res:
                return
            if word_idx == len(word):
                self.res = True
                return
            # index out of bounds
            if m < 0 or m >= rows or n < 0 or n >= cols:
                return
            # don't revisit
            if marked[m][n]:
                return
            # match failed
            if board[m][n] != word[word_idx]:
                return 
            # matched current character
            if board[m][n] == word[word_idx]:
                # mark
                marked[m][n] = True
                # right
                dfs(m + 1, n, word_idx + 1)
                # down
                dfs(m, n + 1, word_idx + 1)
                # left
                dfs(m - 1, n, word_idx + 1)
                # up
                dfs(m, n - 1, word_idx + 1)
                # unmark
                marked[m][n] = False

        for i in range(rows):
            for j in range(cols):
                dfs(i, j, 0)
                if self.res:
                    return True
                
        return self.res