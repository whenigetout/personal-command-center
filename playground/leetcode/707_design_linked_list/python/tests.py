import pytest
from solution import MyLinkedList

def test_placeholder():
    # Replace these with real cases.
    assert True

ops = ["MyLinkedList","addAtTail","addAtTail","addAtIndex","get","deleteAtIndex","get"]
vals = [[],[1],[3],[1,2],[1],[1],[2]]

def run(ops, vals):
    obj = None
    out = []

    for idx, (op, val) in enumerate(zip(ops, vals)):
        if idx > 41:
            pass
        if op == "MyLinkedList":
            print(f"[{idx}] calling {op}")
            obj = MyLinkedList()
            out.append(None)
            print(f"current list ({obj.getLength()}): ", end="")
            obj.printMyLinkedList()
        else:
            print(f"[{idx}] calling {op} with values {val}")
            fn = getattr(obj, op)  # convert string to method
            result = fn(*val)
            out.append(result)
            print(f"current list ({obj.getLength()}): ", end="")
            obj.printMyLinkedList()

    return out

run(ops, vals)