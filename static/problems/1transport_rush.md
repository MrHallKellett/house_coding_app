# Problem 11 - Transport Rush

<img src="/static/problems/1transport_rush.jpg" width="300"/>

Henry Kellett is transporting goods from one place to another. He needs you to help him program a calculator to check how much it’ll cost him to transport it!

Every single piece of luggage costs $40 to transport per day.

Every crew member costs $10 to feed per day.

## Input Format

Three lines of input, all positive integers.

The first line represents the number of crew (not including Henry himself).

The second line represents the number of pieces of luggage.

The third line represents the number of days of the trip.

## Output Format

A single integer, the total cost of the trip.

## Example 1

### Input:

    3
    2
    1

### Output:

    120

### Explanation:

1 day * (4 crew members (3 crew + Henry himself!) + 2 goods * 40)

1 × (4 × 10 + 2 × 40) = $120

## Example 2

### Input:

    1
    2
    3

### Output:

    300

### Explanation:

3 days * (2 crew members (1 crew + Henry himself!) + 2 goods * 40)

3 × (2 × 10 + 2 × 40) = 300

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.