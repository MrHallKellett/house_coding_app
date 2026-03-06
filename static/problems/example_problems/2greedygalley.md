Example Round 2 Problem B - Greedy Galley (**)

One of the crew members is being very greedy! They would like to eat at least k calories worth of food. To prevent getting caught they would like to eat as few items as possible.

Please help them find the minimum number of food items that need to be eaten to teach the target.

Input Format

First line: Two integers n (number of food items) and target (minimum calorie target)

Second line: n integers separated by spaces, representing the calorie value of each food item

Output Format

A single integer, the minimum number of food items that need to be included to reach or exceed the calorie target. If it’s impossible to reach the calorie target, then print -1.

Example 1

Input:

5 20
8 3 7 2 5

Output:

3

Explanation:

Add items: 5 + 7 + 8 = 20 (target)

Total items: 3

Example 2

Input:

4 10
5 5 5 5

Output:

2

Explanation:

All items have 5 calories each.

Add items: 5 + 5 = 10 (exactly at limit)

Cannot remove more without becoming under target.

Total items: 2

Note: When taking input, do not print any message. For example, input() or input(““) would be fine, but input(“Number: “) or input(“Something“) might fail the tests.

