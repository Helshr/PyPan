import { Component } from 'react'
import moment from 'moment-timezone'

class UsClock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            t: moment.tz("US/Eastern").format("Mo DD ddd, HH:mm:ss")
        }
    }

    getIntialState = () => {
        this.setState({
            t: moment.tz("US/Eastern").format("Mo DD ddd, HH:mm:ss")
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
                <span style={{fontSize: "17px", marginRight: "3%", fontWeight: "600"}}>美国东部时区时间： {this.state.t}</span>
            </div>
        )
    }
}

export default UsClock
