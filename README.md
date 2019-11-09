# @centcom/centcom

Monorepo for the Centcom project
#### *CentCom: The SS13 Management Service*

[Demo Site](http://centcom.ddmers.com) - [Github Organization](https://github.com/centcom-ss13) - [Service Homepage](https://centcom.services) (coming soon!)

## Building
This repository uses [lerna](https://github.com/lerna/lerna) and [yarn](https://github.com/yarnpkg/yarn) to manage sub-packages, as well as [npm-run-all](https://github.com/mysticatea/npm-run-all) for its utility in running node scripts.
 - `npm run setup:local` - Run full developer setup, including installation of global packages, installing all dependencies, and building all sub-repos.
 - `npm run start:local` - Run the development version
 - `npm run setup` - Run full production setup, including installation of global packages, installing all dependencies, and building all sub-repos.
 - `npm run start` - Run the production version
 - `npm run deploy` - Run `docker-compose` scripts on the built repositories
 - `npm run test` - Run `test` in all sub-repos
 
#### Other commands
 - `npm run globals` - Installs lerna, yarn, and npm-run-all globally
 - `npm run prepRepo` - Run `yarn install` in root repo
 - `npm run bootstrap` - Run `yarn install` in all sub-repos
 - `npm run build` - Run `build` in all sub-repos
 - `npm run build:local` - Run `build:local` in all sub-repos
 
## Contributing

Issues and PRs are welcome on all codebases