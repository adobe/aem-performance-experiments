# Performance gains of simple query refinement

This experiment demonstrates why query performance should be carefully considered and load tested before going to production.

## Problem

The simplest of queries in AEM may initially perform just fine when starting out, but what happens when your application becomes wildly successful?
It happens! A sudden hot deal on a popular product, for example, is often all it takes to expose the vulnerable query, and degrade performance to the point of causing critical errors and potentially lost revenue.

In this example, we'll use AEM's we-retail sample application as the source of our content.
We'll query AEM, asking for any we-retail product page that shows an image of men's trail hiking pants.

## Setup

We'll use the We.Retail sample for this experiment. Confirm that you have it installed: http://localhost:4502/content/we-retail/us/en.html

Before running our load tests, let's try our query and see the result.  In a browser, visit: 

http://localhost:4502/bin/querybuilder.json?path=/content/we-retail&property=jcr%3Acontent/image/fileReference&property.value=/content/dam/we-retail/en/products/apparel/pants/Trail.jpg

The query should return 4 results:
``` json
{
    "success": true,
    "results": 4,
    "total": 4,
    "more": false,
    "offset": 0,
    "hits": 
    [
        {
            "path": "/content/we-retail/us/en/products/equipment/hiking/trail-model-pants",
            "excerpt": "",
            "name": "trail-model-pants",
            "title": "Trail Model Pants",
            "lastModified": "2016-06-29 08:21:00",
            "created": "2020-08-05 22:52:36"
        },
        {
            "path": "/content/we-retail/us/en/products/men/pants/trail-model-pants",
            "excerpt": "",
            "name": "trail-model-pants",
            "title": "Trail Model Pants",
            "lastModified": "2016-06-29 08:20:51",
            "created": "2020-08-05 22:52:34"
        },
        {
            "path": "/content/we-retail/language-masters/en/products/men/pants/trail-model-pants",
            "excerpt": "",
            "name": "trail-model-pants",
            "title": "Trail Model Pants",
            "lastModified": "2016-07-04 05:34:57",
            "created": "2020-08-05 22:52:40"
        },
        {
            "path": "/content/we-retail/ca/en/products/men/pants/trail-model-pants",
            "excerpt": "",
            "name": "trail-model-pants",
            "title": "Trail Model Pants",
            "lastModified": "2017-02-08 05:58:19",
            "created": "2020-08-05 22:52:37"
        }
    ]
}
```
## Test #1: `Load test the initial query`

1. Using the JMeter script included in this directory, generate 500 threads of requests with a 2 second ramp up time:

```
jmeter -n -t query-optimzation-test-plan.jmx -Jthreads=500 -Jrampup=2
```

Note the results that are printed to the console.

```
Run:
summary =    500 in 00:00:33 =   15.3/s Avg: 20526 Min:  8720 Max: 31958 Err:     0 (0.00%)
```
That's not great.  We're seeing an avg response time of over 20 seconds per query.  Let's try and improve that.
## Test #2: `Refine the content path`

Our first test looked at all content under `/content/we-retail`, the root of our site.  But in this simulation we're only interested in products, so lets refine our path like so...

http://localhost:4502/bin/querybuilder.json?path=/content/we-retail/us/en/products&property=jcr%3Acontent/image/fileReference&property.value=/content/dam/we-retail/en/products/apparel/pants/Trail.jpg

1. Again, we'll use the JMeter script included in this directory, and generate 500 requests with the new path:

```
jmeter -n -t query-optimzation-test-plan.jmx -Jthreads=500 -Jrampup=2 -JcontentPath=/us/en/products
```

```
Run:
summary =    500 in 00:00:08 =   65.0/s Avg:  4252 Min:  1940 Max:  6696 Err:     0 (0.00%)

```
A big improvement!  But let's try and do better...

## Test #3: `Include a resource type`

1. Since in this simulation, we are only interested in product pages being returned, lets also add a `type` property like so...

   http://localhost:4502/bin/querybuilder.json?path=/content/we-retail/us/en/products&type=cq%3APage&property=jcr%3Acontent/image/fileReference&property.value=/content/dam/we-retail/en/products/apparel/pants/Trail.jpg

This allows AEM to use one of its built in indexes for type `cq:Page`
```
jmeter -n -t query-optimzation-test-plan.jmx -Jthreads=500 -Jrampup=2 -JcontentPath=/us/en/products -Jtype=cq:Page

```

```
Run:
summary = 500 in 00:00:02 = 246.4/s Avg: 44 Min: 10 Max: 379 Err: 0 (0.00%)
```
That's a lot better!  We've gone from about 20 seconds down to mere milliseconds.


## Conclusion
Refining queries to be more efficient is an often overlooked step in the development process, since potential problems might only present themselves under heavy load.  Still, that load should be anticipated.
  
In this experiment we've seen how tools like JMeter can be used to quickly identify potential pitfalls in our queries.  We've seen how with just 2 minor changes to our query, significant performance gains were achieved.  

For more details on query optimization in AEM, including how to use its Explain Query tool, see the official [documentation](https://helpx.adobe.com/experience-manager/6-3/sites/deploying/using/best-practices-for-queries-and-indexing.html#QueryOptimization).
