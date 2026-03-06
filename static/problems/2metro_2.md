# Problem 7 - Henry’s Metro 2 (**)

<img src="/static/problems/2metro_2.png" width="300"/>

Henry’s Metro system obtained a upgrade. Now, there are 2 lines, which could have intersections.

2 lines on the metro could look like this:

A B C D E F G
H I B J K A

Henry starts on a given station and wants to go to an end station. State whether it is possible to go to the end station.

## Input Format

The first line contains the name of the start station.

The second line contains the name of the end station.

The third line contains the stations in the first metro line.

The fourth line contains the stations in the second metro line.

## Output Format

Print “Y” if it is possible to go to the end station. Otherwise, print “N”.

## Example 1

### Input:

    A
    E
    A B C D E F G
    H I B J K A

### Output:

    Y

### Explanation:

You can start on the first line and go directly to the 5th station.

## Example 2

### Input:

    A
    E
    A B C
    D E F

### Output:

    N

### Explanation:

There is no way to reach the end station.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.