# Problem: 49. Group Anagrams
# URL: 
# Difficulty: Unknown
# Tags: 
# Note: Even more optimal than the prev one, this eliminates the need for sorting by using 
#   tuples as keys because the letters are lowercase english letters. Note that we're using
#   tuples as keys becuase lists are not hashable

from typing import List, Optional

from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)

        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1

            groups[tuple(count)].append(s)

        return list(groups.values())