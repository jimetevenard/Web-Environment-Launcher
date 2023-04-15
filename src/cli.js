if(!process.env.SCALEWAY_API_TOKEN) throw new Error('No token provided - please define $SCALEWAY_API_TOKEN');
if(!process.env.SCALEWAY_NS) throw new Error('No namespace provided - please define $SCALEWAY_NS');

const SCALEWAY_CONSTANTS = require('./constants');
const scalewayClient = require('./client-scaleway');

const SCALEWAY_REGION = process.env.SCALEWAY_REGION ? process.env.SCALEWAY_REGION : SCALEWAY_CONSTANTS.regions.fr;

const client = scalewayClient.createClient(process.env.SCALEWAY_API_TOKEN);


/**
 * Fonction principale, pilote la création et le deploy du container,
 * Et affiche l'avancement en console.
 * 
 * @param {*} container 
 */
function createContainerCLI(container){


    const containerSpec = {
        namespace_id: process.env.SCALEWAY_NS,
        name: container.name,
        environment_variables: container.env,
        min_scale: 1,
        max_scale: 1,
        memory_limit: container.size,
        privacy: SCALEWAY_CONSTANTS.privacies.public,
        registry_image: container.image,
        port: container.port,
    }

    client.createContainer(SCALEWAY_REGION, containerSpec).then(createSuccessHandler, exitFailure);

}


function deploySuccesHandler(containerData) {
    console.info(`[JIM] Conteneur en cours de déploiement ! statut : ${containerData.status}

      Ce terminal peut désormais être fermé.
      Ci-dessous, suivi du déploiement : `);

    var checkInterval;

    checkInterval = setInterval(function(){
        client.checkStatus(containerData.id, SCALEWAY_REGION).then(status => {
            console.log(`[JIM] Statut du conteneur : ${status}`);
            if(status !== 'pending') clearInterval(checkInterval);
        });
    }, 3000);
}

function createSuccessHandler(containerData){
    const newContainerPublicDomain = containerData.domain_name;
    const newContainerId = containerData.id;

    console.info(`[JIM] URL du container : https://${newContainerPublicDomain}/`);

    client.deployContainer(newContainerId, SCALEWAY_REGION).then(deploySuccesHandler, exitFailure);
}

function exitFailure(error){
    console.error(error);
    process.exit(1);
}

module.exports = createContainerCLI;