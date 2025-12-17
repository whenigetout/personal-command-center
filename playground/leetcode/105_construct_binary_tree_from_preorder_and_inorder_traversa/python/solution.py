# Problem: 105. Construct Binary Tree From Preorder And Inorder Traversal
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Basic solution, SOLVES the problem but creates a lot of extra arrays depending on tree size

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        if not preorder:
            return None
        root = TreeNode(val=preorder[0])
        root_idx_in_inorder = inorder.index(root.val)
        left_inorder = inorder[ : root_idx_in_inorder]
        right_inorder = inorder[root_idx_in_inorder + 1 :]
        left_preorder = preorder[1 : len(left_inorder) + 1]
        right_preorder = preorder[len(left_inorder) + 1 :]
        
        root.left = self.buildTree(left_preorder, left_inorder)
        root.right = self.buildTree(right_preorder, right_inorder)

        return root
