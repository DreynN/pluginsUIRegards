import { DownloadFileActions } from "@regardsoss/store-utils";

export default class SearchDownloadFileActions extends DownloadFileActions {
    constructor(namespace, bypassErrorMiddleware = false) {
        super({
            namespace,
            //TODO finir le endpoint trouver les bons noms d'attributs
            entityEndpoint: `${GATEWAY_HOSTNAME}/${API_URL}/${STATIC_CONF.MSERVICES.CATALOG}/downloads/(...)`,
            bypassErrorMiddleware,
        })
    }

    getDownloadFile(searchContext) {
        return this.download(null, searchContext.searchParameters, 'GET', null)
    }
    //TODO voir si la fonction suivante est utile ou non => a priori oui vu que la fonction d'au dessus permet de lancer un download
    getFileBuildResults(res) {
        return this.buildResults(res)
    }
}