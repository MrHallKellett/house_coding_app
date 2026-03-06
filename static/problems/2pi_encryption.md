# Problem 9 - Pi Encryption (**)

<img src="/static/problems/2pi_encryption.png" width="300"/>

Henry is trying to bake a pie for his friends birthday. However, to do this he needs help from his friend John. His plan is to send John some coded messages, so he can coordinate the party, but Henry would need a program to encrypt his message. Because John unfortunately did not take IGCSE Computer Science he has no idea on how to program this. Help John encrypt the file with the the following conditions.

Details of how to encrypt the file:

Offset each character by the current digit of π. The first character will be offset by 3, the second by 1, the third by 4 and so on.

Once the digits of π provided (16 of them) run out restart at the front.

The alphabet does not need to wrap around. 

“z” offset by 1 is not “a” it’s “{“

## Input Format

One string of any length (lower and uppercase).

## Output Format

One encoded string, uppercase, lowercase, and symbols. 

## Example 1

### Input:

```
Hello
```

### Output:

```
Kfpmt
```

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.