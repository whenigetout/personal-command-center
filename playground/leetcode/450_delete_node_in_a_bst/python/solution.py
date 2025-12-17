# Problem: 450. Delete Node In A Bst
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

def minNode(root: Optional[TreeNode], key: int) -> int:
    while root.left:
        root = root.left
    return root

class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        if root is None:
            return None
        if key < root.val:
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            root.right = self.deleteNode(root.right, key)
        else: # key == root.val, found the node to delete
            if root.left is None:
                return root.right
            if root.right is None:
                return root.left
            # if we come this far, the node has TWO children
            # replace the node with the leftmost child from the right subtree
            substitute =  minNode(root.right, key)
            root.val = substitute.val
            root.right = self.deleteNode(root.right, substitute.val)
        
        return root