# TODO

Basically just random notes and docs on stuff to be done...

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
