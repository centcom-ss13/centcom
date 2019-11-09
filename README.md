# @centcom/centcom

Monorepo for the Centcom project
#### *CentCom: The SS13 Management Service*

[Demo Site](http://centcom.ddmers.com) - [Github Organization](https://github.com/centcom-ss13) - [Service Homepage](https://centcom.services) (coming soon!)

## Getting Started

This repository uses [lerna](https://github.com/lerna/lerna) and [yarn](https://github.com/yarnpkg/yarn) to manage sub-packages, as well as [npm-run-all](https://github.com/mysticatea/npm-run-all) for its utility in running node scripts.

 - If you have not already done so, aquire [npm](https://www.npmjs.com/) (version 8.15 or higher).
 - Clone this repo: `git clone git@github.com:centcom-ss13/centcom.git`
 - To start development, type `npm run setup:local`
 - To start development runtimes (after building): `npm run start:local`
 - To re-build locally: `npm run build:local`
 - To build and run the production environment, type: `npm run setup && npm run start`
 
That's it!  There are more commands listed below, but these are enough to get you running.

## Commands
 - `npm run globals` - Installs lerna, yarn, and npm-run-all globally
 - `npm run prepRepo` - Run `yarn install` in root repo
 - `npm run bootstrap` - Run `yarn install` in all sub-repos
 - `npm run build` - Run `build` in all sub-repos
 - `npm run build:local` - Run `build:local` in all sub-repos
 - `npm run setup:local` - Run full developer setup, including installation of global packages, installing all dependencies, and building all sub-repos.
 - `npm run start:local` - Run the development version
 - `npm run setup` - Run full production setup, including installation of global packages, installing all dependencies, and building all sub-repos.
 - `npm run start` - Run the production version
 - `npm run deploy` - Run `docker-compose` scripts on the built repositories
 - `npm run test` - Run `test` in all sub-repos

## Config
Config files are used to set all ports and hostnames, as well as for MySQL connection information.

The NODE_ENV environment variable determines which config file is used.  See [config](https://www.npmjs.com/package/config) for more information - config values can also be set by environment variables.

Config folders exist in `packages/ui/config` and `packages/api/config`
 
## Contributing

Issues and PRs are welcome on all codebases