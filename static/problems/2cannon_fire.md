# Problem 8 - Cannon Fire (**)

<img src="/static/problems/2cannon_fire.png" width="300"/>

Henry Kellett is testing cannon fire at the top of Victoria Peak. He notices that three factors influence the success of his cannonballs: the amount of dynamite used, the strength of the wind, and the amount of rum he has drank today.

When at least 10 sticks of dynamite are used, his cannonballs will not fall into the sea unless one or more of the following facts are true:

today’s wind is above 55 knots

Henry has consumed more than 2.5 bottles of rum.

If less than 10 sticks of dynamite are used and there is no wind at all, the cannonballs will:

reach their target if Henry has drank no rum.

explode at Henry’s feet if he has drank 4 or more bottles of rum.

In any other circumstance, the cannonball will fall into the sea.

## Input Format

Two integers and one float - representing:

a whole number of sticks of dynamite

a whole number of knots (measurement of wind)

a fractional number of bottles of rum drank

## Output Format

The message TARGET! should be printed if the cannon fire is successful.

The message SEA. should be printed if the cannonball falls into the sea.

The message FEET! should be printed if the cannonball explodes at Henry’s feet.

## Example 1

### Input:

```
10
57
2.9
```

### Output:

```
SEA.
```

## Example 2

### Input:

```
10
55
1.0
```

### Output:

```
TARGET!
```

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.