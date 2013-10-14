var Chrono;

/* Classes Chrono */

Chrono = (function() {

  function Chrono(selector) {

    console.log("new Chrono()");

    this.isActive = false;
    this.elapsed = 0;
    this.first = 0;
    this.last = 0;

    this.selector = selector;
    this.timer;
    this.show();

  }

  // Getter isActive
  Chrono.prototype.isActive = function() {
    return this.isActive;
  };

  // Stop Chrono
  Chrono.prototype.stop = function() {
    if (this.isActive) {
      window.clearInterval(this.timer);
      this.last = (new Date()).getTime();
      this.elapsed += (this.last-this.first);
      this.isActive = false;
    }
    return true;
  };

  // Start Chrono
  Chrono.prototype.start = function() {

    if (!this.isActive) {
      this.first = (new Date()).getTime();
      this.isActive = true;
      var c = this;
      this.timer = window.setInterval(function() {c.show()}, 10);
    }
    return true;
  };

  Chrono.prototype.getResult = function() {

    return this.getData();

  };

  // Show
  Chrono.prototype.show = function() {

    $(this.selector).html(this.getData());
    return true;

  };

  // Hide
  Chrono.prototype.hide = function() {

    window.clearTimeout(this.timer);
    return true;

  };

  // Hide
  Chrono.prototype.raz = function() {

    if (!this.isActive) {
      this.elapsed = 0;
      this.first = 0;
      this.last = 0;
      this.show();
    }
    return true;

  };

  // Get
  Chrono.prototype.getData = function() {

    var cnow;
    if (this.isActive) {
      this.last = (new Date()).getTime();
      cnow = new Date(this.elapsed+(this.last-this.first));
    } else {
      cnow=new Date(this.elapsed);
    }
    var ch = parseInt(cnow.getHours()) - 1;
    var cm = cnow.getMinutes();
    var cs = cnow.getSeconds();
    var cc = parseInt(cnow.getMilliseconds()/10);
    if (cc<10) cc = "0"+cc;
    if (cs<10) cs = "0"+cs;
    if (cm<10) cm = "0"+cm;
    return (ch+":"+cm+":"+cs+":"+cc);

  };

  return Chrono;

})();





