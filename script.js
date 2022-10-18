class ISSTracker {

    iss = {};
    #map;


    async render() {
        await this.#loadISSLocation();
        this.#loadMap(this.iss.location);
        this.#createISS();
        this.#moveISS();
    }

    #createISS() {
        this.iss.circle = L.circle(this.iss.location, {radius: 2000000});
        this.iss.circle.addTo(this.#map);
      
        this.iss.icon =  L.icon({iconUrl: './img/ISS_icon.png', iconSize: [75, 75],});
        this.iss.marker = L.marker(this.iss.location, {icon: this.iss.icon});
        this.iss.marker.addTo(this.#map);
    }

    async #getJSON(url) {
        const response = await fetch(url);
        const data = await response.json();
    
        if (!response.ok) return;
    
        return data;
    }
    
    #loadMap(coords) {

        this.#map = L.map('map').setView(coords, 4);
    
        L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
        }).addTo(this.#map);
    
    }
    
    async #loadISSLocation() {
        const data = await this.#getJSON('http://api.open-notify.org/iss-now.json');
        
        const { latitude, longitude } = data.iss_position;
        
        this.iss.location = [latitude, longitude];
    }

    async #moveISS() {
        
        await this.#loadISSLocation();

        this.iss.marker.setLatLng(this.iss.location);
        this.iss.circle.setLatLng(this.iss.location);
        

        this.#map.panTo(this.iss.location);
        console.log(this.iss);
        setTimeout(this.#moveISS.bind(this), 5000);
    }
}

const tracker = new ISSTracker();
tracker.render();