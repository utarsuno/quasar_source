# Quasar Source

---

### documentation
Just useful notes and guides to be referenced later. Documentation is under heavy edits.

## Entities
Notes to be sorted :
Each object that extends 'Entity' must include the 'get_additional_needed_save_info' in order to be saved into the database.

## Needs to be updated (text below) :

### quasar_source_code
| Directory | Description |
| --- | --- |
| database_api | Abstract API to working with databases. |
| docker_related | Mostly TODO for now. |
| finance | Under heavy development. |
| python_code_generator | Need to transfer previous version of this and then refactor. |
| universal_code | Modules to be used by all other Python modules. |
| web_files | All web server files including HTML, JS, and CSS. |

### quasar_site
Django code for QuasarSource.com.

### quality_assurance
A duplicate directory strcuture of *qyasar_source_code* except is soley unit tests of each program file.

### all_scripts
| Directory | Description |
| --- | --- |
| build_three_js | TODO, builds the latest version of the Three.js library. |
| local | Bash scripts to be run locally from a programmer's system. |
| server | Bash scripts to be ran on servers and NOT locally. |
| universal_scripts | Universal functions and scripts to be referenced from the other bash scripts. |
