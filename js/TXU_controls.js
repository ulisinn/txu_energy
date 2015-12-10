/**
 * Created by ulrichsinn on 02/03/2014.
 */

var TXU = TXU || {};

TXU.controls = (function () {
    var owner = {},
        toolTip,
        toolTipLabel,
        playPauseBtn,
        muteUnmuteBtn,
        volumeTrack,
        volumeThumb,
        scrubTrack,
        scrubThumb,
        totalTime,
        currentTime,
        isPlayButton = true,
        isUnmutedButton = true;

    function init() {
        playPauseBtn = jQuery("#playPauseButton");
        muteUnmuteBtn = jQuery("#muteUnmuteButton");

        scrubTrack = jQuery("#scrubPanel");
        scrubThumb = jQuery("#scrubCursor");
        volumeTrack = jQuery("#volumeSlider");
        volumeThumb = jQuery("#volumeThumb");

        totalTime = jQuery("#totalTime");
        currentTime = jQuery("#currentTime");

        playPauseBtn.bind("click", togglePlayPause);
        playPauseBtn.bind("mouseenter", onPlayOver);
        playPauseBtn.bind("mouseleave", onPlayOut);

        muteUnmuteBtn.bind("click", toggleMuteUnmute);
        muteUnmuteBtn.bind("mouseenter", onMuteOver);
        muteUnmuteBtn.bind("mouseleave", onMuteOut);

        scrubTrack.bind("mouseenter", onScrubOver);
        scrubTrack.bind("mouseleave", onScrubOut);

        volumeTrack.bind("mouseenter", onVolumeOver);
        volumeTrack.bind("mouseleave", onVolumeOut);

        toolTip = jQuery('<div class="toolTip">play</div>')
    }

    function togglePlayPause(e) {
        isPlayButton = !isPlayButton;
        console.log("togglePlayPause", isPlayButton);
        removePlayButtonDisplayStates()
        if (isPlayButton) {
            playPauseBtn.addClass("playButtonOver");
            toolTipLabel = "play"
        } else {
            playPauseBtn.addClass("pauseButtonOver");
            toolTipLabel = "pause"

        }
        showToolTip(toolTipLabel,e)

    }

    function onPlayOver(e) {
        removePlayButtonDisplayStates()
        if (isPlayButton) {
            playPauseBtn.addClass("playButtonOver");
            toolTipLabel = "play"
        } else {
            playPauseBtn.addClass("pauseButtonOver");
            toolTipLabel = "pause"
        }

        showToolTip(toolTipLabel,e)
    }

    function onPlayOut(e) {
        var label;

        removePlayButtonDisplayStates()
        if (isPlayButton) {
            playPauseBtn.addClass("playButtonUp");

        } else {
            playPauseBtn.addClass("pauseButtonUp");

        }

        hideToolTip()
    }

    function toggleMuteUnmute(e) {
        isUnmutedButton = !isUnmutedButton;
        removeMuteButtonDisplayStates()
        if (isUnmutedButton) {
            muteUnmuteBtn.addClass("muteButtonOver");
            toolTipLabel = "mute"

        } else {
            muteUnmuteBtn.addClass("unmuteButtonOver");
            toolTipLabel = "unmute"

        }

        showToolTip(toolTipLabel,e)

    }

    function onMuteOver(e) {
        removeMuteButtonDisplayStates()

        if (isUnmutedButton) {
            muteUnmuteBtn.addClass("muteButtonOver");
            toolTipLabel = "mute"

        } else {
            muteUnmuteBtn.addClass("unmuteButtonOver");
            toolTipLabel = "unmute"

        }
        showToolTip(toolTipLabel,e)

    }

    function onMuteOut(e) {
        removeMuteButtonDisplayStates()
        if (isUnmutedButton) {
            muteUnmuteBtn.addClass("muteButtonUp");
        } else {
            muteUnmuteBtn.addClass("unmuteButtonUp");
        }

        hideToolTip()
    }

    function onScrubOver(e){
        removeScrubDisplayStates()
        scrubTrack.addClass("scrubPanelOver")
        totalTime.addClass("timeDisplayOver")
        currentTime.addClass("timeDisplayOver")
    }

    function onScrubOut(e){
        removeScrubDisplayStates()
        scrubTrack.addClass("scrubPanelUp")
        totalTime.addClass("timeDisplayUp")
        currentTime.addClass("timeDisplayUp")
    }

    function onVolumeOver(e){
        removeVolumeTrackDisplayStates()
        volumeTrack.addClass("volumeSliderOver")

    }

    function onVolumeOut(e){
        removeVolumeTrackDisplayStates()
        volumeTrack.addClass("volumeSliderUp")
    }


    function removePlayButtonDisplayStates() {
        playPauseBtn.removeClass("playButtonUp playButtonOver pauseButtonUp pauseButtonOver");
    }

    function removeMuteButtonDisplayStates() {
        muteUnmuteBtn.removeClass("muteButtonUp muteButtonOver unmuteButtonUp unmuteButtonOver");
    }

    function removeScrubDisplayStates() {
        scrubTrack.removeClass("scrubPanelUp scrubPanelOver");
        totalTime.removeClass("timeDisplayUp timeDisplayOver");
        currentTime.removeClass("timeDisplayUp timeDisplayOver");
    }
    function removeVolumeTrackDisplayStates() {
        volumeTrack.removeClass("volumeSliderUp volumeSliderOver");
    }


    function showToolTip(label,event){
        toolTip.html(label)
        toolTip.css("top", "-28px")
        toolTip.css("left", jQuery(event.currentTarget).position().left + 8 + "px")
        jQuery("#controlsWrapper").append(toolTip)
        console.log("showToolTip",jQuery(event.currentTarget).position().left)
    }

    function hideToolTip(){
        toolTip.remove();

    }
    owner.init = init;

    return owner;
})();