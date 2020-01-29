//export 
class Map {
    constructor(coords) {
        this.render(coords);
    }

    render(coordinates) {
        if(!google) {
            alert('Could not load maps library - pls try again later!');
            return;
        }

        const map = new google.maps.Map(document.getElementById('map'), {
            centre: coordinates,
            zoom: 16
        });
        
        new google.maps.Marker({
            position: coordinates,
            map: map
        });
    }
}