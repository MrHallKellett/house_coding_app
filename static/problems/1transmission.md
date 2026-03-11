# Problem 51 - Transmission (*)

<img src="/static/problems/1transmission.jpeg" width="300"/>

Henry’s crew members are missing their family members. Henry, being such a kind captain allows each crew member to send a message back home. He receives 17 messages from his crew members to send back home. However, since sending messages while on a boat is very expensive, Henry would like to know the total length of these 17 messages.

Please help Henry find the total length of these 17 messages.

## Input Format

17 lines,

The ith line consists of a single string - the message the ith crew member wants to send.

## Output Format

A single integer, the total length of the strings.

## Example 0

### Input:

    a short
    message














    .

### Output:

    15

### Explanation:

The first two lines each contain 7 characters, and the final line contains a single character. The other 14 lines are empty, therefore do not affect the total, which is 15.

## Example 1

### Input:

This
is
an example
message
which
does not
have
very
much
meaning
henry
is not
holding
everyone
captive
we
promise

### Output:

97

### Explanation:

The lengths of each message are 4, 2, 10, 7, 5, 8, 4, 4, 4, 7, 5, 6, 7, 8, 7, 2, 7 respectively. Thus total length is 97.

## Example 2

### Input:

Nee onna no ko ni naritai
Onegai ii desu ka?
Chokoreeto no mori wo kuguru
Orenji kabocha no basha ni
Noserarete tsurerarete
Miruku iro no oshiro
Minna kitto akogareteiru
Douwa no naka no hiroin
Itsuka mita yume ni mita
Garasu no hai hiiru
Naisho no kimochi honto no kimochi
Chotto hanashichaou
Wan tsuu surii mahou wo kakete
Atarashii boku ni naritai no desu onegai!
Yappari boku mo kawaiku naritai na
Ano ko mitaku kawaiku naritai na
Furiru doresu wo meshimase

### Output:

445

---

**Note**: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.

