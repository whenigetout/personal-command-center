# Problem: 225. Implement Stack Using Queues
# URL: 
# Difficulty: Unknown
# Tags: 
# Notes: This uses only ONE queue and rotation trick

from typing import List, Optional
from collections import deque

class MyStack:

    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        # rotate
        self.q.append(x)
        for _ in range(len(self.q)-1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return not self.q
        
    def print_q(self) -> None:
        print(self.q)

# Your MyStack object will be instantiated and called as such:
# obj = MyStack()
# obj.push(1)
# obj.print_q()
# obj.push(2)
# obj.print_q()

# param_2 = obj.pop()
# param_3 = obj.top()
# param_4 = obj.empty()