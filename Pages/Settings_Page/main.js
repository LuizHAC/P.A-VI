// Loads the menu
function loadMenu(){
    setTimeout( () => window.location.href = "../Initial_Page/index.html", 1000);
}

function togglePlay() {
    var myMusic = document.getElementById("music")
    myMusic.volume = 0.6; //max 1.0
    return myMusic.paused ? myMusic.play() : myMusic.pause();
};