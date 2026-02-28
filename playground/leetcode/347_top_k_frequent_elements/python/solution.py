# Problem: 347. Top K Frequent Elements
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional
from collections import defaultdict

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        freq = defaultdict(int)
        for i in nums:
            freq[i] += 1
        sorted_items = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [item[0] for item in sorted_items[:k]]