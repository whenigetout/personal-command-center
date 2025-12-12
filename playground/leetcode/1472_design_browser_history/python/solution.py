# Problem: 1472. Design Browser History
# URL: https://leetcode.com/problems/design-browser-history/description/
# Difficulty: Medium
# Tags: 

from typing import List, Optional

class Node:
    def __init__(self, val: str, prev: Optional["Node"]=None, next: Optional["Node"]=None, index: int = 0):
        self.val = val
        self.prev = prev
        self.next = next
        self.index = index

class BrowserHistory:

    def __init__(self, homepage: str):
        self.home = Node(homepage, index=0)
        self.curr = self.home

    def visit(self, url: str) -> None:
        index = self.curr.index+1
        node = Node(url, index=index)
        node.prev = self.curr
        self.curr.next = node
        self.curr = node

    def back(self, steps: int) -> str:
        if steps > self.curr.index:
            self.curr = self.home
            return self.curr.val
        steps_to_move = steps
        while steps_to_move > 0:
            self.curr = self.curr.prev
            steps_to_move -= 1

        return self.curr.val

    def forward(self, steps: int) -> str:
        # calculate total length
        length = self.calculate_length()
        last_index = length-1
        if steps > last_index - self.curr.index:
            # move to the last page
            while self.curr.next is not None:
                self.curr = self.curr.next
            return self.curr.val
        else:
            steps_to_move = steps
            while steps_to_move > 0:
                self.curr = self.curr.next
                steps_to_move -= 1
            return self.curr.val

    def calculate_length(self) -> int:
        length = 1
        curr = self.home
        while curr.next is not None:
            length += 1
            curr = curr.next
        return length


# Your BrowserHistory object will be instantiated and called as such:
# obj = BrowserHistory(homepage)
# obj.visit(url)
# param_2 = obj.back(steps)
# param_3 = obj.forward(steps)