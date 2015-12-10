/**
 * Created by ulrichsinn on 10/29/2013.
 */


var isButtonClick = false,
    isAutomatic = false,
    canPlayMPEG = false,
    currentSelection = null,
    currentSelectionIndex = -1,
    videoPlayerWrapper,
    controlsWrapper,
    mouseOverControls = false,
    delay = 5000,
    autoPlayTimer,
    videos = [
//        {id: "3352043148001", name: "introduction", index: 0, video: "TXU-demo-r6-hd", label: "Intro"},
        {id: "3251532932001", name: "introduction", index: 0, video: "TXU-demo-r6-hd", label: "Intro"},
        {id: "3251450960001", name: "overview", index: 1, video: "TXU.Overview_r1", label: "Overview"},
        {id: "3251532945001", name: "track", index: 2, video: "TXU.TrackUsage_r1.hd", label: "Track Usage"},
        {id: "3251450981001", name: "viewBill", index: 3, video: "TXU.ViewBill_r1.hd", label: "View Bill"},
        {id: "3251585832001", name: "payBill", index: 4, video: "TXU.PayBill_r1.hd", label: "Pay Bill"},
        {id: "3251585831001", name: "preferences", index: 5, video: "TXU.SetProfilePrefs_r1.hd", label: "Set Profile & Preferences"},
        {id: "3251450975001", name: "plans", index: 6, video: "TXU.ShopPlans_r1.hd", label: "Shop Plans & Products"},
        {id: "3251532942001", name: "help", index: 7, video: "TXU.GetHelp_r1.hd", label: "Get Help"},
        {id: "3251532941001", name: "mobile", index: 8, video: "TXU.OnTheGo_r1.hd", label: "On-the-Go"}
    ],
    client = "dDdfCPBLsvBjqduY6BGrv0Qe7cWoULloCquqcb2y6JMQRLfX4JDh8Q..";


function checkForMpeg() {
    if (Modernizr.video.h264) {
        return true
    } else {
        return false
    }
}

jQuery("document").ready(function () {
    canPlayMPEG = checkForMpeg();
    bindHashChange();
    init();
})


function init() {
    videoPlayerWrapper = jQuery("#videoPlayerWrapper");
    controlsWrapper = jQuery("#controlsWrapper");

    if (!Modernizr.touch) {
        jQuery("#tapScreen").remove();
        videoPlayerWrapper.bind("mouseenter", function () {
            mouseOverControls = true;
            showControls();
        });

        videoPlayerWrapper.bind("mouseleave", function () {
            mouseOverControls = false;
            hideControls();
        });

        controlsWrapper.bind("mouseenter", function () {
            mouseOverControls = true;
        });

        controlsWrapper.bind("mouseleave", function () {
            mouseOverControls = false;
            hideControls();
        });
    }

    waitForBrightCove();
}


function waitForBrightCove() {
    var ids = videos[0].id + "," + videos[1].id + "," + videos[2].id + "," + videos[3].id + "," + videos[4].id + "," + videos[5].id + "," + videos[6].id + "," + videos[7].id + "," + videos[8].id;

    BCMAPI.token = client;
    var video_ids = {video_fields: "id,name,renditions",
        media_delivery: "http",
        video_ids: ids }
    BCMAPI.callback = "brightcoveCallback";
    BCMAPI.find("find_videos_by_ids", video_ids);
}

function brightcoveCallback(pResponse) {
    var arr = pResponse.items

    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        var name = arr[i].name.split(" - ")[1],
            id = arr[i].id,
            rendition = arr[i].renditions,
            url = rendition[0].url;

        for (var k = 0; k < rendition.length; k++) {
//            console.log(k, "  --- ", rendition[k].frameWidth)
            if (rendition[k].frameWidth > 720) {
                rendition = arr[i].renditions[k]
                url = rendition.url;
            }
//            console.log("brightcoveCallback", rendition.length, rendition.frameWidth, rendition.frameHeight)
            updateArray(id, url)
        }

    }

    function updateArray(id, url) {

        for (var i = 0; i < videos.length; i++) {
            if (parseInt(videos[i].id) == id) {
//                console.log(i, url);
                videos[i].video = url;
            }
        }

    }

    brightCoveReady();
}

function brightCoveReady() {
    jQuery(window).trigger('hashchange');
    TXU.video.init(videos, "EndCards.html .endCard");
    TXU.controls.init();
    initSelection();
}
function initSelection() {

    jQuery("#videoSelectionWrapper td").bind("click", function (evt) {
        var selectedItem = jQuery(this).attr("data-src");
        isButtonClick = true;
        updateHash(selectedItem)
        if (Modernizr.touch) {
            setCurrentSelection(selectedItem)
        }
    });

    jQuery("#videoSelectionWrapper td").bind("mouseenter", function (evt) {
        onTabOver(evt)
    })
    jQuery("#videoSelectionWrapper td").bind("mouseleave", function (evt) {
        onTabOut(evt)
    })

//    setCurrentSelection(0)
//    updateHash(0)
}

function onTabOver(evt) {
//    console.log(evt.currentTarget.outerHTML)
    var tab = jQuery(evt.currentTarget)
    tab.removeClass("navUp").addClass("navOver")
}

function onTabOut(evt) {
//    console.log(evt.currentTarget.outerHTML)
    var tab = jQuery(evt.currentTarget)
    if (tab.hasClass("selectedItem")) {
        return
    } else {
        tab.removeClass("navOver").addClass("navUp")
    }
}

