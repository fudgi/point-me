import React from 'react'
import trash from '../../icons/trash.svg'
import './sidebar_element.scss'

class SidebarElement extends React.Component {
    render(){
        let point = this.props.point;
        let index = this.props.index;
        return(
            <div className="sidebar_element" draggable onDragStart={(e)=> this.props.onDragStart(e, index)} onDragLeave={(e)=>this.props.onDragLeave(e, index)} onDragOver={(e)=>this.props.onDragOver(e, index)} onDragEnd={(e)=>this.props.onDragEnd(e)}>
                <div className="sidebar_element_left">
                    <div className="sidebar_element_circle" style={{backgroundColor:`${point.color}`}}>&nbsp;</div>
                </div>
                <div className="sidebar_element_right">
                    <div className="sidebar_element_row">
                        <p> {index + 1}. {point.name===""? `Точка` : point.name } </p>
                        <button className="sidebar_element_button" onClick={() => this.props.deletePoint(index)}>
                            <img className="sidebar_element_img" src={trash} alt="delete element"/>
                        </button>
                    </div>
                    <p className="sidebar_element_coord"> {typeof(point.coordinates) != "undefined"? `${point.coordinates[0].toPrecision(5)} : ${point.coordinates[1].toPrecision(5)}` : "Определяется.."} </p>
                </div>
            </div>
        )
    }
}

export default SidebarElement