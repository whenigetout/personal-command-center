# Problem: 707. Design Linked List
# URL: https://leetcode.com/problems/design-linked-list/description/
# Difficulty: Medium
# Tags: 

from typing import List, Optional

class Node:
    def __init__(self, val:int, next:Optional["Node"]=None):
        self.val = val
        self.next = next

class MyLinkedList:
    head: Node = None
    tail: Node = None
    length: int = 0

    def __init__(self, arr: List[int]=[]):
        if arr:
            first_item = arr[0]
            self.addAtHead(first_item)
            if len(arr) > 1:
                for item in arr[1:]:
                    self.addAtTail(item)

    def get(self, index: int) -> int:
        if index < 0 or index >= self.length:
            return -1
        curr = self.head
        next = curr.next
        curr_index = 0
        while curr_index < index: 
            curr = curr.next
            curr_index += 1
        return curr.val

    def addAtHead(self, val: int) -> None:
        node = Node(val)
        # If there's no head node ie empty list
        if self.head is None:
            self.head = node
            self.tail = node
        else:
            node.next = self.head
            self.head = node

        self.length += 1

    def addAtTail(self, val: int) -> None:
        node = Node(val)
        if self.tail is None:
            self.addAtHead(val)
        else:
            self.tail.next = node
            self.tail = node
            self.length += 1

    def addAtIndex(self, index: int, val: int) -> None:
        if index > self.length:
            return
        if index == self.length:
            self.addAtTail(val)
        elif index == 0:
            self.addAtHead(val)
        else:
            # get the node at given index
            curr = self.head
            prev = None
            next = curr.next
            curr_index = 0
            while curr_index < index:
                next = curr.next
                prev = curr
                curr = next
                curr_index += 1

            #insert the node
            node = Node(val)
            prev.next = node
            node.next = curr
            self.length += 1
            

    def deleteAtIndex(self, index: int) -> None:
        if index < 0 or index >= self.length:
            return
        curr = self.head
        prev = None
        next = curr.next
        curr_index = 0
        while curr_index < index:
            next = curr.next
            prev = curr
            curr = next
            curr_index += 1

        #delete the node
        if prev:
            prev.next = curr.next
            # this means deleting the tail, so update the tail attr to new one
            if prev.next is None:
                self.tail = prev
        # this means deleting at head
        else:
            self.head = self.head.next
        self.length -= 1

    def printMyLinkedList(self) -> None:
        curr = self.head
        calculated_length = 0
        if curr is None:
            print("Empty list.")
            return
        while curr is not None:
            print(curr.val, end=" -> ")
            calculated_length += 1
            curr = curr.next
        print("None")

        print(f"calculated length: {calculated_length}")

    def getLength(self) -> int:
        return self.length
        

# Your MyLinkedList object will be instantiated and called as such:
# obj = MyLinkedList()
# param_1 = obj.get(index)
# obj.addAtHead(val)
# obj.addAtTail(val)
# obj.addAtIndex(index,val)
# obj.deleteAtIndex(index)

# class Solution:
#     def solve(self, *args, **kwargs):
#         """Implement the main function expected by LeetCode and your local tests."""
#         raise NotImplementedError
