/**
 * Created by ulrichsinn on 03/12/2014.
 */

var TXU = TXU || {};

TXU.flashVideo = (function () {
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

    function getFlashPlayer(id) {
        var flashContent = jQuery('<div id="flashContent"></div>')
        jQuery("#videoPlayerWrapper").append(flashContent);
        console.log(id);
        var swfVersionStr = "9.0.0";
        // To use express install, set to playerProductInstall.swf, otherwise the empty string.
        var xiSwfUrlStr = "swf/playerProductInstall.swf";
        var flashvars = {videoSource: id};
        var params = {};
        params.quality = "high";
        params.bgcolor = "#ffffff";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "false";
        params.wmode = "transparent"
        var attributes = {};
        attributes.id = "flashVideo";
        attributes.name = "flashVideo";
        attributes.align = "top";
        swfobject.embedSWF(
            "swf/VideoPlayer.swf", "flashContent",
            "920px", "520px",
            swfVersionStr, xiSwfUrlStr,
            flashvars, params, attributes);

        return flashContent;
    }

    owner.getFlashPlayer = getFlashPlayer;
    return owner;
}())