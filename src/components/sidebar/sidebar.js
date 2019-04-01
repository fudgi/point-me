import React from 'react'
import './sidebar.scss'
import SidebarElement from '../sidebar_element/sidebar_element'

class Sidebar extends React.Component {
    constructor(props){
        super(props);
        this.addNewPoint = this.addNewPoint.bind(this);
        this.resetAllPoints = this.resetAllPoints.bind(this);
        this.inputRef = React.createRef();
    }

    addNewPoint(e){
        e.preventDefault();
        const inputField = this.inputRef.current;
        this.props.addNewPoint(inputField.value);
        inputField.value = "";
    }

    resetAllPoints(){
        this.props.resetAllPoints();
    }

    render(){
        return(
            <React.Fragment>
                <div className={this.props.sidebarOpened? "background-container background_active":"background-container"} onClick={(e) => this.props.backgroundClick(e)}></div>
                <aside className={this.props.sidebarOpened?'sidebar':'sidebar sidebar_hidden'}>
                    <div className="sidebar_container">
                        <div className="sidebar-controls">
                            <form>
                                <label htmlFor="point-name">Введите имя точки: </label>
                                <input className="input sidebar_namefield" id="point-name" type="text" placeholder="Название точки"  ref={this.inputRef}></input>
                                <button className="button sidebar-add" onClick={this.addNewPoint}>Добавить новую точку в центр карты</button>
                            </form>
                        </div>
                        <section className="sidebar_element_container">
                            {this.props.points.map((point, index) =>
                                <SidebarElement point={point} index={index} key={index} 
                                deletePoint={this.props.deletePoint}  onDragStart={(e, index)=> this.props.onDragStart(e, index)} 
                                onDragLeave={(e, index)=>this.props.onDragLeave(e, index)} 
                                onDragOver={(e, index)=>this.props.onDragOver(e, index)} onDragEnd={(e)=>this.props.onDragEnd(e)}/>
                            )}
                        </section>
                        <button className="button sidebar_reset" onClick={this.resetAllPoints}>Сбросить все точки</button>
                    </div>
                </aside>
            </React.Fragment>
        )
    }
}

export default Sidebar