import { Component } from 'react';
import { Layout } from 'antd';
import CustomAvatar from './Avatar';
const { Header } = Layout;

class FSHeader extends Component {
    render() {
        return (
            <Header style={{ background: '#fff', padding: 0, marginBottom: "10px" }}>
                <CustomAvatar />
            </Header>
        )
    }
}

export default FSHeader
