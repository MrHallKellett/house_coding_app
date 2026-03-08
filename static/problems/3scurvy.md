# Problem 13 - Scurvy (***)

<img src="/static/problems/3scurvy.png" width="300"/>

Henry Kellett’s naval fleet is far away when a number of his sailors contract SCURVY. Henry consults Nurse Justin, who tells him that vitamin C is the ultimate cure for scurvy!!!

The crew give him a list of fruit orders that he will need to buy from the nearest island shop. Thankfully, the shop stocks 100 oranges, 100 lemons, 50 grapefruit and 50 pomelos every day.

The shop processes each order one-by-one. Each order reduces the number of a specific fruit the shop has in stock. As soon as the shop cannot fulfil an order, they close for the day. (Note: as his crew are almost all very sick, the shop is likely to close before the orders are finished.)

How many pieces of fruit will be purchased before the shop closes?

## Input Format

Input format for each order:

    name of a fruit
    number of fruit needed

## Output Format

A single integer, representing the total number of pieces of fruit that were sold today.

## Example 1

### Input:

    POMELOS
    17
    ORANGES
    50
    ORANGES
    50
    LEMONS
    10
    POMELOS
    35

### Output:

    127

### Explanation:

17 pomelos are purchased (33 remain)

50 oranges are purchased (50 remain)

50 oranges are purchased (0 remain)

10 lemons are purchased (90 remain)

35 pomelos cannot be purchased, so the shop closes.

17 + 50 + 50 + 10 = 127 pieces of fruit were purchased today.

## Example 2

### Input:

    LEMONS
    1
    LEMONS
    2
    LEMONS
    3
    ORANGES
    2000
    POMELOS
    39
    GRAPEFRUIT
    18

### Output:

    6

### Explanation:

1 lemon is purchased (99 remain)

2 lemons are purchased (97 remain)

3 lemons are purchased (94 remain)

2000 oranges cannot be purchased, so the shop closes.

1 + 2 + 3 = 6 pieces of fruit were purchased today.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.