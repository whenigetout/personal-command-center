# Problem: Recursion Problems
# URL: 
# Difficulty: Unknown
# Tags: 

from typing import List, Optional
import math

class RecursionWorkbook:
    # =========================
    # GROUP 1: Linear Recursion
    # =========================

    def sum_of_array(self, nums: List[int]) -> int:
        """
        Problem:
        Return the sum of all elements in nums.

        Example:
        nums = [1, 2, 3, 4]
        Output: 10
        """
        # invariant: sum of all elements from idx onward
        # base case: if idx == len(arr) return 0
        def sum_arr(idx: int) -> int:
            if idx == len(nums):
                return 0
            return nums[idx] + sum_arr(idx + 1)
        return sum_arr(0)

    def reverse_string(self, s: str) -> str:
        """
        Problem:
        Return the reverse of string s.

        Example:
        s = "abcd"
        Output: "dcba"
        """
        # invariant: fn. returns reverse of substring from idx
        # base case: if idx == len(s): return s[idx]
        def reverse(idx):
            if idx == len(s):
                return ""
            return reverse(idx + 1) + s[idx]
        return reverse(0)

    def is_palindrome(self, s: str) -> bool:
        """
        Problem:
        Return True if s is a palindrome.

        Example:
        s = "racecar"
        Output: True
        """
        # invariant: fn checks char at left == right, and then left+=1 right-=1
        #   at any point if result is false then return false, return true if it's never false
        #   or in short: recur(left, right) returns True iff s[left:right+1] is a palindrome
        # base case: if left >= right: return true
        def recur(left: int, right: int) -> bool:
            if left >= right:
                return True
            if s[left] != s[right]:
                return False
            return recur(left + 1, right - 1)
        return recur(0, len(s)-1)

    # =========================
    # GROUP 2: Boolean Recursion
    # =========================

    def contains_target(self, nums: List[int], target: int) -> bool:
        """
        Problem:
        Return True if target exists in nums.

        Example:
        nums = [3, 1, 4, 6], target = 4
        Output: True
        """
        # invariant: fn. returns true iff subarray from idx onwards contains the target 
        # base case: if idx == len(arr): return False
        def recur(idx: int) -> bool:
            if idx == len(nums):
                return False
            if nums[idx] == target:
                return True
            return recur(idx + 1)
            # can be shortened like so:
            # return nums[idx] == target or recur(idx + 1)

        return recur(0)

    def can_reach_end(self, nums: List[int]) -> bool:
        """
        Problem:
        Jump Game (simplified).
        You can jump at most nums[i] steps forward from index i.
        Is there any sequence of jumps, obeying the rules at each index, that reaches the last index?
        Return True if you can reach last index starting from index 0.

        Example:
        nums = [2,3,1,1,4]
        Output: True

        Example 2:
        nums = [3,2,1,0,4]
        Output: False
        """
        # invariant: fn returns true iff last index is reachable from idx
        # base case: if idx == len(arr)-1: return True (we're AT last index, assumes True for empty arr)
        #            if idx + max_possible_steps >= len(arr)-1: return True (last index is reachable directly)
        #            if max_possible_steps == 0: return False (unreachable)
        # first version which i wrote
        def recur(idx):
            if idx == len(nums) - 1:
                return True
            max_possible_steps = nums[idx]
            if idx + max_possible_steps >= len(nums) - 1:
                return True
            if max_possible_steps == 0:
                return False
            res = False
            for steps in range(1, max_possible_steps + 1):
                res = recur(idx + steps)
                if res:
                    break
            return res
        
        # improved/idiomatic/cleaner version
        def recur_improved(idx):
            if idx >= len(nums) - 1:
                return True
            max_possible_steps = nums[idx]
            if max_possible_steps == 0:
                return False
            for steps in range(1, max_possible_steps + 1):
                if recur_improved(idx + steps):
                    return True
            return False
        return recur_improved(0)

    # =========================
    # GROUP 3: Binary Choice
    # =========================

    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        Problem:
        Return all subsets of nums.

        Example:
        nums = [1,2]
        Output: [[], [1], [2], [1,2]]
        """
        # invariant: recur(idx) returns a list of all subsets of nums[idx:]
        # base case: if idx == len(arr): return [[]] # notice it's NOT "return []"
        #   base case returns [[]] because empty set has one subset
        
        def recur(idx):
            # base case:
            if idx == len(nums):
                return [[]]
            
            subsets_without = recur(idx+1)
            subsets_with = [[nums[idx]] + subset for subset in subsets_without]

            return subsets_without + subsets_with
        
        # same logic but use backtracking instead
        res = []
        path = []
        def backtrack(idx):
            # base case, RECORD (not 'return' like in recursion) the current result from the current path
            if idx == len(nums):
                # note that u MUST NOT do something like res.append(path)  here, because that would 
                # append a REFERENCE to the same shared arr instead of a shallow copy which is what we need
                res.append(path[:])
                return
            
            # choice 1: exclude nums[idx]
            backtrack(idx + 1)

            # choice 2: include nums[idx]
            path.append(nums[idx])
            backtrack(idx + 1)
            
            # important, this resets the 'path' to what it was before exploring deepere from 'here' ie idx
            path.pop()
        
        backtrack(0)
        return res
        
        # if u want to use the recursive fn instead:
        # return recur(0)

    def subset_sum_exists(self, nums: List[int], target: int) -> bool:
        """
        Problem:
        Return True if any subset sums to target.

        Example:
        nums = [1,2,3,7], target = 6
        Output: True
        """
        # invariant: f(idx, sum) = True iff it's possible to reach the 'target' sum using elements from idx onward,
        #   given that the current sum is sum
        # base case: if sum == target: return True
        #            if idx == len(nums): return False
        def recur(idx, sum):
            if sum == target:
                return True
            if idx == len(nums):
                return False
            # with or without current elem
            return (
                recur(idx + 1, sum + nums[idx])
                or 
                recur(idx + 1, sum)
            )
        
        # same thing but with memoization
        memo = {}
        def recur_with_memo(idx, sum):

            if sum == target:
                return True
            if idx == len(nums):
                return False
            
            key = (idx, sum)
            if key in memo:
                return memo[key]
            # with or without current elem
            memo[key] = (
                recur(idx + 1, sum + nums[idx])
                or 
                recur(idx + 1, sum)
            )
            
            return memo[key]
        
        # optimal bottom up DP
        def dp():
            possible = [False] * (target + 1)
            possible[0] = True

            for num in nums:
                for sum_ in range(target, num - 1, -1):
                    if possible[sum_ - num]:
                        possible[sum_] = True

            return possible[target]

        return dp()

    def partition_equal_subset_sum(self, nums: List[int]) -> bool:
        """
        Problem:
        Return True if nums can be partitioned into two subsets
        with equal sum.

        Example:
        nums = [1,5,11,5]
        Output: True
        """
        # invariant:
        # base case:
        pass

    # =========================
    # GROUP 4: Backtracking
    # =========================

    def generate_parentheses(self, n: int) -> List[str]:
        """
        Problem:
        Generate all valid parentheses combinations.

        Example:
        n = 3
        Output: ["((()))","(()())","(())()","()(())","()()()"]
        """
        # invariant:
        # base case:
        pass

    def permutations(self, nums: List[int]) -> List[List[int]]:
        """
        Problem:
        Return all permutations of nums.

        Example:
        nums = [1,2,3]
        Output:
        [
          [1,2,3],[1,3,2],
          [2,1,3],[2,3,1],
          [3,1,2],[3,2,1]
        ]
        """
        # invariant:
        # base case:
        pass

    def combination_sum(self, nums: List[int], target: int) -> List[List[int]]:
        """
        Problem:
        Return all combinations where numbers sum to target.
        Numbers may be reused.

        Example:
        nums = [2,3,6,7], target = 7
        Output: [[2,2,3],[7]]
        """
        # invariant:
        # base case:
        pass

    # =========================
    # GROUP 5: Tree Recursion
    # =========================

    def max_depth(self, root) -> int:
        """
        Problem:
        Return maximum depth of binary tree.

        Example:
        root = [3,9,20,null,null,15,7]
        Output: 3
        """
        # invariant:
        # base case:
        pass

    def same_tree(self, p, q) -> bool:
        """
        Problem:
        Return True if two trees are identical.
        """
        # invariant:
        # base case:
        pass

    def invert_tree(self, root):
        """
        Problem:
        Invert the binary tree.
        """
        # invariant:
        # base case:
        pass

    # =========================
    # GROUP 6: Divide & Conquer
    # =========================

    def merge_sort(self, nums: List[int]) -> List[int]:
        """
        Problem:
        Sort the array nums.

        Example:
        nums = [5,2,3,1]
        Output: [1,2,3,5]
        """
        # invariant:
        # base case:
        pass

    # ============================
    # GROUP 7: Dynamic Programming
    # ============================

    def fib(self, n: int) -> int:
        """
        Problem:
        Return the nth Fibonacci number.

        Definition:
        fib(0) = 0
        fib(1) = 1
        fib(n) = fib(n-1) + fib(n-2)

        Inputs:
        n = 0 -> 0
        n = 1 -> 1
        n = 5 -> 5
        n = 10 -> 55

        Constraints:
        0 <= n <= 10^6

        Notes:
        - A naive recursive solution will TLE.
        - Optimize for time and space.
        """

        """
        Basic reursive fn.
        invariant: f(n) returns f(n-1) + f(n-2) ie the nth fibonacci no.
        base case: follow the fibonacci definition, return 0 for n==0 and 1 for n==1

        Time Complexity:
        T(n) = T(n-1) + T(n-2)
        This forms a binary recursion tree.
        Number of calls grows exponentially.
        => O(2^n)

        Space Complexity:
        Maximum recursion depth is n.
        Only one path is active at a time.
        => O(n)

        """
        def recur(n:int):
            if n == 0:
                return 0
            if n == 1:
                return 1
            return recur(n-1) + recur(n-2)
        
    
        """
        Recursion with memo (DP top-down)
        Time: each f(n) is called/computed only once. so time complexity = no. of calls = O(n)
        Space: O(n) is the space taken by memo + O(n) is the recursion stack depth
            So total space complexity is O(n) 
        """
        memo = {}
        def recur_memo(n:int):
            if n == 0:
                return 0
            if n == 1:
                return 1
            if n in memo:
                return memo[n]
            memo[n] = recur_memo(n-1) + recur_memo(n-2)
            return memo[n]
        
        """
        Now DP bottom up
        Time: O(n) from the for loop
        Space: O(n) from the dp[] array
        """
        def dp_bottom_up(n:int):
            dp = [0]*(n+1)
            dp[0] = 0
            dp[1] = 1
            for i in range(2, n+1):
                dp[i] = dp[i-1] + dp[i-2]
            return dp[n]
        
        """
        Optimal DP bottom up, we don't need the whole dp array above
        Time: O(n) from for loop
        Space: O(1)
        """
        def dp_bottom_up_optimal(n:int):
            if n==0:
                return 0
            if n==1:
                return 1
            # f(n) = f(n-1) + f(n-2), start with n=2
            # let prev2 = f(n-2) and prev1 = f(n-1)
            prev2 = 0 # f(0)
            prev1 = 1 # f(1)
            for _ in range(2, n+1):
                # f(i) = f(i-2) + f(i-1)
                curr = prev1 + prev2
                # current f(i) becomes f(i-1) next iteration
                prev2 = prev1
                prev1 = curr

            return prev1
            

        return dp_bottom_up_optimal(n)

    def climb_stairs(self, n: int) -> int:
        """
        Problem:
        You are climbing a staircase with n steps.
        Each time, you can climb either 1 step or 2 steps.
        Return the number of distinct ways to reach the top.

        Inputs:
        n = 1 -> 1
        n = 2 -> 2
        n = 3 -> 3
        n = 4 -> 5
        n = 5 -> 8

        Constraints:
        1 <= n <= 10^6

        Notes:
        - Order matters.
        - Large n should be handled efficiently.
        """
        """
        Basic recursion
        invariant: f(n) is the no. of ways to reach the nth step, which in turn is f(n-1) + f(n-2)
        base case: f(1) = 1, f(2) = 2
        this is basically fibonacci but with different f(2) and no f(0)
        Time: same as fibonacci, T(n) = T(n-1) + T(n-2) -> binary recursion tree -> O(2^n)
        Space: recursion stack depth ie O(n)
        """
        def recur(n: int):
            if n == 1 or n == 2:
                return n
            return recur(n-1) + recur(n-2)
        
        """
        Memoized DP top-down, cause subproblems are computed multiple times
        Time: each f(n) is called/computed exactly once, so O(n)
        Space: O(n) = O(n) for the memo table + O(n) for the recursion stack depth 
        """
        memo = {}
        def dp_top_down(n: int):
            if n == 1 or n == 2:
                return n
            if n in memo:
                return memo[n]
            memo[n] = dp_top_down(n-1) + dp_top_down(n-2)
            return memo[n]
        
        """
        DP bottom-up (iterative)

        Time: O(n) from for loop
        Space: O(n) cause extra memory for dp[] but no recursion stack so no add. space than that
        """
        def dp_bottom_up(n: int):
            if n == 1 or n == 2:
                return n
            dp = [0] * (n+1)
            dp[1] = 1
            dp[2] = 2

            for i in range(3, n+1):
                dp[i] = dp[i-2] + dp[i-1]

            return dp[n]

    
        """
        DP Optimal cause we don't really need the whole array above, we just need the result
        Time: O(n) from for loop
        Space: O(1) cause no extra memory for dp[] and no recursion stack so no add. space 
        """
        def dp_bottom_up_optimal(n: int):
            if n == 1 or n == 2:
                return n
            prev2 = 1
            prev1 = 2
            for _ in range(3, n + 1):
                curr = prev2 + prev1
                prev2 = prev1
                prev1 = curr
            return prev1

        return dp_bottom_up_optimal(n)

    def house_robber(self, nums: list[int]) -> int:
        """
        Problem:
        You are a robber planning to rob houses along a street.
        You cannot rob two adjacent houses.
        Return the maximum amount of money you can rob.

        Inputs:
        nums = [1,2,3,1] -> 4
        nums = [2,7,9,3,1] -> 12
        nums = [2,1,1,2] -> 4

        Constraints:
        1 <= len(nums) <= 10^5
        0 <= nums[i] <= 10^4

        Notes:
        - This is a classic take-or-skip problem.
        """
        """
        Basic recursion
        invariant: f(idx) is the max sum possible from idx onward
        base case: if idx >= len(nums): return 0 # no more houses to rob
        Time: for each house we have 2 choices include it or exclude so O(2^n)
        Space: recursion stack depth ie O(n)
        """
        def recur(idx):
            if idx >= len(nums):
                return 0
            return max(
                nums[idx] + recur(idx + 2),
                recur(idx + 1)
            )
        
        """
        DP top-down ie recur with memo
        Why? Because there are overlapping subproblems
        Time: each f(idx) is calculated only once so O(n)
        Space: O(n) for memo + O(n) recursion stack depth = O(n)
        """
        memo = {}
        def dp_top_down(idx:int):
            if idx >= len(nums):
                return 0
            
            if idx in memo:
                return memo[idx]
            
            memo[idx] = max(
                nums[idx] + dp_top_down(idx + 2),
                dp_top_down(idx + 1)
            )

            return memo[idx]
        
        """
        DP bottom-up
        Why? Improves space usage cause no recursion stack
        Time: O(n) from for loop
        Space: O(n) for the possible[] array but note there is no recursion stack here so
        no add. cost compared to above
        """
        def dp_bottom_up(arr: List[int]):
            n = len(arr)
            possible = [0] * (n)

            if n == 0:
                return 0
            if n == 1:
                return arr[0]

            possible[n-1] = arr[n-1]
            possible[n-2] = max(arr[n-2], arr[n-1])

            for i in range(n - 3, -1, -1):
                possible[i] = max(possible[i + 2] + arr[i], possible[i + 1])
            
            return possible[0]
        
        """
        DP Optimal space, cause from the recursion or the loop above,
        dp[i] depends only on dp[i + 1] and dp[i + 2], just like fibonacci,
        albeit the formula differs, so i can remove the need for the O(n) space
        Time: O(n) cause for loop
        Space: O(1) cause no extra space used hahaha
        """
        def dp_bottom_up_optimal(arr: List[int]):
            n = len(arr)
            if n == 0:
                return 0
            if n == 1:
                return arr[0]
            
            next1 = max(arr[n-2], arr[n-1])  # f(i+1)
            next2 = arr[n-1]                 # f(i+2)

            for i in range(n - 3, -1, -1):
                curr = max(arr[i] + next2, next1)
                next2 = next1
                next1 = curr

            return next1

        return dp_bottom_up_optimal(nums)
        
    def coin_change(self, coins: list[int], amount: int) -> int:
        """
        Problem:
        Given coins of different denominations,
        return the minimum number of coins needed to make up the given amount.
        If it is not possible, return -1.

        Inputs:
        coins = [1,2,5], amount = 11 -> 3
        coins = [2], amount = 3 -> -1
        coins = [1], amount = 0 -> 0

        Constraints:
        1 <= len(coins) <= 100 
        0 <= amount <= 10^4

        Notes:
        - Unlimited supply of each coin.
        - Order does NOT matter.
        """
        
        """
        Basic recursion
        invariant: f(idx, amt) is the min no. of coins from coins[idx] onward needed to make up amt
            for each coin, there are two choices, take it or not, and this transforms the problem like so:
            f(idx, amt) = min(1 + f(idx, amt - coins[idx]), f(idx + 1, amt))
        base case: if amt == 0: return 0
                   if idx == len(coins) or amt < 0: return INFINITY
        Time: O(2^(n + amount))
        Space: O(m+n) recursion stack depth
        """
        def recur(idx, amt):
            if amt == 0:
                return 0
            if idx == len(coins) or amt < 0:
                return math.inf

            with_curr = 1 + recur(idx, amt - coins[idx])
            without_curr = recur(idx + 1, amt)
            return min(with_curr, without_curr)
        
        """
        DP top-down ie recur with memo
        Why? Cause the naive recur above is EXPONENTIAL
        Time: O(amount * n) because that's the max no. of distinct states for this problem and each one is computed only once
        Space: O(amount * n) because that's the no. of states and we take that much space, note that the space here is MORE than 
            naive recur above but the time is much better so overall this much much more efficient
        """
        memo = {}
        def dp_top_down(idx, amt):
            if amt == 0:
                return 0
            if idx == len(coins) or amt < 0:
                return math.inf

            key = (idx, amt)
            if key in memo:
                return memo[key]

            with_curr = 1 + recur(idx, amt - coins[idx])
            without_curr = recur(idx + 1, amt)
            memo[key] = min(with_curr, without_curr)
            return memo[key]
        
        """
        DP bottom-up
        Why? Cause dp bottom up is always the best if it is applicable (i think xd), but ofc this removes the need for space
            that the recursion stack would take
        Time: O(n * amount)
        Space: O(n * amount)
        """
        def dp_bottom_up():
            n = len(coins)
            dp = [[math.inf for _ in range(amount + 1)] for _ in range(n + 1)]

            # Basce case: amount 0 requires 0 coins
            for idx in range(n + 1):
                dp[idx][0] = 0


            # Dependency 1: dp[idx][amt - coin]
            # → requires smaller amt
            # → so amt must go from small → large

            # Dependency 2: dp[idx + 1][amt]
            # → requires larger idx
            # → so idx must go from large → small
            for idx in range(n - 1, -1, -1):
                for amt in range(1, amount + 1):
                    # skip curr coin
                    skip = dp[idx + 1][amt]

                    # take curr coin (if possible)
                    take = math.inf
                    if amt >= coins[idx]:
                        take = 1 + dp[idx][amt - coins[idx]]

                    dp[idx][amt] = min(take, skip)
            
            return dp[0][amount]

        """
        Optimal Coin Change solution
        DP bottom-up - 1D dp (no need to have a 2d memo array)
        Why? Cause dp bottom up is always the best if it is applicable (i think xd), but ofc this removes the need for space
            that the recursion stack would take
        The 1D invariant (lock this in), we change the meaning of dp completely:
            dp[amt] = minimum number of coins needed to make amount amt using all coins processed so far
        Time: O(n * amount)
        Space: O(amount)
        """
        def optimal_coin_change():
            dp = [math.inf] * (amount + 1)
            dp[0] = 0

            for coin in coins:
                for amt in range(coin, amount + 1):
                    dp[amt] = min(dp[amt], 1 + dp[amt - coin])

            return dp[amount] if dp[amount] != math.inf else -1

        res = optimal_coin_change()
        return res if res != math.inf else -1

    def length_of_lis(self, nums: list[int]) -> int:
        """
        Problem:
        Return the length of the longest strictly increasing subsequence.

        Inputs:
        nums = [10,9,2,5,3,7,101,18] -> 4
        nums = [0,1,0,3,2,3] -> 4
        nums = [7,7,7,7] -> 1

        Constraints:
        1 <= len(nums) <= 2500
        -10^4 <= nums[i] <= 10^4

        Notes:
        - Subsequence does NOT have to be contiguous.
        """

        """
        Basic recursion
        invariant: f(idx, prev_max) = length of the longest strictly increasing subsequence from idx onward,
            prev_max = max element so far
        base case: if idx == len(arr): return 0 # empty arr so no subsequence
                   if prev_max is not None and nums[idx] <= prev_max: return 0 # curr elem does NOT add to the INCREASING subsequence
        Time: O(2^n) where n = len(nums)
        Space: O(n)
        """
        def recur(idx, prev_max):
            if idx == len(nums):
                return 0
            if prev_max is not None and nums[idx] <= prev_max:
                return recur(idx + 1, prev_max)
            return max(
                1 + recur(idx + 1, nums[idx]),
                recur(idx + 1, prev_max)
            )
        
        return recur(0, None)

    def can_partition(self, nums: list[int]) -> bool:
        """
        Problem:
        Given a list of positive integers,
        determine if the array can be partitioned into two subsets
        such that the sum of elements in both subsets is equal.

        Inputs:
        nums = [1,5,11,5] -> True
        nums = [1,2,3,5] -> False
        nums = [3,3,3,4,5] -> True

        Constraints:
        1 <= len(nums) <= 200
        1 <= nums[i] <= 100

        Notes:
        - This is closely related to subset sum.
        """
        pass

    def min_path_sum(self, grid: list[list[int]]) -> int:
        """
        Problem:
        Given a grid of non-negative numbers,
        find a path from top-left to bottom-right
        which minimizes the sum of all numbers along the path.
        You can only move right or down.

        Inputs:
        grid = [
            [1,3,1],
            [1,5,1],
            [4,2,1]
        ] -> 7

        Constraints:
        1 <= m, n <= 200
        0 <= grid[i][j] <= 100

        Notes:
        - This introduces 2D DP.
        """
        pass
