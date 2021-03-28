import { connect } from 'dva'
import {useState} from 'react'
import { DatePicker, Button, Select } from 'antd'
import PropTypes from 'prop-types'
import styles from '../../styles/DateComponent.css'
import moment from 'moment'




const DataCompareResultDate = ({handleData, showdDate,dataType }) => {

    const [date, setDate] = useState(showdDate)
    const [type, setType] = useState(dataType)
    console.log(type,date)
    const [sym, setSym] = useState(0)

    const changeDate = (date) => {
        let a = date.split('-')
        let r = a.join('')
        return r
    }

    const dateFormat = 'YYYY-MM-DD'
    // const dataType = 'overall'
    const onChange = (value, dateString) => {
        return setDate(changeDate(dateString))
    }


    const onClick = () => {
        handleData(date,type)
    }

    const handleChange  = (value) => {
         return setType(value)
    }
    // function handleChange(value) {
    //
    // }


    return (
        <div className={styles.dateSelector} style={{ zIndex: 10 }}>
          <div className={styles.findDateFont}>Type:&nbsp;</div>
          <div>
            <Select defaultValue="market" style={{width:150}} onChange={handleChange}>
              <Select.Option value="market"> market </Select.Option>
              <Select.Option value="index"> index </Select.Option>
              <Select.Option value="future"> future </Select.Option>
              <Select.Option value="transaction"> transaction </Select.Option>
              <Select.Option value="order_queue"> order_queue </Select.Option>
              <Select.Option value="order"> order </Select.Option>

            </Select>
            &nbsp;
          </div>


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

export default DataCompareResultDate
