# Problem 21 - Wartime Shipping 1 (**) 

<img src="/static/problems/2wartime_shipping_1.png" width="300"/>

Henry Kellett receives a encrypted message from the admiralty. Before departing, they told Henry Kellett they would be using the Caesar Cipher. Code a device for Henry Kellett to use to decipher the message.

The Caesar Cipher replacing each character in the plaintext with the character that’s a certain number of places forward in the alphabet, wrapping around the end of the alphabet if necessary. 

## Input Format

The first line consists of two characters, representing one possible character of the plaintext, and one character of the corresponding ciphertext.

The next line consists of a single string, representing the ciphertext.

## Output Format

A single lowercase string, the plaintext.

## Example 1

### Input:

    a h
    haahjr avtvyyvd

### Output:

    attack tomorrow

### Explanation:

The first line represents that a was shifted to h during the encryption.

To shift a to h, the encryption shifted all characters 7 places forward. Therefore, if we shift everything backwards by 7 we will get our decrypted text.

## Example 2

### Input:

    a x
    pefmp xelv

### Output:

    ships ahoy

### Explanation:

The first two characters represents that a was shifted to x during the encryption.

To shift a to x, the encryption shifted all characters 23 places forward. Therefore, if we shift everything backwards by 23 places we will get our decrypted text.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
