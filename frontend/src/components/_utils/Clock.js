import { Component } from 'react'
import moment from 'moment'

class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            t: moment().local('zh-cn').format('Mo DD ddd, HH:mm:ss')
        }
    }

    getIntialState = () => {
        this.setState({
            t: moment().local('zh-cn').format('Mo DD ddd, HH:mm:ss')
        })
    }

    componentDidMount() {
        setInterval(() => {
            this.getIntialState()
        }, 1000)
    }

    render() {
        return (
            <div key="clock">
                <span style={{fontSize: "17px", marginLeft: "3%", fontWeight: "600"}}>{this.state.t}</span>
            </div>
        )
    }
}

export default Clock
