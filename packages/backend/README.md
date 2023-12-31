<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Deployment

### Node install

```
# get the software packages from Ubuntu repositories
sudo apt-get install build-essential libssl-dev
 
 
# download nvm install script and run it
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
chmod +x install_nvm.sh
bash ./install_nvm.sh
rm ./install_nvm.sh
 
 
# source profile so that your current session knows about the changes
source ~/.profile
 
# install node v12
nvm install 12
```

### Mongo install

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
sudo add-apt-repository 'deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse'
sudo apt update
sudo apt install mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod
```

### PM2 install

```
npm install pm2 -g

sudo ln -s /home/ubuntu/.nvm/versions/node/v12.22.1/bin/node /usr/bin/node
sudo ln -s /home/ubuntu/.nvm/versions/node/v12.22.1/bin/npm /usr/bin/npm
sudo ln -s /home/ubuntu/.nvm/versions/node/v12.22.1/bin/pm2 /usr/bin/pm2

sudo rm /usr/bin/node
sudo rm /usr/bin/npm
sudo rm /usr/bin/pm2

From ~/src:

export NODE_ENV=production

sudo pm2 start ./dist/main.js --name main
sudo pm2 start ./dist/main.js --name main:debug -- --inspect=0.0.0.0:30000
or
sudo pm2 restart main --update-env

sudo pm2 logs main --lines 1000
```

### Port forward
```
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8282
sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443
```

### Generate SSL certificate

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot

sudo certbot certonly --manual

// --dry-run for test
sudo certbot certonly --webroot -w /home/ubuntu/src/client -d ltc.evg-soft.com --force-renewal

// Cert folder
/etc/letsencrypt/live/ltc.evg-soft.com

// check date 
openssl x509 -noout -dates -in /etc/letsencrypt/live/ltc.evg-soft.com/cert.pem

sudo crontab -e
// add
0 9 16 */3 * sudo certbot certonly --webroot -w /home/ubuntu/src/client -d ltc.evg-soft.com && sudo pm2 restart main

// cron logs
sudo systemctl status cron
// or
modify rsyslog config: open /etc/rsyslog.d/50-default.conf,remove # before cron.*
restart rsyslog service: sudo service rsyslog restart
restart cron service: sudo service cron restart
cat /var/log/cron.log
```

### Docker image prepare

```
docker image build -t failwin/ltc:0.0.1 ./

docker tag failwin/ltc:0.0.1 failwin/ltc:latest

docker push failwin/ltc:0.0.1

docker push failwin/ltc:latest

```

### Docker start

```
docker-compose up

docker-compose stop

docker-compose down
```
