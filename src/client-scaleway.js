const Api = require('scaleway');

module.exports = {
     createClient: function(token){
        return {
            _api_client: new Api({token}),
            createContainer: function(region, containerSpec){
                return new Promise((resolve, reject) => {
                    this._api_client.post(`/containers/v1beta1/regions/${region}/containers`, containerSpec, function(err, res) {
                        if(res && res.ok) {
                            resolve(res.body);
                        } else {
                            reject(err);
                        }
                    });
                }); 
            },
            deployContainer: function(containerId, region){
                return new Promise((resolve, reject) => {
                    this._api_client.post(`/containers/v1beta1/regions/${region}/containers/${containerId}/deploy`, {}, function(err, res){
                        if(res && res.ok){
                            resolve(res.body); 
                        } else {
                            reject(err);
                        }
                    });
                });
            },
            checkStatus: function(containerId, region){
                return new Promise((resolve) => {
                    this._api_client.get(`/containers/v1beta1/regions/${region}/containers/${containerId}`, function(err, res){
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
        };
    },
}






