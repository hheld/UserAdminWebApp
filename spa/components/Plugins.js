import React, { PropTypes } from 'react';

class Plugins extends React.Component {
    render() {
        const {pluginNames, pluginPages} = this.props;

        const pluginMainPages = pluginNames.map((plugin, idx) => {
            return (
                <div className='panel panel-default' key={idx}>
                    <div className='panel-heading'>
                        {plugin}
                    </div>
                    <div className='panel-content'>
                        <div style={{overflow: 'hidden'}}>
                            <iframe srcDoc={pluginPages[plugin]} frameBorder='0' style={{width: '100%'}}></iframe>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className='container-fluid'>
                {pluginMainPages}
            </div>
        );
    }
}

Plugins.propTypes = {
    pluginNames: PropTypes.array.isRequired,
    pluginPages: PropTypes.object.isRequired
};

export default Plugins;
