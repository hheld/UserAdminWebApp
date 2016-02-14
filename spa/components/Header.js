import React, { PropTypes } from 'react';

class Header extends React.Component {
    render () {
        const {headerText, subHeaderText, navigateToLink, navPath} = this.props;
        const paths = navPath ? navPath==='/' ? [''] : navPath.split('/') : [];
        const numOfPaths = paths.length;

        const navItems = navigateToLink && navPath ? paths.map((link, idx) => {
            return idx===numOfPaths-1 ? <li key={idx} clasName='active'>{link || 'Home'}</li> :
            <li key={idx}><a role='button' onClick={() => navigateToLink('/'+link)}>{link || 'Home'}</a></li>;
        }) : null;

        const navBar = navItems ? <ol className="breadcrumb">
            {navItems}
        </ol> : null;

        return (
            <div className="page-header">
                <h1>{headerText} <small>{subHeaderText}</small></h1>
                {navBar}
            </div>
        );
    }
}

Header.propTypes = {
    headerText: PropTypes.string.isRequired,
    subHeaderText: PropTypes.string,
    navigateToLink: PropTypes.func,
    navPath: PropTypes.string
};

export default Header;
