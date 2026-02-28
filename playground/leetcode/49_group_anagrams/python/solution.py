# Problem: 49. Group Anagrams
# URL: 
# Difficulty: Unknown
# Tags: 
# Note:

from typing import List, Optional

from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)

        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)

        return list(groups.values())