import React from 'react'
import logo from '../icons/direction.svg'
import sidebar_opener from '../icons/sidebar.svg'
import loading from '../icons/loading.gif'
import Map from './map/map'
import Sidebar from './sidebar/sidebar'
import Point from './point'

class AppContainer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            points:[],
            sidebarOpened: true
        }
        this.addNewPoint = this.addNewPoint.bind(this);
        this.resetAllPoints = this.resetAllPoints.bind(this);
        this.updatePointCoords = this.updatePointCoords.bind(this);
        this.deletePoint = this.deletePoint.bind(this);
        this.sidebarOpener = this.sidebarOpener.bind(this);
        this.backgroundClick = this.backgroundClick.bind(this);
    }
    addNewPoint(pointName){
        let newPoint = new Point(undefined, pointName);
        this.setState({points: this.state.points.concat(newPoint)});
    }
    
    resetAllPoints(){
        this.setState({points: []});
    }

    updatePointCoords(data, index){
        let newArray = [...this.state.points];
        newArray[index].coordinates = data;
        this.setState({points: newArray})
    }

    deletePoint(index){
        let newArray = [...this.state.points];
        newArray.splice(index, 1);
        this.setState({points: newArray});
    }

    onDragStart(e, index){
        this.draggedItem = this.state.points[index];
        e.target.classList.add('sidebar_element_grabbed');
    }

    onDragOver(e, index){
        e.currentTarget.classList.add('sidebar_element_dragover');
        const draggedOverItem = this.state.points[index];
        if (draggedOverItem === this.draggedItem) return;

        let mixedArray = this.state.points.filter(point => point !== this.draggedItem);
        mixedArray.splice(index, 0, this.draggedItem);
        this.setState({points: mixedArray});
    }
    onDragLeave(e){
        e.currentTarget.classList.remove('sidebar_element_dragover');
    }

    onDragEnd(e){
        e.target.classList.remove('sidebar_element_grabbed');
        this.draggedItem = null;
    }

    sidebarOpener(){
        if(this.state.sidebarOpened === false){
            this.setState({sidebarOpened: true})
        }
        else this.setState({sidebarOpened: false})
    }

    backgroundClick(){
        this.setState({sidebarOpened: false})
    }

    componentDidMount(){
        if(window.screen.width < 500){
            this.setState({sidebarOpened: false})
        }
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    <header className="app-header">
                        <div className="brand">
                            <img className="brand-logo" src={logo} alt="brand logo"/>
                            <p className="brand-text">Point-Me</p>
                        </div>
                        <img src={sidebar_opener} className={this.state.sidebarOpened? "sidebar-opener active":"sidebar-opener"} onClick={this.sidebarOpener} alt={sidebar_opener}/>
                    </header>
                    <main>
                        <Sidebar points={this.state.points} addNewPoint={this.addNewPoint} 
                            resetAllPoints={this.resetAllPoints} deletePoint={this.deletePoint}  
                            onDragStart={(e, index)=> this.onDragStart(e, index)} onDragOver={(e, index)=>this.onDragOver(e, index)} 
                            onDragLeave={(e)=>this.onDragLeave(e)} onDragEnd={(e)=>this.onDragEnd(e)} 
                            sidebarOpened={this.state.sidebarOpened} backgroundClick={this.backgroundClick}
                        />
                        <section className="map">
                            <div className="map-loading">
                                <img src={loading} alt={loading}/>
                                <p>Пожалуйста, подожите. Карта скоро появится</p>
                            </div>
                            <Map points={this.state.points} updatePointCoords={this.updatePointCoords}/>
                        </section>
                    </main>
                </div>
            </React.Fragment>
        )
    }
}
export default AppContainer;