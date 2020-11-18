/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _main_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_main_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _sessiontester_tester_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _sessiontester_tester_ts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sessiontester_tester_ts__WEBPACK_IMPORTED_MODULE_2__);

;




/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

;
(function () {
    "use strict";
    function resetButton() {
        var button = $("button[name='testButton']");
        button.removeAttr("disabled");
        button.text("Run Test");
    }
    function performTest() {
        var button = $("button[name='testButton']");
        button.attr("disabled", "disabled");
        button.text("Running Test");
        try {
            var $writes = $("input[name='writes']");
            var $every = $("input[name='every']");
            var $createNode = $("input[name='createnode']");
            var $endpoint = $("#endpoint i");
            var $name = $("#user i");
            var $key = $("#pword");
            var writes = $writes.val();
            var every = $every.val();
            var createNode = $createNode.is(':checked');
            var endpoint = $endpoint.text().toString().trim();
            var user = $name.text().toString().trim();
            var token = $key.data("token").trim();
            if (writes >= 50000) {
                writes = 50000;
                $writes.val(writes);
            }
            else if (writes < 1000) {
                writes = 1000;
                $writes.val(writes);
            }
            if (every >= writes || every < 0) {
                every = 0;
                $every.val(every);
            }
            if (endpoint.length === 0 || user.length === 0 || token.length === 0) {
                alert("Bad component values.  Please reset component.");
                resetButton();
            }
            var url = endpoint +
                "?every=" + every +
                "&writes=" + writes +
                "&createNode=" + createNode;
            $.ajax({
                headers: { "Authorization": "Basic " + token },
                type: 'GET',
                url: url,
                dataType: "json",
            })
                .done(function (data) {
                if (data && data.duration) {
                    var $results = $("textarea[name='results']");
                    var currentList = $results.val().toString();
                    if (currentList.indexOf("Results of") === 0) {
                        currentList = "";
                    }
                    else if (currentList && currentList.length > 0) {
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
        }
        catch (err) {
            resetButton();
        }
    }
    function onDocumentReady() {
        $("button[name='testButton']").off("click").on("click", performTest);
    }
    if (document.readyState !== "loading") {
        onDocumentReady();
    }
    else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
}());


/***/ })
/******/ ]);