# Problem: 1700. Number Of Students Unable To Eat Lunch
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional
from collections import deque

class Solution:
    def countStudents(self, students: List[int], sandwiches: List[int]) -> int:
        q = deque(students)
        stack = sandwiches[: :-1]
        while len(q):
            student = q[0]
            sandwich = stack[-1]
            if student == sandwich:
                q.popleft()
                stack.pop()
            elif sandwich not in q:
                break
            else:
                temp_stdt = q.popleft()
                q.append(temp_stdt)
        return len(q)
