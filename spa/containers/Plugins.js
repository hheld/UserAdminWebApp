import { connect } from 'react-redux';
import Plugins from '../components/Plugins';

function mapStateToProps(state) {
    return {
        plugins: state.plugins.plugins
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
