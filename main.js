/*jslint indent: 2, nomen: true, white: true */
/*global define, brackets, console */

define(function (require, exports, module) {
  'use strict';
  
  var CommandManager = brackets.getModule('command/CommandManager'),
      Menus          = brackets.getModule('command/Menus'),
      ProjectManager = brackets.getModule('project/ProjectManager'),
      
      clipboard = require('clipboard'),
      
      CID_FILENAME = 'ToClipboard.FileName',
      CID_FILEPATH = 'ToClipboard.FilePath',
      CID_DIRPATH  = 'ToClipboard.DirPath',
      
      WorkingSetMenu = Menus.getContextMenu(Menus.ContextMenuIds.WORKING_SET_MENU),
      ProjectMenu    = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU),
      FileMenu       = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
  
  function _copy(text) {
    return clipboard.copy(text);
  }
  
  function _selectedFile() {
    return ProjectManager.getSelectedItem();
  }
  
  function _filenameToClipboard() {
    _copy(_selectedFile()._name || _selectedFile().name);
  }
  
  function _filepathToClipboard() {
    _copy(_selectedFile()._path || _selectedFile().path);
  }
  
  function _dirpathToClipboard() {
    _copy(_selectedFile()._parentPath || _selectedFile().parentPath);
  }
  
  CommandManager.register('File name to clipboard', CID_FILENAME, _filenameToClipboard).setEnabled(false);
  CommandManager.register('File path to clipboard', CID_FILEPATH, _filepathToClipboard).setEnabled(false);
  CommandManager.register('Directory path to clipboard', CID_DIRPATH, _dirpathToClipboard).setEnabled(false);
  
  console.log('[FileInfo-ToClipboard] ...loading node module (menus disabled)');
  
  clipboard.done(function () {
    console.log('[FileInfo-ToClipboard] node module loading complete (menus enabled)');
    
    CommandManager.get(CID_FILENAME).setEnabled(true);
    CommandManager.get(CID_FILEPATH).setEnabled(true);
    CommandManager.get(CID_DIRPATH).setEnabled(true);
  });
  
  WorkingSetMenu.addMenuDivider();
  WorkingSetMenu.addMenuItem(CID_FILENAME);
  WorkingSetMenu.addMenuItem(CID_FILEPATH);
  WorkingSetMenu.addMenuItem(CID_DIRPATH);
  
  ProjectMenu.addMenuDivider();
  ProjectMenu.addMenuItem(CID_FILENAME);
  ProjectMenu.addMenuItem(CID_FILEPATH);
  ProjectMenu.addMenuItem(CID_DIRPATH);
  
  FileMenu.addMenuDivider();
  FileMenu.addMenuItem(CID_FILENAME);
  FileMenu.addMenuItem(CID_FILEPATH);
  FileMenu.addMenuItem(CID_DIRPATH);
  
});