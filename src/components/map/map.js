import React from 'react'
import { YMaps, Map, ZoomControl, GeolocationControl} from 'react-yandex-maps';

class YandexMap extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ymaps: null
        }
        this.ref = null;
        this.placemarkCollection = null;
        this.polylineCollection = null;
        this.movingPointIndex = null;
    }

    mapsOnLoad(ymaps){
        this.setState({ ymaps });
        this.processInputData();
        this.setCenter(ymaps);
    };

    //redraw on every iteration
    drawMap(ref){
        this.ref = ref;
        const { ymaps } = this.state;
        this.processInputData();
        if (ymaps) {
            if(this.points.includes(undefined)) this.checkEmptyPlacemarks();
            else {
                this.clearMap();
                this.initGeoObjectCollections();
                this.setPolylines(this.points);
                this.setPlacemarks(this.points);
            }
        }
    }

    clearMap(){
        this.ref.geoObjects.removeAll()
    }

    initGeoObjectCollections(){
        let placemarkCollection = new this.state.ymaps.GeoObjectCollection();
        this.ref.geoObjects.add(placemarkCollection);
        this.placemarkCollection = placemarkCollection;

        let polylineCollection = new this.state.ymaps.GeoObjectCollection();
        this.ref.geoObjects.add(polylineCollection);
        this.polylineCollection = polylineCollection;
    }

    checkEmptyPlacemarks(){
        const data = this.ref.getCenter();
        const index = this.points.indexOf(undefined);
        this.props.updatePointCoords(data, index);
    }

    setCenter(ymaps){
        if(typeof(this.points) != "undefined" && this.points.length > 1){

            //Get rid of undefined
            let data = this.points.filter(function( element ) {
                return element !== undefined;
            });
            if(data.length < 1) return;

            const coord = ymaps.util.bounds.fromPoints(data);
            this.ref.setBounds(coord, {zoomMargin: 15})
        }
    }

    setPlacemarks(geometry){
        geometry.forEach((point, index) => {
            let placemark = new this.state.ymaps.Placemark(
                point,
                {
                    iconContent:`${index+1}`,
                    balloonContentHeader: this.names[index] === ""? "Точка": this.names[index],
                    balloonContentBody: `Цвет: ${this.colors[index]} <br /> Координаты: ${point}`,
                },
                {
                    iconColor: this.colors[index],
                    preset: 'islands#circleIcon',
                    draggable: true
                }
            );

            placemark.events.add("dragstart", (e) => this.movingPointIndex = this.getPointIndex(e))
            placemark.events.add("dragend", (e) => {this.sendBackPointCoord(e); this.movingPointIndex = null;})
            placemark.events.add("drag", () => this.movePoint())

            this.placemarkCollection.add(placemark);
        })
    }

    setPolylines(geometry, properties){
        var basePolyline = new this.state.ymaps.Polyline(
            geometry,
            {}, 
            {
                strokeColor: "#00000088",
                strokeWidth: 4,
                strokeStyle: properties
            }
        );
        if(typeof(this.polylineCollection.get(1)) != "undefined"){
            this.polylineCollection.remove(1);
        }
        this.polylineCollection.add(basePolyline);
    }

    getPointIndex(e){
        let eventTarget = e.get('target');
        let object, index = 0;
        let iterator = this.placemarkCollection.getIterator();
        while ((object = iterator.getNext()) !== iterator.STOP_ITERATION) {
            if (object === eventTarget) {
                break;
            }
            index++;
        }
        return index;
    }

    sendBackPointCoord(e){
        let data = e.get('target').geometry.getCoordinates();
        this.props.updatePointCoords(data, this.movingPointIndex)
    }

    processInputData(){
        let placemarkArray = [];
        let colorArray = [];
        let nameArray = [];

        this.props.points.forEach((value) => {
            placemarkArray.push(value.coordinates);
            nameArray.push(value.name);
            colorArray.push(value.color);
        })
        this.points = placemarkArray;
        this.colors = colorArray;
        this.names = nameArray;
    }

    movePoint(){
        const collection = this.placemarkCollection;
        const collectionLength = collection.getLength();
        if(collectionLength > 1){
            const index = this.movingPointIndex;
            let polylineGeometry = [];
            
            //Определяем соседние точки
            switch(index){
                case 0:
                    polylineGeometry.push(collection.get(index).geometry.getCoordinates())
                    polylineGeometry.push(collection.get(index+1).geometry.getCoordinates())
                    break;
                case (collectionLength-1):
                    polylineGeometry.push(collection.get(index).geometry.getCoordinates())
                    polylineGeometry.push(collection.get(index-1).geometry.getCoordinates())
                    break;
                default:
                    polylineGeometry.push(collection.get(index-1).geometry.getCoordinates())
                    polylineGeometry.push(collection.get(index).geometry.getCoordinates())
                    polylineGeometry.push(collection.get(index+1).geometry.getCoordinates())
            }
            this.setPolylines(polylineGeometry, '2 5');
        }
    }

    render(){
       return(
            <YMaps query={{ lang: "ru_RU", load: ["util.bounds", "map.addon.balloon", "geoObject.addon.balloon", "Placemark", "Polyline", "GeoObjectCollection"]}}>
                <Map
                    defaultState={{ center: [55.74, 37.6], zoom: 10 }}
                    onLoad={ymaps => this.mapsOnLoad(ymaps)}
                    instanceRef={ref => ref && this.drawMap(ref)}
                    width={'100%'}
                    height={'100%'}>
                        <GeolocationControl options={{ float: 'left' }} />
                        <ZoomControl/>
                </Map>
            </YMaps>
       )
    }
}

export default YandexMap