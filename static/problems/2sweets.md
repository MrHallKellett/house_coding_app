# Problem 14 - Sweets (**)

<img src="/static/problems/2sweets.jpeg" width="300"/>

Henry is currently at the sweet store trying to buy sweets ready for his next expedition. Each sweet the shop sells costs a certain amount - but alas! Henry cannot buy them all as he only has a certain amount of dollars. Henry is a lover of variety so he will not buy any of the same sweet more than once.

Please help Henry determine the maximum number of sweets he can buy with his money.

## Input Format

First line contains two integer inputs: the number of sweets sold by the shop and the amount of money Henry has to begin with.

The third line contains one integer for every sweet sold (the price of each sweet).

[Values are separated by a single space]

## Output Format

A single value, the maximum number of sweets Henry can buy.

## Example 1

### Input:

    3 2
    1 1 100000

### Output:

    2

### Explanation:

Henry can use the 2 dollars to purchase the first two sweets, it can be shown he can’t buy any more sweets, thus the output is 2.

## Example 2

### Input:

    1 100000
    1

### Output:

    1

### Explanation:

The shop only has one sweet, so Henry can buy the only sweet in the shop, thus the output is 1.

## Example 3

### Input:

    10 14
    5 2 6 3 1 9 3 7 4 2

### Output:

    5

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.