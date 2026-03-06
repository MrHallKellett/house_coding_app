# Problem 29 - Shuffled Socks (*)

<img src="/static/problems/1shuffled_socks.png" width="300"/>

Even though Henry is a pirate, he still needs to dress smartly on some days. Unfortunately one day he found that his sock drawer has been messed with by someone. All but one pair of socks has had one of their socks been removed, and all of the socks have been shuffled. He doesn’t have much time to find the pair that still in the draw, so he asks you for help.

Please help Henry find the pair of socks that’s not missing one sock in the drawer.

## Input Format

The first and only line consists of a string s - the contents of the drawer, where each character represents which pair a sock is in.

The string s is guaranteed to consists of all unique characters, except one duplicate (the intact pair).

## Output Format

A single character, the character representing the pair without a missing sock. 

## Example 1

### Input:

    bab

### Output:

    b

### Explanation:

Both socks in pair b appear in the drawer, therefore b is the output.

## Example 2

### Input:

    aa

### Output:

    a

### Explanation:

There is only one pair of socks in the drawer (pair a), therefore a is the output.

## Example 3

### Input:

    example

### Output:

    e

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.