# Problem 19 - Ship Painting (***)

<img src="/static/problems/3ship_painting.jpeg" width="300"/>

Ena is currently drawing Henry’s ship on a canvas. The canvas is a square grid of cells. She draws in a very peculiar way, where she only draws rectangles onto the canvas. She has come up with a list of rectangles she wants to draw onto the canvas, but she wants to know what the final design will look like first.

She tells you that each rectangle she is planning to draw can be specified by 4 numbers. The x-coordinate of the left and right of the rectangle, and the y-coordinate of the top and bottom of the rectangle. (Note that the top left of the canvas has coordinate (0, 0), and the bottom right of the canvas has width (n - 1, n - 1), where n is the width of the canvas.)

Please help Ena determine what her drawing will look like after all the rectangles are painted.

## Input Format

The first line consists of two integers n, k - the side length of the canvas, and the number of rectangles she wants to draw.

The next k lines each consist of four integers li, ri, ui, di - the boundaries of each rectangle.

## Output Format

The finished design, where . represents unpainted cells, and # represents painted cells.

## Example 1

### Input:

    3 2
    0 1 0 1
    2 2 2 2

### Output:

    ##.
    ##.
    ..#

### Explanation:

In the first test, after the first rectangle is painted, the canvas looks like this:

    ##.
    ##.
    ...

## Example 2

### Input:

    4 2
    0 2 0 1
    2 3 1 3

### Output:

    ###.
    ####
    ..##
    ..##

### Explanation:

The second rectangle overlaps the first rectangle at coordinate (2, 1).

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `I` might fail the tests.