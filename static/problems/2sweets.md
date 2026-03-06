# Problem 14 - Sweets (**)

<img src="/static/problems/2sweets.jpeg" width="300"/>

Henry really likes sweets, so before his next expedition he need to stock up on some more sweets. He is currently at the sweet store trying to buy sweets. Unfortunately he only has d dollars. The shop currently has n sweets on sale, and each sweet costs ai dollars. (Note that the shop only has one of each sweet, so he can not buy the same sweet twice.)

Please help Henry determine the maximum number of sweets he can buy with his money.

## Input Format

The first line consists two integers n and d - the number of sweets and the amount of money Henry has initially.

The second line consists of n integers a1, a2, a3, ..., an - the costs of each sweet individually.

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