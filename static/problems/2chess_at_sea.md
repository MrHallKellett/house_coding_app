# Problem 48 (*) - Chess At Sea

<img src="/static/problems/1chess_at_sea.jpeg" width="300"/>

Henry’s crew are playing board games at sea. They are being resourceful: as they don’t have a chessboard with them, they are using any old bits of marine waste they can find instead of an actual chessboard.

Given two types of sea waste and the dimensions needed, can you help Henry and his crew create the board for their game?

## Input Format

First line: A single character - to be used for the white squares on the board.

Second line: A single character - to be used for the black squares on the board.

Third line: The dimensions of the board needed. Note: the board will always be a square.

## Output Format

A correctly sized board, made up of alternating squares using characters taken from the input.

## Example 1

### Input:

    %
    ?
    3

### Output:

    %?%
    ?%?
    %?%

## Example 2

### Input:

    🐙
    🐟
    10

### Output:

    🐙🐟🐙🐟🐙🐟🐙🐟🐙🐟
    🐟🐙🐟🐙🐟🐙🐟🐙🐟🐙
    🐙🐟🐙🐟🐙🐟🐙🐟🐙🐟
    🐟🐙🐟🐙🐟🐙🐟🐙🐟🐙
    🐙🐟🐙🐟🐙🐟🐙🐟🐙🐟
    🐟🐙🐟🐙🐟🐙🐟🐙🐟🐙
    🐙🐟🐙🐟🐙🐟🐙🐟🐙🐟
    🐟🐙🐟🐙🐟🐙🐟🐙🐟🐙
    🐙🐟🐙🐟🐙🐟🐙🐟🐙🐟
    🐟🐙🐟🐙🐟🐙🐟🐙🐟🐙

---

Note: When taking input, do not print any message. For example, input() or input(““) would be fine, but input(“Number: “) or input(“Something“) might fail the tests.

