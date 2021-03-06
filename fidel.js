/*!
  * Fidel - A javascript controller 
  * https://github.com/jgallen23/fidel
  * copyright JGA 2011
  * MIT License
  */

(function(obj) {
  var eventSplitter = /^(\w+)\s*(.*)$/;
      
  var Fidel = function() {
    return {
      _initialize: function(options) {

        for (var key in options) {
          this[key] = options[key];
        }
        
        if (this.events) this.delegateEvents();
        if (this.elements) this.refreshElements();
        if (this.templateSelector) this.loadTemplate();
      },
      proxy: function(func){
        var self = this;
        return(function(){ 
          return func.apply(self, arguments); 
        });
      },
      delegateEvents: function() {
        for (var key in this.events) {
          var methodName = this.events[key];
          var method = this.proxy(this[methodName]);

          var match = key.match(eventSplitter);
          var eventName = match[1], selector = match[2];

          if (selector === '') {
            this.el.bind(eventName, method);
          } else {
            this.el.delegate(selector, eventName, method);
          }
        }
      },
      refreshElements: function() {
        for (var key in this.elements) {
          this[key] = this.find(this.elements[key]);
        }
      },
      loadTemplate: function() {
        this.template = $(this.templateSelector).html();
      },
      find: function(selector) {
        return $(selector, this.el[0]);
      },
      render: function(data, selector) {
        if (str) {
          var tmp = str.template(this.template, data);
          selector = $(selector) || this.el;
          selector.html(tmp);
        }
      },
      trigger: function(name, val) {
        $(this).trigger(name, val);
      },
      bind: function(name, handler) {
        $(this).bind(name, handler);
      }
    };
  };
  Fidel.extend = function(obj) {
    var k = function Controller() {
      this._initialize.apply(this, arguments);
      if (this.init) this.init.apply(this, arguments);
    };
    k.prototype = new this();
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) k.prototype[key] = obj[key]; 
    }
    k.prototype.constructor = k;
    return k;
  };

  var o = obj.Fidel;
  Fidel.noConflict = function() {
    obj.Fidel = o;
    return this;
  };
  obj.Fidel = Fidel;
})(window);
