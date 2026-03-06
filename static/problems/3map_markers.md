# Problem 37 - Map Markers (***)

<img src="/static/problems/3map_markers.png" width="300"/>

Captain Kellett is a master of cryptography and uses clever encoding systems to hide the location of real treasure from pirates. On his navigation charts, he marks many false treasure locations, but only one is real.


Captain Kellett's system uses parity checking: he ensures that every row and column has an even number of treasure markers (T), except for the row and column containing the real treasure, which have an odd number.

Your task is to find the coordinates of the real treasure by identifying which row has an odd count of T markers and which column has an odd count. The intersection of that row and column is where the real treasure is located.

## Input Format

First line: Two integers rows and cols (the dimensions of the map)

Next rows lines: Each line contains cols characters representing the map

Map contains: 
T (treasure marker)

. (empty ocean) 

# (obstacles)

## Output Format

Two integers separated by a space: row col (0-indexed coordinates of the real treasure)

## Example 1

### Input:

```
4 4
T.T.
....
..T.
T.T.
```

### Output:

```
2 2
```

### Explanation:

Count treasures in each row:

Row 0: 2 treasures (even)

Row 1: 0 treasures (even)

Row 2: 1 treasure (odd) ✓

Row 3: 2 treasures (even)

Count treasures in each column:

Col 0: 2 treasures (even)

Col 1: 0 treasures (even)

Col 2: 3 treasures (odd) ✓

Col 3: 0 treasures (even)

The row with odd count is row 2, and the column with odd count is column 2. The real treasure is at position (2, 2).

## Example 2

### Input:

```
3 4
T..T
T...
T..T
```

### Output:

```
1 0
```

### Explanation:

Count treasures in each row:

Row 0: 2 treasures (even)

Row 1: 1 treasure (odd) ✓

Row 2: 2 treasures (even)

Count treasures in each column:

Col 0: 3 treasures (odd) ✓

Col 1: 0 treasures (even)

Col 2: 0 treasures (even)

Col 3: 2 treasures (even)

The real treasure is at the intersection: row 1, column 0.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
