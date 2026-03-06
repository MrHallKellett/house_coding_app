# Problem 6 - Henry’s Metro 1 (*)

<img src="/static/problems/1metro_1.png" width="300"/>

Henry has decided to go on a trip. Instead of taking his ship, he decided to take the metro.

A line on the metro could look like this:

Henry Home,John Home,Lok Ma Chau

You are given a line, start station and end station. Including the start and end station, print the number of stations that Henry goes through.

## Input Format

The first line consists of a comma separated list of names, representing the stations on the metro line.

The second line consists of a single string, the name of the starting station.

The third line consists of a single string, the name of the ending station.

## Output Format

A single integer, the number of stations that Henry goes through.

## Example 1

### Input:

    Henry Home,Johns Home,Lok Ma Chau
    Henry Home
    Lok Ma Chau

### Output:

    3

## Example 2

### Input:

    A,B,C,D,E
    B
    E

### Output:

    4

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
