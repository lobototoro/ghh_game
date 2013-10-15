// Class gamez
var Game = function(options) {
  _this = this;
  this.NB_ITEM = 10;
  this.tabItem = [];
  this.count = 0;
  this.tabImage = [ // from config
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
  this.squareWidth = Math.floor(this.stageWidth / this.lineLength);
  this.squareHeight = Math.floor(this.stageHeight / (this.totalSquare/this.lineLength));
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

  if(options != null)
    $.extend(this, options);

  this.init = function() {
    _this.isTouch = 'ontouchstart' in window;

    // console.log("isTouch : ", _this.isTouch);

    // Empeche la surbrillance des elements
    document.onselectstart = new Function ("return false");


    _this.buildGrid();

    _this.soundz = new Howl({
      urls: ['sounds/sprite.mp3'], // configurable variable for sound
      sprite:{
        kick: [0, 871],
        blip: [871, 900]
      },
      autoplay: false,
      buffer: true
    });

    $("#startGame").click(_this.start); // selector for button "start game"
  }
  this.buildGrid = function() {
    for (var i = 0;i<_this.totalSquare;i++) {

      var bounds = {};
      var ligne = Math.floor(i / _this.lineLength);
      var colonne = i % _this.lineLength;
      bounds.ignore = false;
      bounds.tl = colonne * _this.squareWidth;
      bounds.tr = (colonne * _this.squareWidth) + _this.squareWidth;
      bounds.bl = (ligne * _this.squareHeight);
      bounds.br = (ligne * _this.squareHeight) + _this.squareHeight;

      var posX = (colonne * _this.squareWidth);
      var posY = (ligne * _this.squareHeight);

      _this.tabGrid.push(bounds);

      // Debug
      $("#wrapper").append("<div class=\"square\" style=\"left:"+posX+"px;top:"+posY+"px\"></div>");

    }

    //console.log("tabgrid", _this.tabGrid);
  }
  this.start = function() {
    $("#startGame").remove();

    _this.chrono = new Chrono($("#chrono"));

    _this.countdown = new Countdown($("#countdown"),3, _this.soundz);
    _this.countdown.start();
    $(_this.countdown).on("onComplete", _this.completeCountdown);

    //completeCountdown();
  }
  this.completeCountdown = function() {
    $("#wrapper").bind('touchstart', _this.onTouchStart);

    _this.countdown = null;
    $("#countdown").remove();

    // BuildItem
    for (var i=0;i<_this.NB_ITEM;i++) {

      var img = _this.tabImage[_this.random(0,_this.tabImage.length-1,1)];

      // Model
      var itemModel = new app.Models.ItemModel();
      itemModel.set("image",img.src);
      itemModel.set("width",img.width);
      itemModel.set("height",img.height);

      var w = itemModel.get("width");
      var h = itemModel.get("height");

      // Tire un square Aleatoire
      var nbRandom = _this.random(2,_this.tabGrid.length-1,1);
      var rect = _this.tabGrid[nbRandom];
      _this.tabGrid.splice(nbRandom,1);

      var TL,TR,BL,BR;

      TL = rect.tl;
      if (TL < 0) TL = 0;
      TR = TL + (_this.squareWidth-w);
      if (TR < 0) TR = 0;
      BL = rect.bl;
      if (BL < 0) BL = 0;
      BR = BL + (_this.squareHeight-h);
      if (BR < 0) BR = 0;

      var randomX = _this.random(TL,TR,1);
      var randomY = _this.random(BL,BR,1);

      itemModel.set("posX",randomX);
      itemModel.set("posY",randomY);

      // View
      var itemView = new app.Views.ItemView({model:itemModel});

      _this.tabItem.push(itemView);
      $("#wrapper").append(itemView.render().el);
      itemView.on("click", _this.clickItem);

    }

    // Show Item with FadeIn
    _this.animateItem();
    // Start Chrono
    _this.chrono.start();
  }
  this.animateItem = function() {

    for (var i=0;i<_this.tabItem.length;i++) $(_this.tabItem[i].el).delay(i*20).fadeIn(300);

  }
  this.clickItem = function(e) {
    _this.soundz.play('blip');
    this.remove();
    _this.count++;
    if (_this.count == _this.NB_ITEM) {
      _this.timeResult = _this.chrono.getResult();
      _this.finish();
    }
  }
  // TouchEvent
  this.onTouchStart = function(e) {
    e.preventDefault();

    _this.touchDown = true;
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    var elm = $(this).offset();
    var _x = touch.pageX - elm.left;
    var _y = touch.pageY - elm.top;
    _this.touchBeginPosition = { x: _x , y: _y};

    $("#wrapper").bind('touchmove', _this.onTouchMove); // wrapper selector to pass in options
    $("#wrapper").bind('touchend', _this.onTouchEnd);
  }
  this.onTouchMove = function(e) {
    e.preventDefault();

    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    var elm = $(this).offset();
    var x = touch.pageX - elm.left;
    var y = touch.pageY - elm.top;

    // console.log("ontouchmove", x, y, elm, touch.pageX);

    $.each(_this.tabItem, function(a, b) {
      var stagedItem = $(b.el),
          stagedItemX = parseInt(stagedItem.css('left')),
          stagedItemY = parseInt(stagedItem.css('top'))
          stagedItemW = stagedItemX + stagedItem.width(),
          stagedItemH = stagedItemY + stagedItem.height();
      if(stagedItemX < x && stagedItemW > x
        && stagedItemY < y && stagedItemH > y) {
        _this.swipeItem(stagedItem);
      }
    });
  }
  this.onTouchEnd = function(e) {
    if ( _this.touchMoved ) {
      e.preventDefault();
    }

    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    var elm = $(this).offset();
    var _x = touch.pageX - elm.left;
    var _y = touch.pageY - elm.top;
    _this.touchEndPosition = { x: _x , y: _y};

    $("#wrapper").unbind('touchmove', _this.onTouchMove);
    $("#wrapper").unbind('touchend', _this.onTouchEnd);

    _this.touchDown = false;
  }
  this.finish = function(e) {
    _this.chrono.stop();
    setTimeout(function(){alert("Votre résultat : "+_this.timeResult);},100); // last popin of result
    // here, care to save the result  (cookie or localstorage)
  }
  this.swipeItem = function(element) {
    _this.soundz.play('blip');
    element.remove();
    _this.count++;
    console.log(_this.count, _this.NB_ITEM);
    if (_this.count === _this.NB_ITEM) {
      _this.timeResult = _this.chrono.getResult();
      _this.finish();
    }
  }
  this.random = function(nMinimum, nMaximum, nRoundToInterval) {

    if (!nRoundToInterval || nRoundToInterval == null || nRoundToInterval == undefined) nRoundToInterval = 1;

    if(nMinimum > nMaximum) {
      var nTemp = nMinimum;
      nMinimum = nMaximum;
      nMaximum = nTemp;
    }

    var nDeltaRange = (nMaximum - nMinimum) + (1 * nRoundToInterval);
    var nRandomNumber = Math.random() * nDeltaRange;
    nRandomNumber += nMinimum;
    return _this.floor(nRandomNumber, nRoundToInterval);
  }
  this.floor = function(nNumber, nRoundToInterval) {
    return Math.floor(nNumber / nRoundToInterval) * nRoundToInterval;
  }
  return this;
};

(function($){

  var game = new Game({
    /*NB_ITEM: 4,
    stageWidth: 390,
    stageHeight: 196,
    lineLength:4,
    totalSquare:8*/
  });
  // console.log(game);
  game.init();
})(jQuery, window);