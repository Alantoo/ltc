# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Amplify

```
export NODE_TLS_REJECT_UNAUTHORIZED=0

amplify init
```

```
? Enter a name for the project cnz
? Enter a name for the environment dev
? Choose your default editor: IntelliJ IDEA
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start
Using default provider  awscloudformation
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use amplify-DLTEG
```

```
amplify add auth
```

```
Do you want to use the default authentication and security configuration?
Default configuration with Social Provider (Federation)
`
```

```
amplify push

Dev:
https://cnz-dev.auth.us-east-1.amazoncognito.com


amplify env add
? Do you want to use an existing environment? No
? Enter a name for the environment test


```

https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Exu2fa3q5/.well-known/jwks.json
https://cognito-idp.us-east-1.amazonaws.com/us-east-1_bxBRrto7R/.well-known/jwks.json

Test
Hosted UI Endpoint: https://cnz-test.auth.us-east-1.amazoncognito.com/
Test Your Hosted UI Endpoint: https://cnz-test.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=43b5cmh31jboc89nnmaaktn8sj&redirect_uri=http://localhost:3000/

Node install

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

# install node v10
nvm install 10

YARN

# configure the repository
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update


# install yarn (by using "--no-install-recommends" you will avoid node.js installation)
sudo apt-get install --no-install-recommends yarn

# fix bitgo
sudo apt-get install -y build-essential python

MONGO

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
sudo add-apt-repository 'deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse'
sudo apt update
sudo apt install mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod


export NODE_ENV=production

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8181
sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8183

npm install pm2 -g
pm2 start ./index.js

```

In this step, we will install certbot on your server. Before doing this, please make sure you have Python installed, updated on your server. These following commands will properly install the certbot to your system.

```
$ sudo apt-get update
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository universe
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install certbot
```

Step 3: Generate the SLL certificate for your domains 🔒

Now, as you have certbot, you can generate the certificate for your domain(s).

```
$ sudo certbot certonly --manual
```

After you run this command, you will be prompt to input your email, accept the term of service, enter your domain name (without www.), following by the verification which you have to serve a file at “/.well-known/acme-challenege/<xxxx>” containing the challenge string on your server. In this verification step, please left your shell window open and come back after your done hosting the acme-file on the server. You can do this by allowing your express app to serve the static file through HTTP as following server.js example.

Then, go back to your shell and press enter. You will get confirmation that the certification for your domain.
