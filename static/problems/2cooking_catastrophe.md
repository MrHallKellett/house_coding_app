# Problem 17 - Cooking Catastrophe (**)

<img src="/static/problems/2cooking_catastrophe.png" width="300"/>

Charlie is the cook on Henry’s latest expedition. He’s cooking some dishes for the crew. Unfortunately, he didn’t check if the ingredients for each dish were spoiled or not before making the dishes. After realising some of the ingredients were spoiled, he went and reinspected all the ingredients, and collected a list of ingredients that he suspects were spoiled. He knows that serving a dish where any ingredient was spoiled could cause the crew to get food poisoning, thus those dishes can’t be served.

Please help Charlie determine the number of dishes that can be served.

## Input Format

The first line consists of one integer k - the number of spoiled ingredients.

The second line consists of k strings, s1, s2, s3, …, sn - the names of each spoiled ingredient

The third line consists of one integer n - the number of dishes.

The next n lines consists of one integer ai (the number of ingredients in this dish), followed by ai strings, di1, di2, di3, … - the names of each ingredient in this dish.

## Output Format

A single integer, the number of dishes that can be served.

## Example 1

### Input:

    1
    apple
    3
    1 apple
    2 apple banana
    1 banana

### Output:

    1

### Explanation:

The first dish contains apple, which is spoiled.

The second dish contains apple, making it spoiled, despite having other ingredients.

The last dish contains only bananas, which aren’t spoiled.

Therefore, only the last dish can be served, so the output is 1.

## Example 2

### Input:

    2
    apple banana
    4
    1 banana
    2 banana apple
    1 mango
    2 apple banana

### Output:

    1

### Explanation:

Dishes 1, 2, and 4 are spoiled, as they contain apple and/or banana.

Therefore, only dish 3 can be served so the output is 1.

## Example 3

### Input:

    2
    kiwi flour
    6
    3 apple banana chicken
    2 banana flour
    3 salt kiwi apple
    4 tomato bread mayo apple
    2 flour yeast
    2 chicken egg

### Output:

    3

### Explanation:

Dishes 1, 4, 6 aren’t spoiled, so the output is 3.

Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.