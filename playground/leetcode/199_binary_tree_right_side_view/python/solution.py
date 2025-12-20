# Problem: 199. Binary Tree Right Side View
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

from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []
        q = deque([root])
        res = []
        while q:
            level_len = len(q)
            last_node_in_level = None
            for _ in range(level_len):
                node = q.popleft()
                last_node_in_level = node
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(last_node_in_level.val)
        return res