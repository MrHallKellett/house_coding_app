# Problem 42 - Ration Distribution (**)

<img src="/static/problems/2ration_distribution.png" width="300"/>

Captain Kellett needs to distribute food rations fairly among the crew! The ship has a certain number of ration packs, and they must be divided equally among all crew members.

Your task is to calculate how many ration packs each crew member receives, and how many packs are left over.

## Input Format

Two integers on a single line separated by a space:

First integer: number of ration packs

Second integer: number of crew members

## Output Format

Print two integers on a single line separated by a space:

First integer: ration packs per crew member

Second integer: leftover ration packs

## Example 1

### Input:

    17 5

### Output:

    3 2

### Explanation:

17 ration packs divided among 5 crew members. Each crew member gets 3 packs (5 × 3 = 15), with 2 packs left over (17 - 15 = 2).

## Example 2

### Input:

    24 6

### Output:

    4 0

### Explanation:

24 ration packs divided among 6 crew members. Each crew member gets exactly 4 packs (6 × 4 = 24), with 0 packs left over.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
