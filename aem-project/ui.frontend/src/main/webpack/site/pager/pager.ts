// PAGER script
// Controls the execution of the search, and managing the results.
// See the Hello World example provided when using the AEM Maven archetype, to answer questions about this code.

;
(function() {
  "use strict";

  function loadNextPage() {
    let $limit = $("input[name='limit']");
    let pageSize =  parseInt($limit.val().toString());
    let $guessTotal = $("input[name='guessTotal']");
    let $offset = $("input[name='offset']");
    let searchPath = $("input[name='searchPath']").val().toString();
    let url = "/bin/querybuilder.json?type=cq%3APage&path=" + searchPath.replace(/ /g, "");
    let searchURL = encodeURI(url +
        "&p.limit=" + pageSize +
        "&p.offset=" + $offset.val() +
        "&p.guessTotal=" + $guessTotal.val());
    let start = new Date().getTime();

    if (pageSize < 1) {
      $limit.val(10);
      return;
    }
    let guessTotalUpper = $guessTotal.val().toString().toUpperCase();
    if (guessTotalUpper !== "TRUE" && guessTotalUpper !== "FALSE" && $.isNumeric(guessTotalUpper) === false) {
      $guessTotal.val("true");
      return;
    }

    $.get(searchURL)
        .done(function( data, status, jqXHR ) {
          if (data && data.hits ) {
            // Clear details field, and hesitate to load it, to let the user know it updated.
            $("textarea[name='details']").val("");
            window.setTimeout(
                function () {
                  let $details = $("textarea[name='details']");
                  $details.val(
                    "Duration:\n" + (new Date().getTime() - start - 500) + " milliseconds\n\n" +
                    "URL:\n" + decodeURI(searchURL) + "\n\n" +
                    "Response:\n" + JSON.stringify(jqXHR.responseJSON, undefined, 2)
                  );
                },
                500
            );

            let $results = $("textarea[name='results']");
            let currentList = $results.val();
            if (!currentList || currentList === "0") {
              currentList = "";
            }
            for (let i = 0; i < data.hits.length; i++) {
              currentList += data.hits[i].path + "\n";
            }
            $results.val(currentList);
          }
        })
        .fail(function(data, textStatus, errorThrown) {
          alert("Error occurred when executing the search.  Response: " + textStatus + " : " + errorThrown );
        });

    $offset.val(parseInt($offset.val().toString()) + pageSize);
    if (guessTotalUpper !== "TRUE" && guessTotalUpper !== "FALSE" && parseInt(guessTotalUpper)> 0) {
      $guessTotal.val(parseInt($offset.val().toString()) + pageSize);
    }
  }

  function handleReset() {
    $("input[name='limit']").val(10);
    $("input[name='guessTotal']").val(11);
    $("input[name='offset']").val(0);
    $("textarea[name='details']").val("");
    $("textarea[name='results']").val("");
  }

  function onDocumentReady() {
    $("button[name='load']").off("click").on( "click", loadNextPage);
    $("button[name='reset']").off("click").on( "click", handleReset);

    // Set up an event to caught when the list is
    let $resultsList = $("textarea[name='results']");
    $resultsList.scroll(function() {
      let offset = $resultsList.height() + 6; // height of textarea

      if (this.scrollHeight <= (this.scrollTop + offset)) {
        // Avoid this call if the last response indicated there were no more hits (i.e. "more": false).
        // That is not done here to allow the user to play with different field values.
        loadNextPage();
      }
    });
  }

  if (document.readyState !== "loading") {
    onDocumentReady();
  } else {
    document.addEventListener("DOMContentLoaded", onDocumentReady);
  }
}());