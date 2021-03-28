import { connect } from 'dva'
import {useState} from 'react'
import { DatePicker, Button } from 'antd'
import PropTypes from 'prop-types'
import styles from '../../styles/DateComponent.css'
import moment from 'moment'

const DateComponents = ({handleDate, showdDate }) => {

    const [date, setDate] = useState(showdDate)
    const [sym, setSym] = useState(0)

    const changeDate = (date) => {
        let a = date.split('-')
        let r = a.join('')
        return r
    }

    const dateFormat = 'YYYY-MM-DD'

    const onChange = (value, dateString) => {
        return setDate(changeDate(dateString))
    }

    const onClick = () => {
        handleDate(date)
    }

    return (
        <div className={styles.dateSelector} style={{ zIndex: 10 }}>
            <div className={styles.findDateFont}>Date:</div>
            <div className={styles.selector}>
                <DatePicker
                    defaultValue={moment().subtract(0, 'day')}
                    format={dateFormat}
                    onChange={onChange}></DatePicker>
                <Button
                    shape="circle"
                    icon="search"
                    onClick={onClick}
                >
                </Button>
            </div>
        </div>
    )
}

export default DateComponents
