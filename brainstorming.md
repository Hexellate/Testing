# TODO

Basically just random notes and docs on stuff to be done...

## Ordered todo

- ~~remove classes from managers~~ They actually need to stay as classes as long as they're event emitters. (it's fine with the singleton pattern)
- ~~rename managers to not managers~~ DONE!
- change folder structure of project
- split big files into multiple
- jsdocs should be on functions and classes only
- ~~see if possible to remove event based loading sequence~~ DONE!
  - remove stage based loading?
- redo config manager with a better structure
- split window manager on background and splash (windowmanager should only do main windows and modals(?))
- prepare to be used as a library (HexLib)
- design renderside interfaces to be solution agnostic (don't require redux)

## Someday todo

- Cleanup project as whole
- Replace electron-webpack with just webpack
- Clean up build script

## Random notes

This repo will eventually be moved/renamed under the new name of HexLib

HexLib will handle a variety of menial tasks that are important in an electron application (i.e. configs, window management etc...)
It will be an internally used lib, although in future it may be cleaned up for general use

Should background be a renderer or a child process???
~~tray should be a renderer because then it has access to browserwindow stuff... unless it can be done without?~~ - Tray is actually not separate process XD

Probs stay with js, although ts needs proper consideration
Maybe introduce flowtype? need flowtype for eslint then

docs:

- jsdocs for functions and classes
- need to create a good site for docs
- maybe use jsdoc for internals with custom template?

  - should have:
    - api docs and developer docs
    - option to see docs for different versions
    - good reactive interface
    - user docs

- GIT:
- Go through gitattributes file to properly set up stuff (i.e. do not include app driver script in merges, or keep branch specific stuff)

- Startup procedure (sync except where noted):

- Preinit
  - Load config manager
  - Load window manager
  - Load update manager
- Init
  - Load background task
  - Load main window(s)
- Postinit
  - Register config watcher

* Load config [config manager]
  - open config file
    - if not exists
      - create new file
    - if exists
      - check valid json
      - check integrity?
      - check version
        - if old version
          - transform to new version
      - if corrupt or invalid
        - check for backup version
          - open first backup
          - verify integrity
* open splash [window manager]
  - check update if configured
    - if update
      - download update
      - install update
      - restart
    - if no update
      - start background task (parallel)
* on finish load

  - open main window
  - close splash

* shutdown procedure (sync except where noted):
  - close modals (parallel)
    - procedure managed by each modal
  - close main windows (parallel)
    - procedure managed by each window
  - close background task (single async - wait)
    - procedure managed by background task
  - verify config is saved
    - load config file
    - take checksum
    - get checksum of active config
    - if mismatch
      - overwrite config
  - check for downloaded update
    - if downloaded (should only download if configured)
      - install on close
    - else
      - close

Plugins:

- Plugins will be loaded in render processes only, to prevent pollution of main thread
- There may be an api to implement additional server-side things, although it will be quite restricted
- Plugins must include a "defines" object, which will define what is included in a way that will be loaded by the application
- Some API functions will be available from main renderers, while others may be accessible only from the background process
- Plugins will be identified by a hash, generated from the plugin name and author (If the author changes, then it is considered to be a different plugin)
- Plugins will have a secondary identifier of their name, which must be used to prevent collisions
- If two plugins have the same name and author (and consequently hash), they must fail to load (either individually, or the whole application)

Configs:

- All configurations will go through the same config manager, running in main, which will identify configs by a label or a hash in the case of a plugin
- If the identifier is a hash, the plugin name and author must also be checked

Profiles:

- Support for multiple user profiles (on an architecture level, to properly support later)

Secure stuff to store:

- Things like google drive key and user password hashes need to be stored securely, so a generic secure store for such things needs to be implemented (Probably defer to later...)

- Basic Architecture:
- The main script file will be application agnostic, where application specific things are defined in a driver script and then passed as an object to the main script
- The renderer will be application agnostic as well, but should be treated as a framework rather than as a library (opposite to main process)
- The driver script will set things such as if to load the background process, the application name etc... All logic of actually handling these settings will be managed in main rather than the driver
- Main will be for basic stuff such as window management and config management
- Background will be for server side stuff, i.e. stuff that may need to be remotely accessed
- Render will be for everything else
