# Problem: 94. Binary Tree Inorder Traversal
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: FANCY version using yield

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
        
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        def inorder(root: Optional[TreeNode]):
            if root:
                yield from inorder(root.left)
                yield root.val
                yield from inorder(root.right)
        return list(inorder(root))