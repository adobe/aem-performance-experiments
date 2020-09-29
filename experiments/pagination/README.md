# Use of Paging for large sets

This experiment demonstrates why pagination might provide a better experience with more immediate UI feedback and
less taxing work for the backend to do.  It allows hands-on, immediate feedback on pagination fields.

## Problem
At times, even after a query has been optimized for efficiency, it can take a long time to complete the search. Such a
 delay can be a bad experience for the user and uses a lot of system resources. How can that be improved?

## Goals
This experiment tries to show aspects of Pagination such as:
 * preventing the query from completing the whole search
 * controlling the size of the page
 * keeping track of how much of the list has already been loaded in the UI
 * how to use some
[Querybuilder](https://helpx.adobe.com/experience-manager/6-5/sites/developing/using/reference-materials/javadoc/com/day/cq/search/QueryBuilder.html)
properties

_NOTE_: A customizer's search may include introduction of their own custom APIs, and not have the UI call
Querybuilder directly.  That is fine, as this experiment simply tries to illustrate the principles of pagination. 

## Non-Goals
It does not try to teach how to:
 * create a beautiful web page
 * script perfect JS/JQuery
 * optimize a search for best performance
 * validate field values

## Setup
Tools to Install:
* Maven (3.6.3 or more recent)

_NOTE_: An author instance running on port 4502 is required for this experiment.

We'll begin by building and installing the package included in this project.

1. Clone this Git repo to a local location
1. In a console, navigate to the `aem-project` folder located in the project root (_created from the AEM Project Archetype_).
1. Successfully build and install the package to your localhost's author instance by running `mvn -PautoInstallSinglePackage clean install`
1. To verify the installation, open Pager UI: http://localhost:4502/content/searchtester/us/en/experiments/pager.html

## Pager

## Test #1: `Introduction`
1. Open Pager UI: http://localhost:4502/content/searchtester/us/en/experiments/pager.html
1. Examine the fields (note the _Path_ is pointing to the Search Experiments content location, to limit the number of hits)
1. Click _Load Page_ button to use the fields' values to start a search of cq:Page items
1. Examine how the input fields changed to prepare for the loading of the next page
1. Examine the text area fields
1. Note the _Details_, especially the Duration, how the URL matches the field values and the response metadata
1. Click the _Load Page_ again and see the _Result_ list grow, and see the _Details_ information refresh
1. Scroll to the bottom of the _Results_ text area to load the next page (i.e. infinite scroll)

This is a simple experiment to get familiar with the Pager UI and its fields and to notice the time it
took to load small sets of the query results. 

## Test #2: `Full (long) Search`
1. Open Pager UI: http://localhost:4502/content/searchtester/us/en/experiments/pager.html or click the _Clear Fields_
1. Change the "p.limit" to -1 to load all the hits
1. Click _Load Page_ button 
1. Dismiss the dialog warning about an error
1. Note the _Details_, especially the Duration and total (57 or so)

In this experiment the content tree of the _searchtester_ is searched with a simple query. These results can
be extrapolated to realize the same search for a full site will have 10,000's of hits
and with some imagination, if even possible to complete without errors, would be long and use up many server
resources.

Recalling the "Test 1" experiment where the search results were loaded one page at a time, one can see how loading
small results sets one at a time is more efficient.

## Test #3: `Effect of guessTotal`
1. Open Pager UI: http://localhost:4502/content/searchtester/us/en/experiments/pager.html or click the _Clear Fields_
button if the page is already open
1. Change the Path value to **"/content"** to work with a larger result set
1. Click _Load Page_
1. In _Details_, notice the Duration value
1. Change the _guessTotal_ value to **"false"**
1. Click _Load Page_
1. In _Details_, notice the Duration value is substantially larger (relatively) because the backend finished the search in order to find the exact total

In this experiment it becomes clear that, for efficiency, the `guessTotal` value should be set to not load the entire
result set, simply to find the exact total.

## Test #4: `Try It`
1. Open the Pager UI: http://localhost:4502/content/searchtester/us/en/experiments/pager.html or click the
_Clear Fields_ button if the page is already open
1. It is up to you.  Some ideas:
    * Change the _Limit_ to see different page sizes and notice what happens to the _Offset_ field after a load
    * Change the _guessTotal_ values to "true", "false", -1, 0, 1 and 10000 and check the _Details_ of that search
    * Open your browser's network tab and see the network traffic when the call is executed
    * Use **"/content"** or **"/content/we-retail"** as the path for a larger search set

Have fun.

## Conclusion
To provide a better experience for the user, consider paging long results, instead of loading them all at once.
A practice of using pagination by default for UI based searches might be beneficial. Require authors & developers to
prove pagination is not required, instead of wondering if it should be implemented.

Examples of times when paging should be considered:

* the query has been optimized, but still takes a while
* when the item that the user is most likely interested in will be near the "top" of the returned hit list
* when the search hits may grow over time, or will be substantially larger in a Production environment (i.e. testing on Dev & Stage might have small results, but Production could be much larger)
* when migrating large sets of data, perhaps from a legacy database, and testing shows search queries are taking much longer

Some more reading:
 * [Query Build API](https://docs.adobe.com/content/help/en/experience-manager-64/developing/platform/query-builder/querybuilder-api.html)
 * [Query Class](https://helpx.adobe.com/experience-manager/6-5/sites/developing/using/reference-materials/javadoc/com/day/cq/search/Query.html)
