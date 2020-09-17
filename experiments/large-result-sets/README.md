# Performance gains for large result sets

This experiment demonstrates the advantage of using [Query Builder's p.guessTotal](https://docs.adobe.com/help/en/experience-manager-65/developing/platform/query-builder/querybuilder-api.html) parameter to return a subset of Query Builder query results.

## Problem

By default, Query Builder reads the entire result set to determine the total number of hits for a query which can be costly in terms of both execution time and memory usage for queries that have large result sets. In this experiment, we'll attempt to show the performance benefit of using the `p.guessTotal` parameter to avoid calculating the exact size of the result set.

## Setup

AEM's QueryBuilder debugger tool will be used to execute [QueryBuilder-based] (https://docs.adobe.com/help/en/experience-manager-65/developing/platform/query-builder/querybuilder-api.html) queries on the JCR (Java Content Repository).

## Test #1: `Calculate the exact total`

1. Navigate to AEM's QueryBuilder debugger tool at: http://localhost:4502/libs/cq/search/content/querydebug.html.

2. Find all web pages in the AEM system by typing the following text in the text area:

```
   type=cq:Page
   path=/content
```

3. Select the `Search` button to execute the query.

 <img src="../img/query-builder-debugger-exact-total.png">

4. Make note of the total `Number of hits` and the `Time` it took the execute the query.

## Test #2: `Approximate the total`

Let's try this query again, but this time we'll specify a number to count up to for the total of hits. 

1. Return to the Query Builder Debugger we used earlier and run the same query again with guessTotal:

```
   type=cq:Page
   path=/content
   p.guessTotal=100
```
<img src="../img/query-builder-debugger-more-total.png">

Now we see that 100 results were read "and more" exist.  There is no exact number of hits, and the query performs faster. That's better!

## Conclusion

Okay, the performance improvement in query speed for this small result set was not that impressive.  However, imagine if the query was more complex and there were hundreds of thousands of results then we would have seen a significant difference in the execution time.  It is not always necessary to return a complete result set all at once. Use guessTotal for pagination or infinite scrolling, where only a subset of results are incrementally displayed.  

For more details on the Query Builder API, including how to implement pagination, see the official [documentation](https://docs.adobe.com/help/en/experience-manager-65/developing/platform/query-builder/querybuilder-api.html).

