import request from 'superagent';

export const SET_AVAILABLE_PLUGINS = 'SET_AVAILABLE_PLUGINS';
export const SET_PLUGIN_PAGE = 'SET_PLUGIN_PAGE';

export function getAvailablePlugins() {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            request.get('/pluginLinks')
            .end((err, res) => {
                if(!err && res.ok) {
                    dispatch({
                        type: SET_AVAILABLE_PLUGINS,
                        plugins: JSON.parse(res.text)
                    });

                    resolve();
                } else {
                    reject();
                }
            });
        });
    };
}

export function getPluginPage(pluginName) {
    return (dispatch, getState) => {
        const {isAuthenticated, csrfToken} = getState().auth;

        if(isAuthenticated) {
            request
            .get('/plugin/' + pluginName)
            .set('X-Csrf-token', csrfToken)
            .end(function(err, res) {
                if(!err && res.ok) {
                    const pluginPage = res.text;
                    dispatch({
                        type: SET_PLUGIN_PAGE,
                        pluginPage: pluginPage,
                        pluginName: pluginName
                    });
                }
            });
        }
    };
}
