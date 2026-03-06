# Problem 26 - Cubic Treasure (*)

<img src="/static/problems/1cubic_treasure.png" width="300"/>

After a long journey Henry reaches the mythical city of Cubes. This city is famous for containing cubes of gold that only the best pirates can find. Lucky, Henry is a world class pirate, so he has made his way to the vault of the city. He realises the treasure is all in the form of cubes of diffrent side length, consisting of a precious metal of density d g/cm³. He wonders if he is strong enough to carry all the treasure out at once.

Please help Henry determine the total mass of all the cubic treasures.

## Input Format

The first line consists of two positive integers, n, d - representing the number of cubes and the density of each cube (in g/cm³) respectively.

The second line consists of n positive integers s1, s2, …, sn, where the i th number represents the side length of the i th cube in cm.

## Output Format

A single positive integer - The total mass of all the cubes in grams.

## Example 1

### Input:

    3 4
    1 2 3 

### Output:

    144

### Explanation:

The cubes have volumes of (1 cm)³ = 1 cm², (2 cm)³ = 8 cm³, (3 cm)³ = 27 cm².

Thus multiplying by the density of 4 g/cm³ gives masses of 1 cm³ x 4 g/cm³ = 4 g, 8 cm³ x 4 g/cm³ = 32 g, 27 cm³ x 4 g/cm³ = 108 g, respectively.

Therefore the total mass is 4 g + 32 g + 108 g = 144 g, making the output 144.

## Example 2

### Input:

    6 8
    4 2 8 11 7 6

### Output:

    19792

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.