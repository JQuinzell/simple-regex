# API

This regex API provides a `regexSearch` function.

It can be called like `regexSearch(searchPattern, searchText)` where both arguments are strings. All resulting matches are returned as an array of strings.

## Patterns

### Literals

Any string text in the pattern that is not an operator will be treated as a literal match. The pattern `abc` on `do you know the abcs` will return `['abc']`

### Alternation: |

The | can be used like an `or` operator for multiple literal matches. Each pattern on either side of the | will be ran on the `searchText` separately.
So `cat|dog` will return `['cat', 'dog']` on the text `cat or dog`

Note: Nesting is not currently supported. `|` can only be used on the root level so something like `a(b|c)z` will not search for a `b` or `c` but instead for `a(b` or `c)z`. (Parentheses are not an operator.)

### At least 1: +

The `+` operator matches at least one of the preceding literal character or more.

ex: `do+g` will match `dog` or `doooooog` but not `dg`

### 0 or more: \*

The `*` operator matches 0 or more of the preceding literal character

ex: `do*g` will match `dog` `doooog` or `dg`

You can mix and match all operators

### Development

Install with `npm install`

Tests can be ran with `npm run test`
