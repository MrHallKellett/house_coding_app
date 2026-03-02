## Problem 25 - Falling Profits (*) 

After folding up his map, Henry starts checking how much profit he’s made over that last few years until he realises (to shock horror) that the amount of money he profits from plundering every year sometimes decreases. This is unacceptable for him, so he asks you to count the number of times this has happened.

Please help Henry count the number of times his yearly profit decreases.

## Input

The first line consists of a single positive integer n - the number of years of records he has.

The second line consists of n positive integers a1, a2, …, an - where the i th integer represents the amount of profit he made during the i th year.

## Output

A single positive integer - The number of times the amount of profit decreased.

## Examples

### No. 1

#### Input:

3
1 3 2

### Output:

3

No. 2

Input:

1
3

Output:

1

No. 3

Input:

8
1 6 3 2 5 7 4 8

Output:

1

## Note

In the first test, the only time profits decreased is during the second and third years. Therefore the output is 1.

In the second test, since there is only 1 year to compare, profits have never decreased or increased. Therefore the output is 0.