import { connect } from 'react-redux';
import Plugins from '../components/Plugins';

function mapStateToProps(state) {
    return {
        pluginNames: state.plugins.pluginNames,
        pluginPages: state.plugins.pluginPages
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
