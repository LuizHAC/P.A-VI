// Navigates to the second page
function playGame(){
    setTimeout( () => window.location.href = "../Game_Page/index.html", 1000);
}

// Play music
function playMusic(){
    var myMusic = document.getElementById("music")
    myMusic.volume = 0.6; //max 1.0
    myMusic.play();
}

// Loads the menu
function loadMenu(){
    setTimeout( () => window.location.href = "../Settings_Page/index.html", 1000);
}