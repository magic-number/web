#! /usr/bin/env node
"use strict"

const finalhandler = require('finalhandler')
const process = require('process')
const program = require('commander')
const http = require('http')
const path = require('path')
const spawn = require('child_process')
const fs = require('fs')
const serveStatic = require('serve-static')

program
  .command('start')
  .option('-h, --host <host>', 'magic server host', '0.0.0.0')
  .option('-p, --port <port>', 'magic server port', '1212')
  .action(function (cmd) {
    const { host, port } = cmd
    var serve = serveStatic(path.join(__dirname, '../dist'), {'index': ['index.html']})

    const server = http.createServer(function onRequest (req, res) {
      serve(req, res, finalhandler(req, res))
    })
     
    server.listen(port, host)

    const mf = path.join(process.cwd(), "magic.json")
    if (fs.existsSync(mf)) {
      const magic = fs.readFileSync(mf)
      const magicConf = JSON.parse(magic)
      if (magicConf && magicConf.host && magicConf.port) {
        const url = `http://${host}:${port}/index.html?magicServer=${encodeURIComponent(`http://${magicConf.host}:${magicConf.port}`)}`
        spawn.exec(`start ${url}`)
        console.info(`Visit Magic Web GUI ${url}`)
        return
      }
    }
    spawn.exec(`start http://${host}:${port}`)
    console.info(`Visit Magic Web GUI http://${host}:${port}`)
  })
  .version(process.env.npm_package_version)

  program.parse(process.argv)