import React, { PropTypes } from 'react';

class Header extends React.Component {
    render () {
        const {headerText, subHeaderText} = this.props;

        return (
            <div className="page-header">
                <h1>{headerText} <small>{subHeaderText}</small></h1>
            </div>
        );
    }
}

Header.propTypes = {
    headerText: PropTypes.string.isRequired,
    subHeaderText: PropTypes.string
};

export default Header;
