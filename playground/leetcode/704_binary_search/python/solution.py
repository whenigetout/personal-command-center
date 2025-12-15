# Problem: 704. Binary Search
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        def bin_search(arr: List[int], target: int, left: int, right: int) -> int:
            if left > right:
                return -1
            
            mid = left + (right - left)//2
            if arr[mid] == target:
                return mid
            elif arr[mid] > target:
                return bin_search(arr, target, left, mid-1)
            else:
                return bin_search(arr, target, mid + 1, right)
        
        return bin_search(nums, target, 0, len(nums)-1)
    
obj = Solution()
arr = [-1,0,3,5,9,12]
print(obj.search(arr, 9))