# Problem 28 - Candy Crisis (*)

<img src="/static/problems/1candy_crisis.png" width="300"/>

On Henry’s ship there is a free candy jar, where his crew are allowed to take candy for free at anytime. However, recently Henry notices that the jar has been running out candy really quickly. Therefore he would like to find the culprit behind this candy shortage. He has recorded the number of candy each crew member has taken over the last week, but doesn’t know which crew member has the highest count.

Please help Henry determine which crew member has taken the most candy from the candy jar last week.

## Input Format

The first line consists one integer n - the number of crew members.

The next n lines consists each of one string si, and a positive integer ai - the name of the crew member, and the number of candy they’ve taken over the last week.

## Output Format

A single string, the name of the crew member that has taken the most sweets.

If multiple crew members have taken the most sweets, output any one of them.

## Example 1

### Input:

```
2
Alice 12
Bob 15
```

### Output:

```
Bob
```

## Example 2

### Input:

```
4
Alice 12
Bob 11
Charlie 12
Dave 10
```

### Output:

```
Alice
```

Note:

 Charlie is also a correct output.

## Example 3

### Input:

```
10
Alice 5
Bob 1
Charlie 3
Dave 9
Eve 11
Frank 3
George 16
Harry 8
Iris 8
Jim 10
```

### Output:

```
George
```

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.