if(!process.env.SCALEWAY_API_TOKEN) throw new Error('No token provided - please define $SCALEWAY_API_TOKEN');
if(!process.env.SCALEWAY_NS) throw new Error('No namespace provided - please define $SCALEWAY_NS');

const Api = require('scaleway'),
      client = new Api({token: process.env.SCALEWAY_API_TOKEN});

const SCALEWAY_CONSTANTS = {
    sizes: {
        MEM_128: { memory: 128, cpu: "70m" },
        MEM_256: { memory: 256, cpu: "140m" },
        MEM_512: { memory: 512, cpu: "280m" },
        MEM_1024: { memory: 1024, cpu: "560m" },
        MEM_2048: { memory: 2048, cpu: "1120m" },
        MEM_3072: { memory: 3072, cpu: "1680m" },
        MEM_4096: { memory: 4096, cpu: "2240m" }
    },
    regions: {
        fr: "fr-par",
        nl: "nl-ams",
        pl: "pl-waw"
    },
    privacies: {
        unknown_privacy: "unknown_privacy",
        public: "public",
        private: "private"
    }
};

const javaTestContainer = {
    name: `java-test-${Math.floor(Math.random() * 10000)}`,
    env: {
        "GIT_REPOSITORY": "https://github.com/swkBerlin/kata-bootstraps.git"
    },
    size: SCALEWAY_CONSTANTS.sizes.MEM_4096.memory,
    image: "jimetevenard/code-env:java-beta",
    port: 80
}

function createContainer(container, region){
    if(!region) region = SCALEWAY_CONSTANTS.regions.fr;

    var checkInterval;

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

    client.post(`/containers/v1beta1/regions/${region}/containers`, containerSpec, function(err, res) {
        if(res && res.ok) {
            console.debug(res);
            const newContainerPublicDomain = res.body.domain_name;
            const newContainerId = res.body.id;
            console.info(`[JIM] URL du container : https://${newContainerPublicDomain}/`);

            client.post(`/containers/v1beta1/regions/${region}/containers/${newContainerId}/deploy`, {}, function(err, res){
                if(res && res.ok){
                    console.info(`[JIM] Conteneur en cours de déploiement ! statut : ${res.body.status}`);
                    checkInterval = setInterval(function(){
                        checkStatus(newContainerId, region).then(status => {
                            console.log(`[JIM] Statut du conteneur : ${status}`);
                            if(status !== 'pending') clearInterval(checkInterval);
                        });
                    }, 6000);
                } else {
                    console.error(err);
                    process.exit(1);
                }
            });
        } else {
            console.error(err);
            process.exit(1);
        }
    });
}

function checkStatus(containerId, region){
    return new Promise(function(resolve){
        client.get(`/containers/v1beta1/regions/${region}/containers/${containerId}`, function(err, res){
            if(res && res.ok){
                resolve(res.body.status);
            } else {
                // On résout la promise dans tous les cas : si la requete échoue,
                // on résout en 'unknown', valeur qui peut être retournée par Scaleway
                // s'il ne parvient pas en interne à obtenir le statut.
                resolve('unknown');
            }
        });
    })
    
}

// TEST !
createContainer(javaTestContainer);



