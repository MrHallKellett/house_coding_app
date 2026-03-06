# Problem 33 - Arctic Pathfinding (**)

<img src="/static/problems/2arctic_pathfinding.png" width="300"/>

Captain Kellett is navigating through Arctic waters filled with dangerous icebergs! He needs your help to count how many icebergs are in the area so he can report back to the Admiralty.


You are given a grid representing the Arctic waters where:

. represents open water

X represents an iceberg

S represents the ship's position


Your task is to count the total number of icebergs (X) in the grid.

## Input Format

First line: An integer, number of rows

Next rows lines: Each subsequent line contains a string of the following characters

## Output Format

Print a single integer: the total number of icebergs in the grid.

## Example 1

### Input:

    5
    S...X
    .X..X
    ....X
    X....
    ...X.

### Output:

    6

### Explanation:

There are 6 icebergs (X) in the grid.

## Example 2

### Input:

    3
    S...
    ....
    ....

### Output:

    O

### Explanation:

There are no icebergs in this area - it's clear sailing!

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
