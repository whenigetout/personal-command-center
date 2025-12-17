# Problem: 230. Kth Smallest Element In A Bst
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Same as the SUB-OPTIMAL solution in solution.py, but use yield to generate the sorted list

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        def inorder(root: Optional[TreeNode]):
            if root:
                yield from inorder(root.left)
                yield root.val
                yield from inorder(root.right)
        sorted_nodes = list(inorder(root))
        return sorted_nodes[k-1]