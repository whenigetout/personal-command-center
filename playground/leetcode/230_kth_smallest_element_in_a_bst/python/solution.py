# Problem: 230. Kth Smallest Element In A Bst
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: SUB-OPTIMAL solution, inorder traversal produces sorted list, use that to find kth smallest. But takes O(n) space in all cases, which 
# is not needed cause we only need the kth element and not the whole array

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        sorted_nodes = []
        def inorder(root: Optional[TreeNode]) -> None:
            if root is None:
                return
            inorder(root.left)
            sorted_nodes.append(root.val)
            inorder(root.right)
        inorder(root)
        return sorted_nodes[k-1]