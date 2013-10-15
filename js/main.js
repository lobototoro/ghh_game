/* Author: Thibaut MAREILLE */



// Vars
var chrono, //nope
    countdown,//nope
    // config
    NB_ITEM = 10,
    tabItem = [],//nope
    count = 0,//nope
    timeResult,//nope
    // config ?
    tabImage = [
      {
        src:"img/50x50.jpg",
        width:50,
        height:50
      },
      {
        src:"img/60x60.jpg",
        width:60,
        height:60
      },
      {
        src:"img/70x70.jpg",
        width:70,
        height:70
      }
    ],
    // config
    stageWidth = 990,
    // config
    stageHeight = 500,
    // config
    lineLength = 8,
    // config
    totalSquare = 32,
    squareWidth = Math.floor(stageWidth / lineLength),
    squareHeight = Math.floor(stageHeight / (totalSquare/lineLength)),
    tabGrid = [],
    tabItem = [],
    isTouch,
    touchMoved, touchDown, touchBeginPosition, touchEndPosition, isLinkTouch,
    soundz;

function init(){

  isTouch = 'ontouchstart' in window;

  console.log("isTouch : ", isTouch);

  // Empeche la surbrillance des elements
  document.onselectstart = new Function ("return false");


  buildGrid();

  soundz = new Howl({
    urls: ['sounds/2040.mp3'],
    autoplay: false,
    buffer: true
  });

  $("#startGame").click(start);

}

function buildGrid(){

  for (var i = 0;i<totalSquare;i++) {

    var bounds = {};
    var ligne = Math.floor(i / lineLength);
    var colonne = i % lineLength;
    bounds.ignore = false;
    bounds.tl = colonne * squareWidth;
    bounds.tr = (colonne * squareWidth) + squareWidth;
    bounds.bl = (ligne * squareHeight);
    bounds.br = (ligne * squareHeight) + squareHeight;

    var posX = (colonne * squareWidth);
    var posY = (ligne * squareHeight);

    tabGrid.push(bounds);

    // Debug
    // $("#wrapper").append("<div class=\"square\" style=\"left:"+posX+"px;top:"+posY+"px\"></div>");

  }

  console.log("tabgrid", tabGrid);

}

function start() {

  $("#startGame").remove();

  chrono = new Chrono($("#chrono"));

  countdown = new Countdown($("#countdown"),3);
  countdown.start();
  $(countdown).on("onComplete",completeCountdown);

  //completeCountdown();

}

function completeCountdown(){

  $("#wrapper").bind('touchstart', onTouchStart);

  countdown = null;
  $("#countdown").remove();

  // BuildItem
  for (var i=0;i<NB_ITEM;i++) {

    var img = tabImage[random(0,tabImage.length-1,1)];

    // Model
    var itemModel = new app.Models.ItemModel();
    itemModel.set("image",img.src);
    itemModel.set("width",img.width);
    itemModel.set("height",img.height);

    var w = itemModel.get("width");
    var h = itemModel.get("height");

    // Tire un square Aleatoire
    var nbRandom = random(2,tabGrid.length-1,1);
    var rect = tabGrid[nbRandom];
    tabGrid.splice(nbRandom,1);

    var TL,TR,BL,BR;

    TL = rect.tl;
    if (TL < 0) TL = 0;
    TR = TL + (squareWidth-w);
    if (TR < 0) TR = 0;
    BL = rect.bl;
    if (BL < 0) BL = 0;
    BR = BL + (squareHeight-h);
    if (BR < 0) BR = 0;

    var randomX = random(TL,TR,1);
    var randomY = random(BL,BR,1);

    itemModel.set("posX",randomX);
    itemModel.set("posY",randomY);

    // View
    var itemView = new app.Views.ItemView({model:itemModel});

    tabItem.push(itemView);
    $("#wrapper").append(itemView.render().el);
    itemView.on("click", clickItem);

  }

  // Show Item with FadeIn
  animateItem();
  // Start Chrono
  chrono.start();

}

function animateItem(){

  for (var i=0;i<tabItem.length;i++) $(tabItem[i].el).delay(i*20).fadeIn(300);

}

function clickItem(e){
  soundz.play();
  this.remove();
  count++;
  if (count == NB_ITEM) {
    timeResult = chrono.getResult();
    finish();
  }

}

// TouchEvent

function onTouchStart(e) {

  e.preventDefault();

  touchDown = true;
  var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
  var elm = $(this).offset();
  var _x = touch.pageX - elm.left;
  var _y = touch.pageY - elm.top;
  touchBeginPosition = { x: _x , y: _y};

  $("#wrapper").bind('touchmove', onTouchMove);
  $("#wrapper").bind('touchend', onTouchEnd);

}

function onTouchMove(e) {

  e.preventDefault();

  var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
  var elm = $(this).offset();
  var x = touch.pageX - elm.left;
  var y = touch.pageY - elm.top;

  console.log("ontouchmove", x, y, elm, touch.pageX);

  $.each(tabItem, function(a, b) {
    var stagedItem = $(b.el),
        stagedItemX = parseInt(stagedItem.css('left')),
        stagedItemY = parseInt(stagedItem.css('top'))
        stagedItemW = stagedItemX + stagedItem.width(),
        stagedItemH = stagedItemY + stagedItem.height();
    if(stagedItemX < x && stagedItemW > x
      && stagedItemY < y && stagedItemH > y) {
      soundz.play();
      stagedItem.remove();
      count++;
      if (count == NB_ITEM) {
        timeResult = chrono.getResult();
        finish();
      }
    }
  });
}

function onTouchEnd(e) {

  if ( touchMoved ) {
    e.preventDefault();
  }

  var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
  var elm = $(this).offset();
  var _x = touch.pageX - elm.left;
  var _y = touch.pageY - elm.top;
  touchEndPosition = { x: _x , y: _y};

  $("#wrapper").unbind('touchmove', onTouchMove);
  $("#wrapper").unbind('touchend', onTouchEnd);

  touchDown = false;

  // console.log("position de départ", touchBeginPosition);

  // console.log("position de fin", touchEndPosition);

  /*$.each(tabItem, function(a, b) {
    var stagedItem = $(b.el),
        stagedItemX = parseInt(stagedItem.css('left')),
        stagedItemY = parseInt(stagedItem.css('top'));
    if(stagedItemX > touchBeginPosition.x && stagedItemX <= touchEndPosition.x) {
      soundz.play();
      stagedItem.remove();
      count++;
      if (count == NB_ITEM) {
        timeResult = chrono.getResult();
        finish();
      }
    }
  });*/
}

function finish(){

  chrono.stop();
  setTimeout(function(){alert("Votre résultat : "+timeResult);},100);

}

/* HELPERS */

function random(nMinimum, nMaximum, nRoundToInterval) {

  if (!nRoundToInterval || nRoundToInterval == null || nRoundToInterval == undefined) nRoundToInterval = 1;

  if(nMinimum > nMaximum) {
    var nTemp = nMinimum;
    nMinimum = nMaximum;
    nMaximum = nTemp;
  }

  var nDeltaRange = (nMaximum - nMinimum) + (1 * nRoundToInterval);
  var nRandomNumber = Math.random() * nDeltaRange;
  nRandomNumber += nMinimum;
  return floor(nRandomNumber, nRoundToInterval);

}

function floor(nNumber, nRoundToInterval) {

  return Math.floor(nNumber / nRoundToInterval) * nRoundToInterval;
}



$(document).ready(init);

