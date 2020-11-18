/*
 Copyright 2020 Adobe

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
;
(function() {
  "use strict";

  function resetButton() {
    let button = $("button[name='testButton']");
    button.removeAttr("disabled");
    button.text("Run Test");
  }

  function performTest() {
    let button = $("button[name='testButton']");
    button.attr("disabled", "disabled");
    button.text("Running Test");

    try {
      let $writes = $("input[name='writes']");
      let $every = $("input[name='every']");
      let $createNode = $("input[name='createnode']");
      let $endpoint = $("#endpoint i");
      let $name = $("#user i");
      let $key = $("#pword");
      let writes = $writes.val();
      let every = $every.val();
      let createNode = $createNode.is(':checked');
      let endpoint = $endpoint.text().toString().trim();
      let user = $name.text().toString().trim();
      let token = $key.data("token").trim();

      // Validate
      if (writes >= 50000) {
        writes = 50000;
        $writes.val(writes);
      } else if (writes < 1000) {
        writes = 1000;
        $writes.val(writes);
      }
      if (every >= writes || every < 0) {
        every = 0;
        $every.val(every);
      }
      if (endpoint.length === 0 || user.length === 0 || token.length === 0) {
        alert("Bad component values.  Please reset Session Writer component.");
        resetButton();
      }

      // Make the call!
      let url = endpoint +
          "?every=" + every +
          "&writes=" + writes +
          "&createNode=" + createNode;

      $.ajax({
        headers: {"Authorization": "Basic " + token},
        type: 'GET',
        url,
        dataType: "json",
      })
          .done(function (data/*, status, jqXHR*/) {
            if (data && data.duration) {
              // Clear details field, and hesitate to load it, to let the user know it updated.
              let $results = $("textarea[name='results']");
              let currentList = $results.val().toString();
              if (currentList.indexOf("Results of") === 0) {
                currentList = "";
              } else if (currentList && currentList.length > 0) {
                currentList += "\n";
              }
              $results.val(currentList + JSON.stringify(data));
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            alert("Error occurred when executing the session test.  Response: " + textStatus + " : " + errorThrown);
          })
          .always(function () {
            resetButton();
          });
    } catch(err) {
      resetButton();
    }
  }

  function onDocumentReady() {
    $("button[name='testButton']").off("click").on( "click", performTest);
  }

  if (document.readyState !== "loading") {
    onDocumentReady();
  } else {
    document.addEventListener("DOMContentLoaded", onDocumentReady);
  }

}());