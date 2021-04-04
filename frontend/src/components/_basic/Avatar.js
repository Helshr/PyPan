import React from 'react';
import { Avatar, Icon } from 'antd';
import { connect } from 'dva';
import styles from '../../styles/Avator.css';
import { print } from '../../utils/utils';


class CustomAvatar extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'auth/authorization',
            payload: {},
        })
    }

    getRandomColor = () => {
        let r = "#";
        for (let i = 0; i < 3; i++) {
            const n = parseInt(Math.random() * 255, 10);
            const rn = n.toString(16);
            r += rn;
        }
        return r;
    }
  
    render() {
        const { username } = this.props;
        const fontColor = this.getRandomColor();
        const bkColor = this.getRandomColor();
        if (username === "") {
            return (
                <>
                </>
            );
        } else {
            return (
                <div className={styles.avator}>
                    <Avatar style={{ color: fontColor, backgroundColor: bkColor }}>{username.slice(0, 1).toUpperCase()}</Avatar>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
  const { username } = state.auth;
  return {
    username,
  }
}

export default connect(mapStateToProps)(CustomAvatar);