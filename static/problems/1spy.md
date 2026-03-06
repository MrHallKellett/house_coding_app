# Problem 30 - Spy (*)

<img src="/static/problems/1spy.png" width="300"/>

Henry has recently been told that there might be a spy from a rival pirate ship. To find this spy, he has lined up all of his crew for inspection. Luckily, he knows that each crew member has been given a hat of a special colour that the spy does’t have. Therefore, the spy (if any) will be wearing a hat of a different colour.

Please help Henry determine there is a spy in his ship.

## Input Format

The first and only line consists of a string s - the crew lineup, where each character represents the colour of the hat said crew member is wearing.

The character in string s will all be the same with at most one exception.

## Output Format

Either the string No spy, or Spy!! depending on if there is a spy on Henry’s ship.

## Example 1

### Input:

```
aab
```

### Output:

```
Spy!!
```

### Explanation:
The third crew member has a hat of colour b, which doesn’t match the hat colours of the rest of the crew. Therefore, there is a spy on the ship.

## Example 2

### Input:

```
a
```

### Output:

```
No spy
```

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.