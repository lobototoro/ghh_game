var Countdown;

/* Classes Chrono */

Countdown = (function() {

  function Countdown(selector,n) {

    console.log("new Countdown()");

    this.selector = selector;
    this.indice = n;
    this.timer;

    this.updateUI(this.indice);

  }

  Countdown.prototype.start = function() {

    this.updateUI(this.indice);

    var c = this;
    this.timer = window.setInterval(function() {c.decrease()}, 1000);
    return true;
  };

  Countdown.prototype.decrease = function() {

    this.indice--;

    if (this.indice == 0) {
      window.clearInterval(this.timer);
      this.complete();
    }

    this.updateUI(this.indice);


    return true;
  };

  Countdown.prototype.updateUI = function(n) {

    $(this.selector).hide();
    $(this.selector).html(n);
    $(this.selector).fadeIn(200);

    return true;
  };

  Countdown.prototype.complete = function() {

    $(this).trigger("onComplete");
    return true;
  };

  return Countdown;

})();





