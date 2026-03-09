# Problem 49 (*) - Fishy Dinner

<img src="/static/problems/1fishy_dinner.jpeg" width="300"/>

Henry is sorting out the fish that have been captured in his net.

He picks a selection of delicious-looking fish for tonight’s dinner, and then prepares a plate of the same fish for every crew member. Henry is a generous chef so he will prepare as many plates as possible. However, he knows that after a while he will get tired of gutting and cleaning fish, so some of his crew members will have to go hungry.

Your task: display the fish that Henry prepares for his crew.

## Input Format

First line: A sequence of characters representing the fish to be served to each crew member.

Second line: The total number of fish that Henry is willing to prepare today.

## Output Format

A sequence of characters representing the fish to be served to all crew members.

## Example 1

### Input:

    🐟
    10

### Output:

    🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟

### Explanation:

Henry makes 10 plates each containing a single fish.

## Example 2

### Input:

    🐙🐟
    6

### Output:

    🐙🐟🐙🐟🐙🐟

### Explanation:

Henry is able to make 3 plates, each containing 2 fish, before he will not gut any more fish today.

## Example 3

### Input:

    🐙🐙🐟
    10

### Output:

    🐙🐙🐟🐙🐙🐟🐙🐙🐟🐙

### Explanation:

Henry makes three plates, each containing three fish, but then reaches his limit. This means the last plate only ends up having one fish.

---

Note: When taking input, do not print any message. For example, input() or input(““) would be fine, but input(“Number: “) or input(“Something“) might fail the tests.

