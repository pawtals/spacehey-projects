// ==UserScript==
// @name         Spacehey Details Grabber
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hover users and press SHIFT to see their details in a popup.
// @author       sudofry / pawtals
// @match        https://spacehey.com
// @match        https://spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501896/Spacehey%20Details%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/501896/Spacehey%20Details%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var css = document.createElement("style");
    css.innerHTML = `
 
    #showDetails {
        position: absolute;
        height: 15rem; width: 20rem;
        z-index: 10;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        gap: 0.25rem;
        pointer-events: none;
        transition: all 10ms;
    }

    #showDetails p {
        color: oklch(100% 0 0);
        background: oklch(100% 0 0 / 0.2);
        border: oklch(100% 0 0 / 0.8) 1px solid;
        padding: 2rem; margin: 0;
        border-radius: 0.25rem;
        background-size: 150% 100%; flex-grow: 1;
        display: flex; align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px) brightness(0.15) saturate(3.57);
        max-height: 5rem;
    }

    #showDetails p:nth-child(2), #showDetails p:nth-child(1) {
        max-width: 100%;
        flex-grow: 10;
    }

    #showDetails p.online {
        img {display: none !important;}
    }

    #showDetails .awards, #showDetails a {display: contents;}
    `;

    document.head.appendChild(css);

    var divPop = document.createElement("div");
    var fetch;

    divPop.id = "showDetails";
    $("main").prepend(divPop);
    $("#showDetails").hide();

    $(".person a, .comments-table td:first-child a, .comments-table td small a:first-child").hover(function () {
        clearTimeout(fetch)
        fetch = setTimeout(() => {
            var link = ("https://spacehey.com" + $(this).attr("href"))
            $("#showDetails").html("<p>Loading...</p>").show();
            $.get(link, null, function(getDetails) {
                try {
                    var details = $(getDetails).find('.details').html();
                    if (details === undefined)
                        throw new Exception("No details section could be fetched.")
                } catch (e) {
                    let exceptionText = document.createElement("p");
                    exceptionText.innerText = "User has either blocked you or has their profile set to private.";
                    ((document.querySelector("#showDetails")).innerText="");
                    ((document.querySelector("#showDetails")).appendChild(exceptionText));
                    return;
                }
                $("#showDetails").html(details).show();
                if (!(document.querySelector("#showDetails .ago") == undefined)) {
                    let lastSeen = document.querySelector("#showDetails .ago");
                    let date = new Date(lastSeen.innerText*1000)
                    lastSeen.innerText = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} at ${((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12)}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}${(date.getHours() >= 12) ? 'pm' : 'am'}`
                    lastSeen.style.opacity = "1"
                }
            })
        }, 1000)
    }, function() {
        clearTimeout(fetch)
        $("#showDetails").hide();
    });
    $(".person a, .comments-table td:first-child a, .comments-table td small a:first-child").on("mousemove", (event) => {
        $("#showDetails").css("top", (event.pageY + 15))
        $("#showDetails").css("left", (event.pageX + 15))
    })
})();
