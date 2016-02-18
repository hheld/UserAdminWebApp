import React, { PropTypes } from 'react';

class ChangeUserPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPwd: null,
            newPwd: null,
            newPwdConfirm: null,
            passwordsMatch: true,
            pwdChangeSuccessIndicator: null
        };
    }

    updatePwd() {
        const {newPwd, passwordsMatch, currentPwd} = this.state;

        if(passwordsMatch) {
            this.props.updatePasswd(newPwd, currentPwd, (success) => {
                this.setState({pwdChangeSuccessIndicator: success});

                setTimeout(() => this.setState({pwdChangeSuccessIndicator: null}), 5000);
            });
        }
    }

    render () {
        const matchLabelClass = this.state.passwordsMatch ? 'label label-success' : 'label label-danger';
        const matchText = this.state.passwordsMatch ? 'Passwords match' : 'Passwords don\'t match';

        const successIndicatorClass = this.state.pwdChangeSuccessIndicator ? 'label label-success' : 'label label-danger';
        const successIndicatorText = this.state.pwdChangeSuccessIndicator ? 'Password successfully changed' : 'Password couldn\'t be changed';
        const successIndicator = this.state.pwdChangeSuccessIndicator!==null ? <div className={successIndicatorClass} style={{marginLeft: 10}}>{successIndicatorText}</div> : null;

        return (
            <div>
                <form className='form-horizontal'>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Current password</label>
                        <div className='col-sm-8'>
                            <input type='password' className='form-control' placeholder='Current password' onChange={(e) => this.setState({currentPwd: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>New password</label>
                        <div className='col-sm-8'>
                            <input type='password' className='form-control' placeholder='New password' onChange={(e) => this.setState({
                                newPwd: e.target.value,
                                passwordsMatch: e.target.value===this.state.newPwdConfirm
                            })} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Confirm new password</label>
                        <div className='col-sm-8'>
                            <input type='password' className='form-control' placeholder='Confirm new password' onChange={(e) => this.setState({
                                newPwdConfirm: e.target.value,
                                passwordsMatch: this.state.newPwd===e.target.value
                            })} />
                        </div>
                        <div className='col-sm-2'>
                            <div className={matchLabelClass}>{matchText}</div>
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-10'>
                            <button type='button' className='btn btn-warning' onClick={() => this.updatePwd()}>Update password</button>
                            {successIndicator}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

ChangeUserPassword.propTypes = {
    updatePasswd: PropTypes.func.isRequired
};

export default ChangeUserPassword;
