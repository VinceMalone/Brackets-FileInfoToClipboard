/*jslint indent: 2, nomen: true, white: true, vars: true */
/*global define, brackets, console */

define(function (require, exports, module) {
  'use strict';
  
  var AppInit        = brackets.getModule('utils/AppInit'),
      ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
      NodeConnection = brackets.getModule('utils/NodeConnection'),
      nodeConnection = new NodeConnection(),
      
      _done = false,
      _doneFn = function () {};
  
  function chain() {
    var functions = Array.prototype.slice.call(arguments, 0);
    if (functions.length > 0) {
      var firstFunction = functions.shift(),
          firstPromise = firstFunction.call();
      firstPromise.done(function () {
        chain.apply(null, functions);
      });
    }
  }
  
  function _appReady() {
    
    function connect() {
      var connectionPromise = nodeConnection.connect(true);
      connectionPromise.fail(function () {
        console.error('[brackets-simple-node] failed to connect to node');
      });
      return connectionPromise;
    }
    
    function loadClipboard() {
      var path = ExtensionUtils.getModulePath(module, 'node/clipboard'),
          loadPromise = nodeConnection.loadDomains([path], true);
      loadPromise.fail(function (e) {
        console.log(e);
        console.log('[brackets-simple-node] failed to load clipboard');
      });
      return loadPromise;
    }
    
    function clipboardLoad() {
      var loadPromise = nodeConnection.domains.clipboard.load();
      loadPromise.fail(function (err) {
        console.error('[brackets-simple-node] failed to run clipboard.load', err);
      });
      loadPromise.done(function (err) {
        // loaded
        _done = true;
        _doneFn();
      });
      return loadPromise;
    }
    
    chain(connect, loadClipboard, clipboardLoad);
    
  }
  
  function done(fn) {
    if (typeof fn === 'function') {
      if (_done) {
        fn();
      } else {
        _doneFn = fn;
      }
    }
  }
  
  function copy(text) {
    if (_done) {
      return nodeConnection.domains.clipboard.callCopy(text);
    }
  }
  
  /*function paste() {
    if (_done) {
      return nodeConnection.domains.clipboard.callPaste();
    }
  }*/
  
  AppInit.appReady(_appReady);
  
  exports.done = done;
  exports.copy = copy;
  //exports.paste = paste;
  
});