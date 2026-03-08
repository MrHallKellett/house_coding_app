# Problem 15 - Plants (*)

<img src="/static/problems/1plants.jpeg" width="300"/>

Henry is growing some plants to take on his next expedition, he currently has `n` plants growing in his garden. He is worried that after some time the plants he has will grow out of their pots and cause chaos. Henry knows the current size si of each plant, and how much they will grow every day, ri. Henry has planted the plants in pots that can fit a plant of at most size k. If a plant exceeds the size of the pot it’s in, then the pot will break, causing Henry to be severely annoyed.

Please help Henry determine how many days he has until one of the pots break.

## Input Format

The first line consists two integers n and k - the number of plants and the capacity of each pot.

The next n lines each consists two integers, si and ri - the initial size of plant i and the amount the plant grows by.

## Output Format

The number of days until at least one plant out grows the size of its pot.

## Example 1

### Input:

    3 5
    1 2
    3 1
    1 1

### Output:

    2

### Explanation:

The plants have sizes of 1, 3, 1 initially.

Then after the first day, the plants grow by sizes of 2, 1, 1 respectively.

Causing their sizes to becomes 3, 4, 2. Which all have sizes less than the capacity of 5

After the second day, the plant’s sizes are 5, 5, 3. Which is still fine, as none of them have exceeded a size of 5 yet.

However on the third day both the first and second plant exceed the capacity of 5 (7, 6 respectively), causing the pots to break.

Therefore the answer is 2, as no pots are broken after the first two days.

## Example 2

### Input:

    3 5
    4 2
    3 1
    1 1

### Output:

0

### Explanation:

The plants have sizes of 4, 3, 1 initially.

But after the first day, the first plant already have a size of 6 = (4 + 2), which causes the pot to break.

Therefore the answer is 0, as not even a single day has passed until a pot is broken.

## Example 3

### Input:

    3 100
    87 1
    24 4
    1 6

### Output:

    13

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.