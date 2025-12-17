# Problem: 112. Path Sum
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        def dfs(node: Optional[TreeNode], remaining: int):
            if not node:
                return False
            
            # check if leaf node
            if not node.left and not node.right:
                return remaining == node.val
            
            # else try left and right sides
            return (
                dfs(node.left, remaining-node.val) 
                or 
                dfs(node.right, remaining-node.val)
            )
        return dfs(root, targetSum)
