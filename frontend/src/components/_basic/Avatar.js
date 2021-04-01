import React from 'react';
import { Avatar, Icon } from 'antd';
import { connect } from 'dva';
import styles from '../../styles/Avator.css';
import { print } from '../../utils/utils';


class CustomAvatar extends React.Component {

    getRandomColor = () => {
        let r = "#";
        for (let i = 0; i < 3; i++) {
            const n = parseInt(Math.random() * 255, 10);
            const rn = n.toString(16);
            print("DEBUG: ", rn);
            r += rn;
        }
        print("random color is ", r);
        return r;
    }
  
    render() {
        const { username } = this.props;
        const fontColor = this.getRandomColor();
        const bkColor = this.getRandomColor();

        return (
            <div className={styles.avator}>
                <Avatar style={{ color: fontColor, backgroundColor: bkColor }}>{username.slice(0, 1).toUpperCase()}</Avatar>
            </div>
        );
    }
}

function mapStateToProps(state) {
  const { username } = state.auth;
  return {
    username,
  }
}

export default connect(mapStateToProps)(CustomAvatar);