# Problem 27 - Lunch (*)

<img src="/static/problems/1lunch.png" width="300"/>

Henry’s ship operates on a policy that his crew (when docked) is allowed to leave the ship for lunch. However, they are only allowed to leave on or after 12:30. However some of the crew have been leaving early.

Please help Henry determine if his crew has been leaving early for lunch.

## Input Format

The first line consists one integer h - the hour that the crew member leaves

The second line consists of one integer m - the minute that the crew member leaves.

## Output Format

A single string, Allowed or Not Allowed representing if the crew member is allowed to leave the ship at this  time.

## Example 1

### Input:

    14
    13

### Output:

    3

### Explanation:

The crew member leaves at 14:13, which is after 12:30, making it allowed.

## Example 2

### Input:

    12
    30

### Output:

    Allowed

### Explanation:

The crew member leaves at exactly 12:30, which is still allowed.

## Example 3

### Input:

    12
    20

### Output:

    Not Allowed

### Explanation:

The crew member leaves at 12:20, which is before 12:20, so it is not allowed.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.