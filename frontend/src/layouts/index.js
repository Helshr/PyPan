import { Layout } from 'antd'
import FSHeader from '../components/_basic/FSHeader'
import FSSider from '../components/_basic/FSSider'
import FSFooter from '../components/_basic/FSFooter.js'
import Breadcrumbs from '../components/_basic/Breadcrumbs.js'

const { Content } = Layout

export default function(props) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <FSSider />
          <Layout>
            <FSHeader />
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumbs />
              <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              { props.children }
              </div>
            </Content>
            <FSFooter />
          </Layout>
        </Layout>
    )
}
