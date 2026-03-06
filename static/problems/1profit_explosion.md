# Problem 32 - Profit Explosion (*)

<img src="/static/problems/1profit_explosion.png" width="300"/>

Henry’s been on a roll plundering different ships recently. He notices that the amount of money he plunders increases by a fixed percentage p every time he plunders a new ship.

Please help henry determine how much total money he makes after plundering n ships. 

## Input Format

The first line consists of an integer a - the amount of money Henry plunders from the first ship.

The second line consists of an integer n - the amount of ships he plunders.

The third line consists of an integer p - the percent increase between ships.

## Output Format

A single decimal number t - representing the total amount of money Henry plunders over all the n ships.

Your answer will be considered correct if the absolute or relative error is less than 10^-6

## Example 1

### Input:

    100
    3
    10

### Output:

    331.0

### Explanation:

The amount of money Henry plunders from the three ships are 100, 110, 121, respectively. Therefore, the output is the sum of these three numbers, 331.

## Example 2

### Input:

    15
    123
    7

### Output:

    881236.1044158589

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.