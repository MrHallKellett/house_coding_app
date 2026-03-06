# Problem 10 - Kraken (**)

<img src="/static/problems/2kraken.png" width="300"/>

Henry Kellett is searching for the Kraken. He receives a coded message from his fellow sailor (your input).

If all the letters K R A K E N - in this order - are found in the message, KRAKEN AHOY! should be printed .

If the letters are not found, WHERE IS KRAKEN? should be printed instead.

(Un)fortunately he did not pay attention to Mr. McMahon’s extensive feedback so he does not care about whether the letters are CAPITAL or lowercase.

## Input Format

A single string, the coded message.

## Output Format

A single string, either KRAKEN AHOY or WHERE IS KRAKEN?.

## Example 1

### Input:

```
KELLYROWEDAAWAYKINDLYENJOY
```

### Output:

```
KRAKEN AHOY!
```

### Explanation:

The 1st, 6th, 11th, 16th, 22nd, 23rd characters of the message form the letters KRAKEN, therefore the all the letters are present, thus the output is KRAKEN AHOY.

## Example 2

### Input:

```
O
```

### Output:

```
WHERE IS KRAKEN?
```

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.