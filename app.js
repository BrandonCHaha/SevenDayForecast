const findMe = () => {
  

    const success = (position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      FetchPoints(latitude, longitude);
    };
    const error = () => {
      
    };
    navigator.geolocation.getCurrentPosition(success, error);

};

findMe();

async function FetchPoints(latitude, longitude){
    let url=`https://api.weather.gov/points/${latitude},${longitude}`


    fetch(url)
        .then(response => response.json())
        .then(data =>   {
            const gridId = data.properties.gridId;
            const gridX = data.properties.gridX;
            const gridY = data.properties.gridY;
            const location = "Weather Forecast for " + data.properties.relativeLocation.properties.city + ', ' + data.properties.relativeLocation.properties.state;
            const headerArea = document.getElementById("header");
            const header = document.createElement("h1")
            header.textContent = location;
            headerArea.appendChild(header);

            
            
    
            
            FetchForecast(gridId, gridX, gridY);
        })
        .catch(error => {
            console.log(error)
        })



}

function FetchForecast(gridId, gridX, gridY){
    let url=`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`


    fetch(url)
        .then(response => response.json())
        .then(data =>   {
            const periods = data.properties.periods;
            GenerateForecast(periods);
        })
        .catch(error => {
            console.log(error)
        })


}

function GenerateForecast(periods){
    const weatherCard = document.getElementById("weatherCard");
    let i = 0;
    let hiTemp = 0;
    let loTemp = 0;

    periods.forEach((element) =>{

        const wCard = document.createElement("div");
        const collumn = document.createElement("div")
        const day = document.createElement("h2");
        const img = document.createElement("img");
        const shortTextDay = document.createElement("p");
        const shortTextNight = document.createElement("p");
        const hiText = document.createElement("h3")
        const loText = document.createElement("h3")
        const row = document.createElement("div");
        const hrLine = document.createElement("hr")
        const spacing = document.createElement("div")

        
        collumn.setAttribute("class", "col-2 fing")
        spacing.setAttribute("class", "col-5")
        row.setAttribute("class", "row")
        wCard.setAttribute("class", "card dailyCard");
        
        if (i % 2 == 0) {

            if (element.temperature > periods[i+1].temperature){
                hiTemp = element.temperature;
                loTemp = periods[i+1].temperature;
            } else {
                loTemp = element.temperature;
                hiTemp = periods[i+1].temperature;
            }

            const icon = element.icon.replace("medium", "large");
            img.setAttribute("src", icon);
            img.setAttribute("alt", element.shortForecast);

            if (i === 0){
                day.textContent = "Today";
            } else {
                day.textContent = element.name;
            }

            hiText.textContent = "High - " + hiTemp + "°F";
            loText.textContent = "Low - " + loTemp + "°F";
            shortTextDay.textContent = element.shortForecast;
            shortTextNight.textContent = "Tonight: "+ periods[i+1].shortForecast;

            if (i === 12){
                weatherCard.appendChild(spacing)
                wCard.appendChild(day);
                wCard.appendChild(img);
                row.appendChild(hiText);
                row.appendChild(loText);
                wCard.appendChild(row);
                wCard.appendChild(shortTextDay);
                wCard.appendChild(hrLine);
                wCard.appendChild(shortTextNight);
            
                collumn.appendChild(wCard);
                weatherCard.appendChild(collumn);

            } else {
                
                wCard.appendChild(day);
                wCard.appendChild(img);
                row.appendChild(hiText);
                row.appendChild(loText);
                wCard.appendChild(row);
                wCard.appendChild(shortTextDay);
                wCard.appendChild(hrLine);
                wCard.appendChild(shortTextNight);
            
                collumn.appendChild(wCard);
                weatherCard.appendChild(collumn);
            }



        } else {

        }
        
        i++;

    })
}

