import React, { PropTypes } from 'react';

class Plugins extends React.Component {
    render() {
        const {plugins} = this.props;

        const pluginPages = plugins.map((plugin, idx) => {
            return (
                <div className='panel panel-default' key={idx}>
                    <div className='panel-heading'>
                        {plugin}
                    </div>
                    <div className='panel-content'>
                        <div style={{overflow: 'hidden'}}>
                            <iframe src={'/plugin/'+plugin} frameBorder='0' style={{width: '100%'}}></iframe>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className='container-fluid'>
                {pluginPages}
            </div>
        );
    }
}

Plugins.propTypes = {
    plugins: PropTypes.array.isRequired
};

export default Plugins;
