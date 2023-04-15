const cliDeploy = require('./src/cli');
const SCALEWAY_CONSTANTS = require('./src/constants');

/**
 * TEST : Environnement de code / TP basé sur vscode
 * cf. https://github.com/jimetevenard/Training-Web-Environment
 * 
 * Cette image expose un VSCode avec un environnement Java.
 * La variable GIT_REPOSITORY sert à préciser un dépôt Git à
 * cloner dans l'environnement lors du démarrage du conteneur.
 */
const javaVSCode = {
    image: "jimetevenard/code-env:java-beta",
    env: {
        "GIT_REPOSITORY": "https://github.com/jimetevenard/kata-bootstrap-junit5.git"
    },
    name: `java-test-${Math.floor(Math.random() * 10000)}`,
    size: SCALEWAY_CONSTANTS.sizes.MEM_4096.memory,
    port: 80
};

cliDeploy(javaVSCode);



