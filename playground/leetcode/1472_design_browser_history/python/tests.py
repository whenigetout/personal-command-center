import pytest
from solution import BrowserHistory

def test_placeholder():
    # Replace these with real cases.
    assert True

ops = ["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"]
vals = [["leetcode.com"],["google.com"],["facebook.com"],["youtube.com"],[1],[1],[1],["linkedin.com"],[2],[2],[7]]

def run(ops, vals):
    obj = None

    for idx, (op, val) in enumerate(zip(ops, vals)):
        if op == "BrowserHistory":
            print(f"[{idx}] calling {op}")
            obj = BrowserHistory(*val)
        else:
            print(f"[{idx}] calling {op} with values {val}")
            fn = getattr(obj, op)  # convert string to method
            result = fn(*val)

run(ops, vals)