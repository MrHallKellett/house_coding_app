# Problem 18 - Math Quiz (**)

<img src="/static/problems/2math_quiz.jpeg" width="300"/>

Dave is currently training to be a quartermaster Henry’s ship. The teacher is currently teaching about addition and multiplication. The teacher has given the students a quiz to check their understanding of basic math. Unfortunately Dave wasn’t listening to what the teacher was talking about (he was too busy thinking about what’s for lunch), which means he doesn’t know how to do the quiz. 

There are two types of problems on the quiz, addition problems and multiplication problems. Both types consists of a list of numbers, and an operation. The addition problems asks to find the sum total of the list of numbers, and the multiplication problems asks to find the product of the list of numbers.

Please help Dave solve each problem on the quiz.

## Input Format

The first line consists of one integer n - the number of problems.

The next n lines consists of one integer ai (the number of numbers in this problem), 

followed by one character si which can be either + or * (representing an addition problem or multiplication problem),

followed by ai positive integers (the numbers involved in this problem).

## Output Format

n lines, where line i contains the solution to the i th problem.

## Example 1

### Input:

    3
    3 + 1 2 3
    2 * 5 4
    4 + 5 5 5 5

### Output:

    6
    20
    20

### Explanation:

The first problem is an addition problem involving 1, 2, 3. The sum of these numbers is 6, which is the solution to the first problem.

The second problem is a multiplication problem involving 5, 4. The product of these numbers is 20, which is the solution to the second problem.

## Example 2

### Input:

    2
    1 + 3
    1 * 6

### Output:

    3
    6

### Explanation:

The first problem adding up the numbers 3, since there is only one number, the answer is just the number itself (3).

The second problem is the same, since the product of a single number is also just itself, the answer is also the number itself (6).

## Example 3

### Input:


6
4 + 10 15 99 23
3 + 1000 2 7
6 * 2 2 2 3 3 3
7 * 1 2 3 4 5 6 7
2 + 9 99
5 * 1 1 1 1 1


### Output:


147
1009
216
5040
108
1


Note: When taking input, do not print any message. For example, `input()` or `input(““)` would be fine, but `input(“Number: “)` or `input(“Something“)` might fail the tests.