function setCurrentSelection(index) {
    console.log("setCurrentSelection", index, isAutomatic)

    if (index == currentSelectionIndex) {
        return
    } else {
        jQuery("#videoSelectionWrapper td").each(function (n) {
            if (n == index - 1) {
                jQuery(this).addClass("selectedItem")
                jQuery(this).removeClass("navUp").addClass("navOver")

            } else {
                jQuery(this).removeClass("selectedItem")
                jQuery(this).removeClass("navOver").addClass("navUp")
            }
        })

        currentSelectionIndex = index;
        currentSelection = videos[currentSelectionIndex];
        console.log(currentSelection.video);
        playVideo();
    }

    if (isAutomatic) {
        TXU.video.showTapCard();
        isAutomatic = false;
    }

    showSpinner()

}


function playVideo() {
    console.log("main playVideo", currentSelection.video);
    TXU.video.playSelection(currentSelection.index, currentSelection.video);
}

function onVideoEnd() {
//    delay = (currentSelectionIndex == 0) ? 10 : 5000;
    var currentDelay = delay;
//    console.log("autoPlayTimer", currentDelay, autoPlayTimer, currentSelectionIndex)
    autoPlayTimer = setTimeout(function () {
        playNext();
        clearTimeout(autoPlayTimer)
    }, currentDelay)
}

function playNext() {
    var current = parseInt(currentSelectionIndex)

    if (current < videos.length - 1) {
        current += 1;
        updateHash(current, true)
//        setCurrentSelection(current, true)
    } else {
        console.log("playNext - last")

    }
}

function hideControls() {

    var delay = setTimeout(function () {

        console.log("hideControls", mouseOverControls)
        if (mouseOverControls == false) {
            fadeOutControls();
            clearTimeout(delay)
        } else {
            clearTimeout(delay)
        }
    }, 500)
}


function showControls() {
    if (Modernizr.touch) {
        return
    }
    TweenLite.to(controlsWrapper, 0.2, {opacity: 1, top: 483})
}

function fadeOutControls() {
    TweenLite.to(controlsWrapper, 0.2, {opacity: 0, top: 483 + 36})

}

function hideSpinner() {
    jQuery("#spinner").removeClass("showSpinner").addClass("hideSpinner");
}

function showSpinner() {
    jQuery("#spinner").removeClass("hideSpinner").addClass("showSpinner");
}

// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function () {
        var noop = function () {
        };
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

//HASH CHANGE

function bindHashChange() {
    jQuery(window).bind("hashchange", function (e) {

        var index,
            section = jQuery.bbq.getState("section") || "introduction";

//        tab = jQuery('.tabs .tab').eq(tabIndex);

        for (var i = 0; i < videos.length; i++) {
            if (section == videos[i].name) {
                index = i;
                console.log("hashchange section", section, index, "IS BUTTON CLICK", isButtonClick)
                console.log("HISTORY", history.length);
                if (Modernizr.touch && isButtonClick == false) {
                    isAutomatic = true;

                }
                setCurrentSelection(index)
                isButtonClick = false;

            }
        }


//    updateTabs(tab);

    });

}


function updateHash(index, auto) {
    isAutomatic = auto;
    var hash = videos[index].name
    jQuery.bbq.pushState({ section: hash});

    return false;
}

// FLASH INCOMING

function loadFlashUrl(url) {
    console.log("loadFlashUrl", url)
}

function onFlashMetaData(totalTime, currentTime) {
    console.log("onFlashMetaData", totalTime, currentTime)
    TXU.video.onPlayingEvent();
}

function onFlashTick(totalTime, currentTime) {
    var prettyElapsed,
        prettyTotal,
        percentPlayed;

    prettyElapsed = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(currentTime);
    prettyTotal = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(totalTime);
    percentPlayed = ADDTOTHENOISE_UTILS.getRelative(currentTime, totalTime, 0);
    TXU.video.updateTimeFields(prettyTotal, prettyElapsed)
    TXU.video.updateScrubberPosition(percentPlayed, prettyElapsed);
//    console.log("onFlashTick", percentPlayed)
}


function onFlashVideoComplete(totalTime, currentTime) {
//    console.log("onFlashVideoComplete", totalTime, currentTime)
    TXU.video.showEndCard();
}

// FLASH OUTGOING

function flashMovie(movieName) {
    if (window.document[movieName]) {
        return window.document[movieName];
    }
    else {
        return document.getElementById(movieName);
    }
}

function getFlashDuration() {
    return flashMovie("flashVideo").getDuration();
}

function getFlashCurrentTime() {
    return flashMovie("flashVideo").getCurrentTime();
}

function setFlashVolume(vol) {
//    console.log("setFlashVolume", vol, flashMovie("flashVideo"))
    if (flashMovie("flashVideo")) {
        flashMovie("flashVideo").setVolume(vol);
    }
}

function pauseFlashVideo() {
    if (flashMovie("flashVideo")) {

        flashMovie("flashVideo").pauseVideo();
    }

}
function resumeFlashVideo() {
    if (flashMovie("flashVideo")) {

        flashMovie("flashVideo").resumeVideo();
    }

}
function seekToInFlashVideo(t) {
    console.log("seekToInFlashVideo", t / 1000)
    if (flashMovie("flashVideo")) {

        flashMovie("flashVideo").seekToInVideo(t / 1000);
    }

}