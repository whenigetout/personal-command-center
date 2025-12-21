# Problem: 22. Generate Parentheses
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []
        path = []

        def dfs(o_unused, c_unused):
            if len(path) == n * 2:
                res.append("".join(path))
                return
            
            if o_unused == 0:
                # use ")" if available
                if c_unused:
                    path.append(")")
                    dfs(o_unused, c_unused - 1)
                    path.pop()
                return
            
            # use "(", and add one usable ")" to the next fn. call
            path.append("(")
            dfs(o_unused - 1, c_unused + 1)
            path.pop()

            # use ")" if available
            if c_unused:
                path.append(")")
                dfs(o_unused, c_unused - 1)
                path.pop()
            
        dfs(n, 0)
        return res
