import React from 'react'
import './TrendCard.css'
import {TrendData} from '../../Data/TrendData.js'
const TrendCard = () => {
  return (
   <div className="TrendCard">
       <h2>Trending</h2>


       {TrendData.map((trend, id)=>{
            return(
                <div className="trend" key={id}>
                    <span>#{trend.name}</span>
                    <span>{trend.shares}k shares</span>
                </div>
            )
       })}
   </div>
  )
}

export default TrendCard