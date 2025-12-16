# Problem: 278. First Bad Version
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

first_bad_version = 4

def isBadVersion(version: int) -> bool:
    return version >= first_bad_version

def isFirstBadVersion(version: int) -> bool:
    if version == 1:
        return isBadVersion(version)
    return isBadVersion(version) and not isBadVersion(version - 1)

def binsearch(left: int, right: int) -> int:
    if left > right:
        return -1
    mid = left + (right - left) // 2
    if isFirstBadVersion(mid):
        return mid
    elif isBadVersion(mid):
        return binsearch(left, mid - 1)
    else:
        return binsearch(mid + 1, right)

class Solution:
    def firstBadVersion(self, n: int) -> int:
        return binsearch(1, n)