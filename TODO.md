# TODO

Basically just random notes and docs on stuff to be done...

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
