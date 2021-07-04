import React from 'react'
import './style.css'
import numeral from 'numeral'

function Table({ countries }) {
    return (
        <div className="table">
            {countries.map(({country, cases}) => (
                <tr key={country} >
                    <td style={{ fontSize : 14 }}>{country}</td>
                    <td style={{ fontSize : 14 }}><strong>{numeral(cases).format("0,0")}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
