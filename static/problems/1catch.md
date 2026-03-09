# Problem 50 - Catch (*)

<img src="/static/problems/1catch.jpeg" width="300"/>

Henry has caught some new fish! He now wants to find out how long he can feed his crew with the new fish. He knows that there are 39 types of fish in this catch, and that the ith type of fish can be used to cook i meals.

Please help Henry calculate how many meals that can be cooked with this catch.

## Input Format

39 lines,

The ith line consists of a single non-negative integer - the number of fish of type i.

## Output Format

A single integer, the number of meals that can be cooked.

## Example 1

### Input:

    0
    1
    1
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0

### Output:

    4

### Explanation:

Henry has 1 fish of type 2, and 1 fish of type 3, so the total number of meals that can be cooked is 2 + 3 = 5.

## Example 2

### Input:

    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0
    0

### Output:

    0

### Explanation:

Henry has caught no fish, so he can’t cook any meals.

## Example 3

### Input:

    8
    1
    5
    6
    6
    4
    5
    0
    9
    7
    0
    7
    4
    5
    7
    8
    7
    0
    2
    4
    6
    5
    0
    0
    2
    1
    2
    9
    9
    6
    6
    2
    7
    3
    9
    8
    1
    7
    9
`
### Output:

    3864

---

**Note**: When taking input, do not print any message. For example, input() or input(““) would be fine, but input(“Number: “) or input(“Something“) might fail the tests.

