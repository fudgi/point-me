function Point(coordinates, name){
    this.coordinates = coordinates;
    this.name = name;
    this.color = getRandomColor();
}

function getRandomColor() {
    let colors = ["red", "darkred", "orange", "#ff4f00", "#ff4faa", "#584faa", "#58aaaa", "#58e6aa", "#58e643", "#fa2b43","darkorange", "darkcyan", "lawngreen", "greenyellow", "blueviolet", "lightseagreen", "plum", "pink", "burlywood", "gray", "black", "salmon"]
    return colors[ Math.floor(Math.random() * colors.length) ];
}

export default Point