# Problem: 150. Evaluate Reverse Polish Notation
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

ops = {'+', '-', '*', '/'}

def eval_op(lhs: int, op: str, rhs: int) -> int:
    if op == "+":
        return lhs + rhs
    if op == "-":
        return lhs - rhs
    if op == "*":
        return lhs * rhs
    if op == "/":
        return int(lhs / rhs)  # truncate toward zero
    raise ValueError(f"Invalid operator: {op}")

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for token in tokens:
            if token not in ops:
                stack.append(int(token))
            else:
                rhs = int(stack.pop())
                lhs = int(stack.pop())
                stack.append(eval_op(lhs, token, rhs))
        return stack[0]