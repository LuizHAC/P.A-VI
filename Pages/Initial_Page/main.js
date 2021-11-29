// Navigates to the second page
function playGame(){

    setTimeout( () => window.location.href = "../Game_Page/index.html", 1000);
}

// Play music
function playMusic(){
    var myMusic = document.getElementById("music")
    myMusic.play();
}