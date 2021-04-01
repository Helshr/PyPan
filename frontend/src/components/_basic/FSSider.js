import { Layout, Menu, Icon } from 'antd';
import { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import styles from '../../styles/FSSider.css';

const { Sider } = Layout

class FSSider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            // save subMenu end div
            subMenuDeap: [],
            // save subMenu div
            subMenuDivs: [],
        }
    }

    siderRedirect = (o) => {
        router.replace(`${o.key}`);
    }

    render() {
        const { dispatch, collapsed } = this.props
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={(collapsed) => {
                dispatch({
                    type: 'sys/changeSiderStatus',
                    payload: {
                        "collapsed": collapsed,
                    },
                })
            }}>
                <div className={styles.logo} onClick={e => this.siderRedirect({key: '/'})} />
                <Menu theme="dark" mode="vertical" onChange={() => {
                    let pathList = []
                    let dom = document.querySelector('.ant-menu-item-selected')
                    let endP = dom.innerText
                    let parDom = dom.parentElement
                    let ppdom = parDom.parentElement
                    let span = ppdom.querySelector('span').querySelector('span')
                    let startP = span.innerText
                    pathList.push(startP)
                    pathList.push(endP)
                    dispatch({
                        type: 'sys/savePathList',
                        payload: { pathList },
                    })
                }}>
                    <Menu.Item key="/uploadFiles" onClick={(e) => (this.siderRedirect(e))}><Icon type="diff" /><span>上传文件</span></Menu.Item>
                </Menu>
            </Sider>
        )
    }
}


function mapStateToProps(state) {
    const { collapsed } = state.sys
    return {
        collapsed,
    }
}

export default connect(mapStateToProps)(FSSider)
