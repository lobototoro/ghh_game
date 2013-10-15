// Class gamez
var Game = function(options) {
  this.NB_ITEM = 10;
  this.tabItem = [];
  this.count = 0;
  this.tabImage = [
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
  ];
  this.stageWidth = 990;
  // config
  this.stageHeight = 500;
  // config
  this.lineLength = 8;
  // config
  this.totalSquare = 32;
  this.squareWidth = Math.floor(stageWidth / lineLength);
  this.squareHeight = Math.floor(stageHeight / (totalSquare/lineLength));
  this.tabGrid = [];
  this.tabItem = [];
  this.chrono;
  this.countdown;
  this.timeResult;
  this.isTouch;
  this.touchMoved;
  this.touchDown;
  this.touchBeginPosition;
  this.touchEndPosition;
  this.isLinkTouch;
  this.soundz;

}