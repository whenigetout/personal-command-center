# Problem: 105. Construct Binary Tree From Preorder And Inorder Traversal
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Same as solution.py but uses indices map to avoid creating extra arrays

from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        self.pre_idx = 0
        idx_map = {val:idx for idx, val in enumerate(inorder)}
        def build(in_left, in_right):
            if in_left > in_right:
                return None
            root = TreeNode(val=preorder[self.pre_idx])
            root_idx_in_inorder = idx_map[root.val]
            self.pre_idx += 1
            left_subtree_in_left_idx = in_left
            left_subtree_in_right_idx = root_idx_in_inorder - 1
            right_subtree_in_left_idx = root_idx_in_inorder + 1
            right_subtree_in_right_idx = in_right

            root.left = build(left_subtree_in_left_idx, left_subtree_in_right_idx)
            root.right = build(right_subtree_in_left_idx, right_subtree_in_right_idx)

            return root
        
        root_node = build(0, len(inorder) - 1)

        return root_node