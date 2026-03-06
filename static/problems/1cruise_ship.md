# Problem 23 - Cruise Trip (*)

<img src="/static/problems/1cruise_ship.png" width="300"/>

After a year of hard work, Henry is trying to find the best cruises to relax for a bit. However, being a commander who follows the three ideas of Kindness, Respect and Integrity, he decides to book the cruises for all the sailors.

However, since Henry doesn’t want to spend too much money on the trip, he will try to minimise the cost of the trip.

You are given the prices are:

Hong Kong Lines: $150/adult, $100/child, $50/luggage

Gold Ship: $100/adult, $150/child, $125/luggage

International Cruises: $100/adult, $50/child, $150/luggage

## Input Format

Three lines of positive integers.

The first line represents the number of adults.

The second line represents the number of children

The third line represents the number of luggage.

## Output Format

A single string, depending on which one is cheaper:

Hong Kong Lines is the best option!
Gold Ship is the best option!

International Cruises is the best option!

If multiple cruises are cheapest, any one of them would be considered correct.

## Example 1

### Input:

    3
    2
    1

### Output:

    International Cruises is the best option!

### Explanation:

The costs for each cruise are:

Hong Kong Lines: 3 × $150 + 2 × $100 + 1 × $50 = $700

Gold Ship: 3 × $100 + 2 × $150 + 1 × $125 = $725

International Cruises: 3 × $100 + 2 × $50 + 1 × $150 = $550 

Therefore the cheapest cruise is International Cruises.

## Example 2

### Input:

    1
    3
    6

### Output:

    Hong Kong Lines is the best option!

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.