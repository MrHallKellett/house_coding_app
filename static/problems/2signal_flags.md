# Problem 41 - Signal Flags (**)

<img src="/static/problems/2signal_flags.png" width="300"/>

Captain Kellett uses two signal flags to communicate with other ships! Each flag can be held in one of three positions: UP, MID (middle), or DOWN. Different combinations of positions represent different signals.

Your task is to read flag signals (two positions) until you receive the STOP signal, then output all the decoded signals on separate lines.


Signal Flag Decoding Table

Left Flag

Right Flag

Signal

UP

UP

DANGER

UP

MID

HELP

UP

DOWN

SAFE

MID

UP

NORTH

MID

MID

STOP

MID

DOWN

SOUTH

DOWN

UP

EAST

DOWN

MID

WEST

DOWN

DOWN

ANCHOR

## Input Format

Multiple lines, each containing two strings separated by a space (left flag position, right flag position). Input ends when you decode the signal STOP (which is MID MID).

## Output Format

Print each decoded signal on a separate line. Do not print the STOP signal itself.

## Example 1

### Input:

```
UP UP
UP MID
MID MID
```

### Output:

```
DANGER
HELP
```

### Explanation:

UP UP = DANGER, UP MID = HELP, then MID MID = STOP (which ends transmission but is not printed).

## Example 2

### Input:

```
MID UP
DOWN UP
MID DOWN
DOWN MID
MID MID
```

### Output:

```
NORTH
EAST
SOUTH
WEST
```

### Explanation:

MID UP = NORTH, DOWN UP = EAST, MID DOWN = SOUTH, DOWN MID = WEST, then MID MID = STOP.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.
