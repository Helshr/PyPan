import Link from 'umi/link'
import { Breadcrumb } from "antd"
import withBreadcrumbs from "react-router-breadcrumbs-hoc"
import PropTypes from "prop-types"
import {connect} from "dva"

const routes = [
    { path: '/test', breadcrumb: "测试" },
    { path: '/uploadFiles', breadcrumb: "文件上传" },
    { path: '/login', breadcrumb: "登陆" },
    { path: '/register', breadcrumb: "注册" },
]

const excludePaths = ['/', '/zh_CN']

const Breadcrumbs = ({ breadcrumbs }) => (
    <Breadcrumb separator=">">
        {breadcrumbs.map((bc, index) => {
            return (
                <Breadcrumb.Item key={bc.match.url}>
                    <Link
                        to={{
                            pathname: bc.match.url,
                            state: bc.match.params ? bc.match.params : {},
                            query: bc.location.query ? bc.location.query : {},
                        }}
                    >
                        {bc.breadcrumb}
                    </Link>
                    {index < breadcrumbs.length - 1 && <i>&nbsp;&nbsp;</i>}
                </Breadcrumb.Item>
            )
        })}
    </Breadcrumb>
)

Breadcrumbs.propTypes = {
    sider: PropTypes.array
}

function mapStateToProps(state) {
    const { sider } = state.sys
    return {
        sider
    }
}

const d = connect(mapStateToProps)(Breadcrumbs)

export default withBreadcrumbs(routes, {excludePaths})(d)
