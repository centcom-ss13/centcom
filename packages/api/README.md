# @centcom/server

The back-end REST API for CentCom

## CentCom
### *The SS13 Management Service*

[Demo Site](http://centcom.ddmers.com) - [Github Organization](https://github.com/centcom-ss13) - [Service Homepage](https://centcom.services) (coming soon!)

## Building

This module includes database configuration and migrations.  Configuration is contained within `/src/config` for the specified `NODE_ENV` environment variable.

 - `run-s build` - Build the server into a bundle located at `/dist/bundle.js`
 - `run-s start` - Serve a static production website
 - `run-s start:local` - Start the live build development website
 - `run-s test` - Run the mocha tests
