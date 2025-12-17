# Problem: 230. Kth Smallest Element In A Bst
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: OPTIMAL solution, inorder traversal produces sorted list, use that to find kth smallest. But just count as u go and stop when kth is reached

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        self.count = 0
        self.res = None
        def inorder(root: Optional[TreeNode]) -> None:
            if root is None or self.res is not None:
                return
            inorder(root.left)
            self.count += 1
            if self.count == k:
                self.res = root.val
                return
            inorder(root.right)
        
        inorder(root)
        return self.res