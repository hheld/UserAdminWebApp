import request from 'superagent';

export const SET_AVAILABLE_PLUGINS = 'SET_AVAILABLE_PLUGINS';

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
