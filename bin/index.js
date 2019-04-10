#! /usr/bin/env node

const finalhandler = require('finalhandler');
const process = require('process');
const program = require('commander');
const http = require('http');
const path = require('path');
const spawn = require('child_process');
const fs = require('fs');
const serveStatic = require('serve-static');

program
  .command('start')
  .option('-h, --host <host>', 'magic server host', '0.0.0.0')
  .option('-p, --port <port>', 'magic server port', '1212')
  .action((cmd) => {
    const { host, port } = cmd;
    const serve = serveStatic(path.join(__dirname, '../dist'), { index: ['index.html'] });

    const server = http.createServer((req, res) => {
      serve(req, res, finalhandler(req, res));
    });

    server.listen(port, host);

    const mf = path.join(process.cwd(), 'magic.json');
    let spawnUrl = null;
    const magicConf = {
      host: '127.0.0.1',
      port: 1211,
    };
    if (fs.existsSync(mf)) {
      const magic = fs.readFileSync(mf);
      try {
        const data = JSON.parse(magic);
        Object.assign(magicConf, data);
      } catch (e) {
        console.error(e && e.message);
      }
    }
    spawnUrl = `http://${host}:${port}/index.html?magicServer=${encodeURIComponent(`http://${magicConf.host}:${magicConf.port}`)}`;
    spawn.exec(`open ${spawnUrl}`);
    console.info(`Visit Magic Web GUI ${spawnUrl}`);
  })
  .version(process.env.npm_package_version);

program.parse(process.argv);
