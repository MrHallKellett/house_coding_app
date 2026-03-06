# Problem 34 - Tacking Traversal (**)

<img src="/static/problems/2tacking_traversal.png" width="300"/>

Captain Kellett's ship needs to sail against the wind! When sailing into the wind, ships must "tack" - zigzagging left and right to make progress. You need to help track where the ship ends up after following a series of movement commands.

The ship starts at position (0, 0) on a coordinate grid. You'll receive a series of direction commands:

 U - Move Up (y increases by 1)

 D - Move Down (y decreases by 1)

 L - Move Left (x decreases by 1)

 R - Move Right (x increases by 1)

Your task is to calculate the ship's final position after all movements.

## Input Format

First line: An integer n (the number of movement commands)

Second line: A string of n characters containing only U, D, L, or R

## Output Format

Print two integers separated by a space: the final x-coordinate and y-coordinate.

## Example 1

### Input:

```
5
URRDR
```

### Output:

```
3 0
```

### Explanation:

Starting at (0, 0):

U → (0, 1)

R → (1, 1)

R → (2, 1)

D → (2, 0)

R → (3, 0)

Final position: (3, 0)

## Example 2

### Input:

```
4
UDLR
```

### Output:

```
0 0
```

### Explanation:

The ship moves up then down (cancels out), left then right (cancels out), ending back at the starting position (0, 0).

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
