/**
 * Created with JetBrains WebStorm.
 * User: ulrichsinn
 * Date: 05/22/2013
 * Time: 14:50
 * To change this template use File | Settings | File Templates.
 */

var TXU = TXU || {};

TXU.video = (function () {
    "use strict";
    var owner = {},
        section = [],
        currentIndex,
        currentEndCard,
        endCardContainer,
        isMuted = false,
        isPaused = false,
        isDragging = false,
        isDraggingVolume = false,
        hasFlashPlayer = false,
        isVolumeOver,
        scrubVolume = 0.9,
        currentTime,
        totalTime,
        videoTimeTooltip,
        volumeToolTip,
        vidScrubMinAbs,
        vidScrubMaxAbs,
        tapScreen,
        vidPlayer = jQuery("video")[0];

    function init(arr, endCards) {
        section = arr;
        addControlsListener();
        initControls();
        loadEndCards(endCards, endCardsLoaded)

        vidScrubMinAbs = 256;
        vidScrubMaxAbs = 915;

        videoTimeTooltip = jQuery('<div class="toolTip">play</div>');
        volumeToolTip = jQuery('<div class="toolTip">play</div>');


        function loadEndCards(pageName, cb) {
            endCardContainer = jQuery("<div id='endCardcontainer'></div>")

            endCardContainer.load(pageName, function () {
                cb();
            });

        }

        function endCardsLoaded() {
            console.log(">>>>>> end cards loaded", endCardContainer.find(".endCard").length)
        }

        if (Modernizr.touch) {
        }
    }

    function createVideoListener(vidPlayer) {
        vidPlayer.addEventListener("loadedmetadata", onMetadata);
        vidPlayer.addEventListener("playing", onPlayingEvent);
        vidPlayer.addEventListener("stalled", onStalledEvent);
        vidPlayer.addEventListener('timeupdate', onPlayheadUpdate, false);
        vidPlayer.addEventListener("ended", showEndCard);
    }

//    SHOW END CARD

    function showEndCard(evt) {
        var endCards = endCardContainer.find(".endCard"),
            currentEndCard = jQuery(endCards[currentIndex]).clone();


        console.log(">>>> showEndCard", currentEndCard[0].outerHTML)

        if (evt) {
            console.log("VIDEO ENDED", endCards.length, currentIndex, ">>>>", evt.currentTarget.id)
            evt.currentTarget.removeEventListener("ended", showEndCard);
        }
        jQuery("#videoPlayerWrapper").empty();
        jQuery("#videoPlayerWrapper").append(currentEndCard);

        hideControls();
        window.onVideoEnd();

    }

    function createVideoPlayer() {
        var vidPlr;
        console.log("createVideoPlayer")
        if (Modernizr.touch) {
            vidPlr = jQuery('<video id="videoPlayer" preload="metadata" controls webkit-playsinline></video>');
        } else {
            vidPlr = jQuery('<video id="videoPlayer" autoplay webkit-playsinline></video>');
        }
        vidPlr.addClass("hideVideo")
        return vidPlr
    }

    function playSelection(index, id, cb) {
        currentIndex = index;
        initControls()
        hideControls();
        jQuery("#videoPlayerWrapper").empty();
        tapScreen = jQuery("#tapScreen");


        if (canPlayMPEG == false) {
            var flashPlayer = TXU.flashVideo.getFlashPlayer(id);
            hasFlashPlayer = true;
//            console.log("flashPlayer", flashPlayer[0].outerHTML)
//            jQuery("#videoPlayerWrapper").append(flashPlayer)
//            alert("NEED FLASH PLAYER");
            return;
        }
        var src,
            srcTag = '<source src=' + id + ' type="video/mp4">',
            plr = createVideoPlayer();

        createVideoListener(plr[0])

        plr.prepend(jQuery(srcTag));

        jQuery("#videoPlayerWrapper").prepend(plr);
        vidPlayer = plr[0]
        console.log(">>>> getSection", src, vidPlayer, canPlayMPEG, navigator.userAgent, tapScreen);
        plr[0].load();
        plr.volume = scrubVolume

        if (Modernizr.touch) {
            tapScreen.bind("click", function () {
                tapScreen.unbind("click");
                console.log("tapScreen click");

                plr[0].play();
                tapScreen.addClass("hideVideo");
                tapScreen.removeClass("tapScreenNext").addClass("tapScreenNext")
            })

        }
//        tapScreen.removeClass("showVideo").addClass("hideVideo");

    }

    function onPlayingEvent(e) {
        if (hasFlashPlayer) {
            window.hideSpinner();
            showControls();
            return
        }
        var vid = jQuery("#videoPlayer")
//        console.log("onPlayingEvent", e.type, vid[0].outerHTML);
        vid.removeClass("hideVideo").addClass("showVideo")
        window.hideSpinner();

        var prettyElapsed = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(vidPlayer.currentTime * 1000);
        var prettyTotal = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(vidPlayer.duration * 1000);


        showControls();
        updateTimeFields(prettyTotal, prettyElapsed)


    }

    function updateTimeFields(prettyTotal, prettyElapsed) {
        jQuery("#totalTime").text(prettyTotal);
        jQuery("#currentTime").text(prettyElapsed);

    }

    function onStalledEvent(e) {
//        console.log("onStalledEvent", e.type);
    }

    function onMetadata(e) {
        var vid = jQuery("#videoPlayer"),
            w = parseInt(jQuery("#videoPlayerWrapper").css("width")),
            h = parseInt(jQuery("#videoPlayerWrapper").css("height"));

        vid.css("width", "100%")
        vid.css("height", "100%")
        vid.css("top", 0)
        vid.removeClass("hideVideo").addClass("showVideo")
        console.log("onMetadata", e.currentTarget.videoHeight, e.currentTarget.videoWidth, "TOP", vid[0].outerHTML);
        vid[0].play();


    }

    function addControlsListener() {
        initControls()
        jQuery("#playPauseButton").bind("click", onPlayPauseClick);
        jQuery("#muteUnmuteButton").bind("click", onMuteUnmuteClick);
        jQuery("#rewindButton").bind("click", onRewind);
        jQuery("#scrubCursor").bind("mousedown", onScrubDown)
        jQuery("#scrubCursor").bind("mouseenter", showVideoTooltip)
        jQuery("#scrubCursor").bind("mouseleave", hideVideoTooltip)

        jQuery("#volumeThumb").bind("mousedown", onVolumeScrubDown)
        jQuery("#volumeThumb").bind("mouseenter", showVolumeTooltip)
        jQuery("#volumeThumb").bind("mouseleave", hideVolumeTooltip)
    }

    function initControls() {
        isPaused = false;
        jQuery("#playPauseButton").removeClass("pauseButton").addClass("playButton");

        if (isMuted) {
            jQuery("#muteUnmuteButton").removeClass("muteButton").addClass("unmuteButton");
        } else {
            jQuery("#muteUnmuteButton").removeClass("unmuteButton").addClass("muteButton");
        }

        jQuery("#muteUnmuteButton").bind("mouseenter", function () {
            isVolumeOver = true;
            showVolumeSlider();
        })
        jQuery("#muteUnmuteButton").bind("mouseleave", function () {
            isVolumeOver = false;
            hideVolumeSlider();
        })
        jQuery("#volumeSlider").bind("mouseenter", function () {
            isVolumeOver = true;
            showVolumeSlider();
        })
        jQuery("#volumeSlider").bind("mouseleave", function () {
            isVolumeOver = false;
            hideVolumeSlider();
        })

        setVolumeThumb(0.2)
    }

    function hideControls() {
        jQuery("#controlsWrapper").removeClass("showSpinner").addClass("hideSpinner");
    }

    function showControls() {
        jQuery("#controlsWrapper").removeClass("hideSpinner").addClass("showSpinner");
        if (hasFlashPlayer) {
            return
        }
//        vidPlayer.volume = scrubVolume;
        setVideoVolume(scrubVolume)

//
        if (isMuted) {
//            vidPlayer.volume = 0;
            setVideoVolume(0)
        }
    }

    function onPlayPauseClick() {
        if (jQuery("#playPauseButton").hasClass("playButton")) {
            jQuery("#playPauseButton").removeClass("playButton").addClass("pauseButton");
            isPaused = true;
            pauseVideo();

        } else {
            jQuery("#playPauseButton").removeClass("pauseButton").addClass("playButton");
            isPaused = false;
            resumeVideo();
        }
    }

    function onMuteUnmuteClick() {
        if (jQuery("#muteUnmuteButton").hasClass("muteButton")) {
//            setVolumeThumb(1)
            muteSound()
        } else {
//            setVolumeThumb(1 - scrubVolume)

            unmuteSound();
        }
    }

    function muteSound() {
        jQuery("#muteUnmuteButton").removeClass("muteButton").addClass("unmuteButton");
        isMuted = true;
        setVideoVolume(0)
//        vidPlayer.volume = 0;
    }

    function unmuteSound() {
        jQuery("#muteUnmuteButton").removeClass("unmuteButton").addClass("muteButton");
        isMuted = false;
        setVideoVolume(scrubVolume)
//        vidPlayer.volume = scrubVolume;
    }

    function onRewind() {
        vidPlayer.currentTime = 0;
        if (!isPaused) {
            vidPlayer.play();
        }

    }

    function onPlayheadUpdate(e) {

//        console.log("onPlayheadUpdate isDragging", isDragging)
        if (isDragging) {
            return
        }
        var w = 640,
            offset = 20,
            prettyElapsed,
            prettyTotal,
            percentPlayed;

        if (!isPaused) {
            jQuery("#dragBehind").css("width", percentPlayed * w + offset + "px")

        }

        prettyElapsed = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(vidPlayer.currentTime * 1000);
        prettyTotal = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(vidPlayer.duration * 1000);
        percentPlayed = ADDTOTHENOISE_UTILS.getRelative(vidPlayer.currentTime, vidPlayer.duration, 0);

//        jQuery("#totalTime").text(prettyTotal);
//        jQuery("#currentTime").text(prettyElapsed);
        updateTimeFields(prettyTotal, prettyElapsed)
        updateScrubberPosition(percentPlayed, prettyElapsed)
//        console.log(percentPlayed * w + offset, jQuery("#scrubCursor").css("left"));


//        console.log("onPlayheadUpdate", ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(vidPlayer.currentTime * 1000), vidPlayer.duration);
    }

    function updateScrubberPosition(percentPlayed, prettyElapsed) {

        if (isDragging) {
            return
        }
        var w = 640,
            offset = 20;

        jQuery("#scrubCursor").css("left", percentPlayed * w + offset + "px")
        videoTimeTooltip.css("left", percentPlayed * w + offset + 98 + "px")
        videoTimeTooltip.css("top", -25 + "px")
        videoTimeTooltip.text(prettyElapsed);
    }

    function onScrubDown(e) {
        var dragging = isDragging,
            resume = resumeVideo,
            min = parseInt(jQuery("#scrubBorder").css("left")),
            max = parseInt(jQuery("#scrubBorder").css("width")),
            initX = e.clientX,
            currentX,
            initCursorX = 0,
            scrubBorderLeft = jQuery("#scrubBorder").offset().left;
        dragging = true;
        isDragging = dragging;
        pauseVideo();
//        vidPlayer.pause();
//        console.log("onScrubDown", initX, scrubBorderLeft, max);
        jQuery(document).bind("mouseup", onScrubEnd);
        jQuery(document).bind("mousemove", onScrubMove);

        e.preventDefault();

        showVideoTooltip()

        function onScrubEnd() {
            jQuery(document).unbind("mousemove", onScrubMove);
            jQuery(document).unbind("mouseup", onScrubEnd);
            dragging = false;
            isDragging = dragging;

            if (!isPaused) {
                resume()
//                vidPlayer.play();
            }

            hideVideoTooltip()
        }

        function onScrubMove(e) {
            var d,
                prettyElapsed,
                prettyTotal,
                totalTime,
                currentTime,
                current,
                scrubPercentage = ADDTOTHENOISE_UTILS.getRelative(e.clientX, scrubBorderLeft + max, scrubBorderLeft);

            totalTime = (!hasFlashPlayer) ? vidPlayer.duration : window.getFlashDuration();
            currentTime = (!hasFlashPlayer) ? vidPlayer.currentTime : window.getFlashCurrentTime();


            if (scrubPercentage >= 0 && scrubPercentage < 0.99) {
                d = ADDTOTHENOISE_UTILS.getAbsolute(scrubPercentage, max, 0)
                jQuery("#scrubCursor").css("left", d + "px")
                current = ADDTOTHENOISE_UTILS.getAbsolute(scrubPercentage, totalTime, 0)
//                console.log("current", current, "totalTime", totalTime, "currentTime", currentTime)
                seekToInVideo(current)

            }
            if(!hasFlashPlayer){
                prettyElapsed = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(currentTime * 1000);
                prettyTotal = ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(totalTime * 1000);
                updateTimeFields(prettyTotal, prettyElapsed)

            }

//            jQuery("#currentTime").text(prettyElapsed);
//            jQuery("#totalTime").text(prettyTotal);

            videoTimeTooltip.text(ADDTOTHENOISE_UTILS.getFormattedTimeInMinutesAndSeconds(current));
            videoTimeTooltip.css("left", d + 96 + "px")
            videoTimeTooltip.css("top", -25 + "px")
        }
    }

    function onVolumeScrubDown(e) {
        var dragging = isDraggingVolume,
            initY = e.clientY,
            currentY = initY,
            minY = Math.round(jQuery("#volumeSlider").offset().top) + 13,
            maxY = minY + jQuery("#volumeSlider").height() - 26;
        dragging = true;
        //console.log("onVolumeScrubDown", minY, maxY, currentY);
        jQuery(document).bind("mouseup", onScrubEnd);
        jQuery(document).bind("mousemove", onScrubMove);

        e.preventDefault()

        function onScrubEnd() {
            jQuery(document).unbind("mousemove", onScrubMove);
            jQuery(document).unbind("mouseup", onScrubEnd);
            dragging = false;

        }

        function onScrubMove(e) {
            var scrubPercentage = ADDTOTHENOISE_UTILS.getRelative(e.clientY, minY, maxY) * 100;
            var cursorPos = ADDTOTHENOISE_UTILS.getAbsolute(scrubPercentage / 100, 0, 94 - jQuery("#volumeThumb").height())

            if (scrubPercentage >= 0 && scrubPercentage <= 100) {
                //console.log("onScrubMove", scrubPercentage);
                jQuery("#volumeThumb").css("top", 13 + cursorPos + "px")
                setScrubVolume(scrubPercentage)

            }
        }
    }

    function setVolumeThumb(n) {
        var min = 0,
            max = parseInt(jQuery("#volumeSlider").css("height")) - 60,
            thumbPos,
            vol;
        thumbPos = ADDTOTHENOISE_UTILS.getAbsolute(n, max, min);
        vol = 1 - thumbPos
        jQuery("#volumeThumb").css("top", thumbPos + "px", vol)

        //console.log("setVolumeThumb", max, jQuery("#volumeThumb").css("top"))


        try {
            setVideoVolume(1 - thumbPos);
        } catch (e) {
            //
        }

    }

    function setScrubVolume(n) {

        scrubVolume = 1 - (100 - n) / 100;
//        vidPlayer.volume = scrubVolume;

        if (scrubVolume == 0) {
            muteSound()
        } else {
            unmuteSound()
        }

        //console.log(scrubVolume)
        volumeToolTip.text(parseInt(scrubVolume * 100))
        showVolumeTooltip()

    }

    function setVideoVolume(vol) {
        if (hasFlashPlayer) {
            window.setFlashVolume(vol);
            return
        }
        vidPlayer.volume = vol;
    }

    function killVideo() {
        if (!vidPlayer) {
            //return
        }
        var plr = jQuery("#videoPlayer")
        hideControls();
        if (hasFlashPlayer) {
            window.pauseFlashVideo();
            return
        } else {
            vidPlayer.pause();
            vidPlayer.src = "";

        }
        plr.remove();

        jQuery("video").addClass("hideVideo").removeClass("showVideo");
    }

    function pauseVideo() {
        if (hasFlashPlayer) {
            window.pauseFlashVideo();
            return
        }
        if (!vidPlayer) {
            return
        }
        vidPlayer.pause();

    }

    function resumeVideo() {
        if (hasFlashPlayer) {
            window.resumeFlashVideo();
            return
        }
        if (!vidPlayer) {
            return
        }
        if (!isPaused) {
            vidPlayer.play();
        }
    }

    function seekToInVideo(t) {
        if (hasFlashPlayer) {
            window.seekToInFlashVideo(t);
            return;
        }
        vidPlayer.currentTime = t;
    }

    function showVolumeSlider() {
        TweenLite.to(jQuery("#volumeSlider"), 0.5, {opacity: 1})
    }

    function hideVolumeSlider() {
        var rollOffDelay;

        rollOffDelay = setTimeout(function () {
            if (isVolumeOver == false) {
                fadeOutVolumeSlider();
                clearTimeout(rollOffDelay)
            } else {
                clearTimeout(rollOffDelay)
            }
        }, 300)

    }

    function fadeOutVolumeSlider() {
        TweenLite.to(jQuery("#volumeSlider"), 0.3, {opacity: 0})

    }

    function showVideoTooltip() {
        jQuery("#controlsWrapper").append(videoTimeTooltip)
    }

    function hideVideoTooltip() {
        videoTimeTooltip.remove();
    }

    function showVolumeTooltip() {
        var top = parseInt(jQuery("#volumeThumb").css("top"));
        var left = jQuery("#volumeThumb").css("left");
        jQuery("#controlsWrapper").append(volumeToolTip);
        volumeToolTip.css("top", -150 + "px");
        volumeToolTip.css("left", 841 + "px");
        volumeToolTip.text(getCurrentVolume());

        //console.log("showVolumeTooltip", jQuery("#volumeThumb").css("left"))
    }

    function hideVolumeTooltip() {
        volumeToolTip.remove();
    }

    function getCurrentVolume() {
//        trace("getCurrentVolume",scrubVolume )
        return parseInt(scrubVolume * 100);
    }

    function showTapCard() {
        var vidPlayer = jQuery("video");
        tapScreen.removeClass("hideVideo").addClass("showVideo");

        tapScreen.bind("click", function () {
            tapScreen.unbind("click");
//            console.log("tapScreen click")
            vidPlayer[0].play();
            tapScreen.removeClass("showVideo").addClass("hideVideo");
            tapScreen.removeClass("tapScreenNext").addClass("tapScreenNext")
        })
    }

    owner.init = init;
    owner.playSelection = playSelection;
    owner.killVideo = killVideo;
    owner.pauseVideo = pauseVideo;
    owner.resumeVideo = resumeVideo;
    owner.getCurrentVolume = getCurrentVolume;
    owner.showTapCard = showTapCard;
    owner.showEndCard = showEndCard;
    owner.updateTimeFields = updateTimeFields;
    owner.updateScrubberPosition = updateScrubberPosition;
    owner.onPlayingEvent = onPlayingEvent;
    return owner;

})();

