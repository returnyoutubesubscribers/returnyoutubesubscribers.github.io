let lastCid = "";
let lastCid2 = "";
let urlID = "";
function init() {
    if (window.location.href.includes('/watch?v=') || window.location.href.includes('/c/') || window.location.href.includes('/channel/') || window.location.href.includes('/user/') || window.location.href.includes('/results?search_query=')) {
        let cid = ""
        let subCount = "";
        let video = false;
        urlID = window.location.href.split("/")[4];
        if (window.location.href.split('/').length >= 4 && window.location.href.includes('/watch?v=') == false && window.location.href.includes('/channel/') == false) {
            for (let q = 0; q < document.getElementsByTagName('META').length; q++) {
                if (document.getElementsByTagName('META')[q].name.includes('url')) {
                    cid = document.getElementsByTagName('META')[q].content.split('/')[4];
                    subCount = "subscriber-count";
                    break;
                }
            }
        }
        if (window.location.href.includes('/channel/')) {
            cid = window.location.href.split('/')[4];
            subCount = "subscriber-count";
        }
        if (window.location.href.includes('/watch?v=')) {
            cid = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-video-owner-renderer')[0].href.split('/channel/')[1]
            subCount = "owner-sub-count";
            video = true;
        }
        if (window.location.href.includes('/results?search_query=')) {
            let script = document.createElement("script");
            script.innerHTML = `
        if (localStorage.getItem("lastURL") !== window.location.href) {
            location.reload();
        }
        localStorage.setItem("lastURL", window.location.href);
        cid = "";
        if (window.ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].channelRenderer) {
            cid = window.ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].channelRenderer.channelId;
        } else {
            cid = window.ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[1].videoRenderer.videoId;
        }
        fetch('https://mixerno.space/api/youtube-channel-counter/user/' + cid + '')
        .then(response => response.json())
        .then(data => {
            document.getElementById('content-section').children[1].children[0].children[0].children[1].children[0].innerHTML = '' + data.counts[0].count.toLocaleString("en-US") + ' subscribers';
        })`;
            document.body.appendChild(script);
        }

        if (cid == lastCid && video == false && window.location.href !== "https://www.youtube.com/" && window.location.href.includes("https://www.youtube.com/results") == false) {
            if (window.location.href.includes('/channel/')) {
                if (window.location.href.includes("https://www.youtube.com/channel/" + urlID + "/") == false) {
                    window.location.href = window.location.href;
                }
            } else if (window.location.href.includes('/c/')) {
                if (window.location.href.includes("https://www.youtube.com/c/" + urlID + "/") == false) {
                    window.location.href = window.location.href;
                }
            } else if (window.location.href.includes('/user/')) {
                if (window.location.href.includes("https://www.youtube.com/user/" + urlID + "/") == false) {
                    window.location.href = window.location.href;
                }
            } else {
                window.location.href = window.location.href;
            }
        }

        fetch('https://mixerno.space/api/youtube-channel-counter/user/' + cid + '')
            .then(response => response.json())
            .then(data => {
                lastCid = cid;
                lastCid2 = video;
                console.log(data)
                document.getElementById(subCount).innerText = '' + data.counts[0].count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' subscribers';
            })
    }
}

window.addEventListener("yt-page-data-updated", init, true);