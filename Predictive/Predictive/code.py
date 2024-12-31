# You are given a large barfi, which can be divided into n
#  pieces, each weighing a1,a2,…,an
# . You need to distribute these pieces among k
#  people such that:

# Each person receives contiguous pieces of the barfi.
# No piece is left undistributed.
# Let wi
#  be the total weight of the pieces received by the i
# -th person. Define minShare as the minimum among the total weights each person receives, i.e., min(w1,w2,…,wk)
# .

# Your task is to determine the maximum possible value of minShare when distributing the barfi pieces optimally.

# Input
# The first line contains two integers n
#  and k
#  (1≤k≤n≤105)
#  — the number of pieces and the number of people.
# The second line contains n
#  integers a1,a2,…,an
#  (1≤ai≤104)
#  — the weights of the barfi pieces.
# Output
# Output a single integer — the maximum possible value of minShare.

# Examples
# Input
# 5 2
# 4 3 5 6 2
# Output
# 8
# Input
# 8 3
# 6 2 876 221 123 43 33 21
# Output
# 220
# Note
# Here, the weights of the barfi pieces are [4,3,5,6,2]
#  and k=2
# . We need to divide the pieces between 2 people such that each person receives contiguous pieces, and we maximize the minimum total weight received by either person.

# The possible distributions and their corresponding sums are:

# Person 1: [4]
# , Person 2: [3,5,6,2]
#  — sums: 4
#  and 16
# Person 1: [4,3]
# , Person 2: [5,6,2]
#  — sums: 7
#  and 13
# Person 1: [4,3,5]
# , Person 2: [6,2]
#  — sums: 12
#  and 8
# Person 1: [4,3,5,6]
# , Person 2: [2]
#  — sums: 18
#  and 2
# Among all these possibilities, the configuration that maximizes the minimum share is [4,3,5]
#  for Person 1 and [6,2]
#  for Person 2, where the minimum total is 8
# . Thus, the answer is 8
# .

# In the second example, the maximum possible value of minShare is 220
# . One possible distribution is [6,2,876]


def can_distribute(a, k, min_share):
    count = 0
    current_sum = 0
    for piece in a:
        current_sum += piece
        if current_sum >= min_share:
            count += 1
            current_sum = 0
    return count >= k

def max_min_share(n, k, a):
    left, right = min(a), sum(a)
    while left <= right:
        mid = (left + right) // 2
        if can_distribute(a, k, mid):
            left = mid + 1
        else:
            right = mid - 1
    return right

n, k = map(int, input().split())
a = list(map(int, input().split()))
result = max_min_share(n, k, a)
print(result)
