import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './style.css'

function InfoBox({ title, cases, total, active, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${props.className} ${active && "infoBox-selected"}`}>
            <CardContent>
                <Typography color="textSecondary" className="title">
                    {title}
                </Typography>
                <h3 className="cases">{cases}</h3>
                <Typography color="textSecondary" className="total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
