/*jslint indent: 2, nomen: true, white: true, vars: true */
/*global define, brackets, console */

define(function (require, exports, module) {
  'use strict';
  
  var AppInit        = brackets.getModule('utils/AppInit'),
      ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
      NodeConnection = brackets.getModule('utils/NodeConnection'),
      
      _fileInfoToClipboard = null,
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
  
  AppInit.appReady(function () {
    var nodeConnection = new NodeConnection();
    
    function connect() {
      var connectionPromise = nodeConnection.connect(true);
      connectionPromise.fail(function (err) {
        console.error('[brackets-fileInfoToClipboard-node] failed to connect to node.', err);
      });
      return connectionPromise;
    }
    
    function loadFileInfoToClipboardDomain() {
      var path = ExtensionUtils.getModulePath(module, 'node/FileInfoToClipboardDomain'),
          loadPromise = nodeConnection.loadDomains([path], true);
      loadPromise.fail(function (err) {
        console.error('[brackets-fileInfoToClipboard-node] failed to load domain.', err);
      });
      return loadPromise;
    }
    
    function loadFileInfoToClipboard() {
      var loadPromise = nodeConnection.domains.fileInfoToClipboard.load();
      loadPromise.fail(function (err) {
        console.error('[brackets-fileInfoToClipboard-node] failed to run load.', err);
      });
      loadPromise.done(function () {
        _fileInfoToClipboard = nodeConnection.domains.fileInfoToClipboard;
        _doneFn();
      });
      return loadPromise;
    }
    
    chain(connect, loadFileInfoToClipboardDomain, loadFileInfoToClipboard);
  });
  
  /**
   * Set, or run, callback function to use after brackets-fileInfoToClipboard-node has finished loading.
   * @param {function()} fn Done callback function.
   */
  function done(fn) {
    if (typeof fn === 'function') {
      if (_fileInfoToClipboard) {
        fn();
      } else {
        _doneFn = fn;
      }
    }
  }
  
  /**
   * Copy data to clipboard
   * @param {string} data Data to be copied.
   */
  function copy(data) {
    if (_fileInfoToClipboard && _fileInfoToClipboard.copy) {
      _fileInfoToClipboard.copy(data);
    }
  }
  
  exports.done = done;
  exports.copy = copy;
  
});