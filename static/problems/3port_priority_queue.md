# Problem 36 - Port Priority Queue (***)

<img src="/static/problems/3port_priority_queue.png" width="300"/>

Captain Kellett's ship has arrived at port and the sailors need to disembark! However, they must leave the ship in order of their rank, with higher ranks leaving first.

Each sailor has a name and a rank number. Lower rank numbers mean higher priority (rank 1 is the highest, rank 2 is second highest, etc.).

Your task is to sort the sailors by their rank and print their names in the order they should disembark.

## Input Format

First line: An integer n (the number of sailors)

Next n lines: Each line contains a sailor's name (a string) and their rank (an integer), separated by a space

## Output Format

Print the names of the sailors, one per line, in order of their rank (lowest rank number first).

If two sailors have the same rank, maintain their original order from the input.

## Example 1

### Input:

    4
    Smith 3
    Jones 1
    Brown 2
    Wilson 4

### Output:

    Jones
    Brown
    Smith
    Wilson

### Explanation:

Sorted by rank: Jones (1), Brown (2), Smith (3), Wilson (4)

## Example 2

### Input:

    3
    Taylor 2
    Davis 3
    Miller 1

### Output:

    Miller
    Taylor
    Davis

### Explanation:

Miller has rank 1 (highest priority) so is moved first. Taylor (2) and Davis (3) maintain their original order.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
