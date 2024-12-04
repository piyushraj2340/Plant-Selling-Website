import { Popover } from 'antd'
import React from 'react'

const AlertPopOver = ({loginAlertUI, title, content}) => {
    return (
        <Popover content={loginAlertUI} title={title} trigger="click">
            {content}
        </Popover>
    )
}

export default AlertPopOver