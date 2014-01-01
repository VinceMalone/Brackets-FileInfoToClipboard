/*jslint indent: 2 */
/*global require, exports */

(function () {
  'use strict';
  
  var copy_paste = require('copy-paste');
  
  /**
   * @private
   * Handler function for the fileInfoToClipboard.load command.
   */
  function cmdLoad() {}
  
  /**
   * @private
   * Handler function for the fileInfoToClipboard.copy command.
   * @param {string} data Copies data to clipboard.
   */
  function cmdCopy(data) {
    copy_paste.copy(data);
  }
  
  /**
   * Initializes the domain.
   * @param {DomainManager} DomainManager The DomainManager for the server.
   */
  function init(DomainManager) {
    if (!DomainManager.hasDomain('fileInfoToClipboard')) {
      DomainManager.registerDomain('fileInfoToClipboard', {major: 0, minor: 1});
    }
    
    DomainManager.registerCommand(
      'fileInfoToClipboard',  // domain name
      'copy',                 // command name
      cmdCopy,                // command handler function
      false,                  // this command is synchronous
      'Copies data to clipboard.',
      [{name: 'data', type: 'string', description: 'data to be copied'}],
      []                      // no return
    );
    
    DomainManager.registerCommand(
      'fileInfoToClipboard',  // domain name
      'load',                 // command name
      cmdLoad,                // command handler function
      false,                  // this command is synchronous
      'Loads fileInfoToClipboard.',
      [],                     // no parameters
      []                      // no return
    );
  }
  
  exports.init = init;
  
}());