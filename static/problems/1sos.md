# Problem 20 - SOS (*)

<img src="/static/problems/1sos.jpg" width="300"/>

Henry Kellett is in a storm, he has some information about the wave in front of him. He knows his ship cannot overcome waves with a diagonal length above 1105m, so he consults the admiralty and tells them to calculate whether he can pass through the wave or not. The admiralty decides by calculating the length of the hypotenuse of the wave to see if the ship has enough energy to pass through it.

## Input Format

First line: An integer representing the base length of the wave.

Second line: An integer representing the height of the wave.

## Output Format

`Pass` if length is positive and lower than 1105, `No Pass` otherwise.

## Example 1

### Input:

    300
    400

### Output:

    Pass

### Explanation:

The length of the hypotenuse of the wave is sqrt(300² + 400²) = 500, which is strictly less than 1105, so the output is `Pass`.

## Example 2

### Input:

    1200
    500

### Output:

    No Pass

### Explanation:

The length of the hypotenuse of the wave is sqrt(1200² + 500²) = 1300, which is at least 1105, so the output is `No Pass`.

## Example 3

### Input:

    576
    943

### Output:

    No Pass

### Explanation:

The length of the hypotenuse of the wave is sqrt(576² + 943²) = 1105, which is exactly 1105, so the output is `No Pass`.

---

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.