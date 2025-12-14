# Problem: 206. Reverse Linked List
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        return self.reverse_helper(None, head)
        
    def reverse_helper(self, head: Optional[ListNode], rest: Optional[ListNode]) -> Optional[ListNode]:
        if not rest:
            return head

        next_ = rest.next
        rest.next = head
        return self.reverse_helper(rest, next_)
        