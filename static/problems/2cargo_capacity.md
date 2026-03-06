# Problem 39 - Cargo Capacity (**)

<img src="/static/problems/2cargo_capacity.png" width="300"/>

Captain Kellett needs to load rectangular crates onto his ship's cargo hold floor. The hold has a fixed width and depth, and each crate has its own dimensions when viewed from above. Crates can be rotated 90 degrees if needed.


Before attempting the complex task of arranging the crates, Captain Kellett wants to know if the cargo is potentially packable - that is, whether it's worth attempting to pack them at all, or if it's obviously impossible.


Note: You do NOT need to figure out the actual arrangement of crates. You only need to check if the total area of all crates fits within the hold's floor area, along with other basic feasibility checks.


Your task is to determine if the cargo passes Captain Kellett's feasibility checks. Crates cannot be stacked on top of each other - they must all fit on the same level. Crates can also not be stood on end, their longest edge must make contact with the ground.

## Input Format

First line: Two integers hold_width and hold_depth (dimensions of the cargo hold)

Second line: An integer n (number of crates)

Next n lines: Two integers width and depth for each crate

## Output Format

Print YES if all crates could potentially fit in the hold, otherwise print NO.

## Example 1

### Input:

    10 10
    3 
    2 3
    4 2
    3 3

### Output:

    YES

### Explanation:

Hold floor is 10 × 10 (area = 100). Crates: 2 × 3 (area=6), 4 × 2 (area=8), 3 × 3 (area=9). Total area = 23. Since total area ≤ hold area, it's possible to fit them.

## Example 2

### Input:

    5 5
    2
    6 3
    4 4

### Output:

    NO

### Explanation:

Hold floor is 5 × 5 (area = 25). Crate 1 is 6 × 3 (area=18) - width exceeds hold width even when rotated (3 × 6 still has dimension 6 > 5). Cannot fit.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
