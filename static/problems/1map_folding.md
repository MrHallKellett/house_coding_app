# Problem 24 - Map Folding (*)

<img src="/static/problems/1map_folding.png" width="300"/>

After another successful expedition Henry needs to fold his map back together. His map is a 1 x n tape of cells, and he only knows how to fold the map perfectly in half. Henry doesn’t have a lot of space to place the map, and thus will try to fold the map as many times in half as possible until he can no longer fold it in half anymore.

Please help Henry determine the width of the final folded map.

## Input Format

A single positive integer n - the width of the initial map.

## Output Format

A single positive integer - the width of the folded map.

## Example 1

### Input:

```
12
```

### Output:

```
3
```

### Explanation:

The map can only be folded twice. After which it’s width is 12 / 4 = 3, an odd number, so it can no longer be folded in half anymore. Therefore the output is 3.

## Example 2

### Input:

```
16
```

### Output:

```
1
```

### Explanation:

The map can be folded four times.

## Example 3

### Input:

```
1
```

### Output:

```
1
```

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.