# Problem: 23. Merge K Sorted Lists
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
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        if not lists:
            return None
        
        def merge2Lists(list1, list2) -> Optional[ListNode]:
            dummy = ListNode()
            tail = dummy
            while list1 and list2:
                if list1.val <= list2.val:
                    tail.next = list1
                    list1 = list1.next
                else:
                    tail.next = list2
                    list2 = list2.next
                tail = tail.next

            tail.next = list1 or list2
            return dummy.next
        
        merged = lists[0]
        for i in range(1, len(lists)):
            merged = merge2Lists(merged, lists[i])

        return merged

