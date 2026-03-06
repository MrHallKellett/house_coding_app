# Problem 22 - Wartime Shipping 2 (***)

<img src="/static/problems/3war_time_shipping_2.png" width="300"/>

As time went on, the admiralty’s encoding method got cracked! Desperately, they searched through their archive for a new method and found the Vigenere Cipher! The keyword will change depending on the day of the week but it will always be a five letter word.

Monday: ships

Tuesday: henry
Wednesday: salty

Thursday: bilge

Friday: naval

Saturday: ahoys

Sunday: stern

The first two letters of the encrypted text will be the day.

Decrypt the text!

NOTE: HOW THE VIGENERE CIPHER WORKS

## Input Format

Lowercase string. Punctuations and spaces should not advance key index since they shouldn’t be encoded.

## Output Format

Lowercase string

## Example 1

### Input:

    tuhxgrar mzdguiak

### Output:

    h

### Explanation:

    Prefix tu shows it is a Tuesday, therefore key used is “henry”

## Example 2

### Input:

    thxppxi eqo o tbzv sc tptv?

### Output:

    where did i park my ship?

### Explanation:

Prefix th shows it is a Thursday, therefore key used is “bilge”

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
