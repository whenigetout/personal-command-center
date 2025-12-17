# Problem: 230. Kth Smallest Element In A Bst
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: OPTIMAL solution, inorder traversal produces sorted list, use that to find kth smallest. But just count as u go and stop when kth is reached
# and use yield for ELEGANCE and CLEANER code with no shared state, no extra list created

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
        
        gen = inorder(root)
        for _ in range(k):
            val = next(gen)
        return val