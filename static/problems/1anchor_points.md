# Problem 35 - Anchor Points (*)

<img src="/static/problems/1anchor_points.png" width="300"/>

Captain Kellett needs to find the best place to drop anchor! 

He has surveyed several potential anchoring locations and recorded their coordinates. To find the central position that minimizes the distance to all locations, he needs to calculate the average (mean) position.

Given a list of coordinate points, calculate the average x-coordinate and average y-coordinate. This will be the optimal anchor point.

## Input Format

First line: An integer n (the number of coordinate points)

Next n lines: Each line contains two integers x and y representing a coordinate point

## Output Format

Print two decimal numbers separated by a space: the average x-coordinate and average y-coordinate.

If the result is a decimal, round to 2 decimal places.

## Example 1

### Input:


    3
    0 0
    6 0
    3 6


### Output:


    3.0 2.0


### Explanation:

Average x = (0 + 6 + 3) / 3 = 9 / 3 = 3.0

Average y = (0 + 0 + 6) / 3 = 6 / 3 = 2.0

The optimal anchor point is at (3.0, 2.0).

## Example 2

### Input:

    4
    2 2
    4 4
    6 6
    8 8

### Output:

    5.0 5.0

### Explanation:

Average x = (2 + 4 + 6 + 8) / 4 = 20 / 4 = 5.0

Average y = (2 + 4 + 6 + 8) / 4 = 20 / 4 = 5.0

The optimal anchor point is at (5.0, 5.0).

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
