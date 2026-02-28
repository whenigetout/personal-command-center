# Problem: 347. Top K Frequent Elements
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: More optimal than prev, which was O(n log n). This uses a (max) heap to avoid sorting
#   this version is O(n log k)

from typing import List, Optional
from collections import Counter
import heapq

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        freq = Counter(nums)

        return heapq.nlargest(k, freq.keys(), key=freq.get)