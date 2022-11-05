
// ----------------------------------------------
    // Query selectors
// ----------------------------------------------
const ctx = document.getElementById("myChart");
let chart
// ----------------------------------------------
    // Generic fetch data
// ----------------------------------------------

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("ERROR", e);
  }
};


const fetchPostData = async (url,params) => {
  const res = await fetch(
    //"https://countriesnow.space/api/v0.1/countries/population/cities",
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        //{
        //city: "haifa",
      //}
      params
      ),
    }
  );
  const data = await res.json();
  console.log(data);
  return data
};

// ----------------------------------------------
    // Create chart
// ----------------------------------------------
let dataArray = [];
let population = []
//let countriesArray = [];

const createChart = (labels, data) => {
  if (chart) {
    chart.destroy()
  }

    const config = {
      type: "bar",
      data:  {
      labels,
      datasets: [
        {
          label: "population",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data,
        },
      ],
    },
      options: {},
    };

    chart =  new Chart(document.getElementById("myChart"), config);
}


// ----------------------------------------------
    // Pull data from API to an array
// ----------------------------------------------

  let getCountryFromContinent = async (continent) => {
    const countriesArray = []
    let continentData = await fetchData(
      `https://restcountries.com/v3.1/region/${continent}`
    );
    continentData.forEach((country) => {
      countriesArray.push({name: country.name.common, population: country.population});
    });
    
    return countriesArray;
  };

  

// ----------------------------------------------
    // Create buttons
// ----------------------------------------------


async function createContinentButtons() {
  let continentContainer = document.querySelector('.continentsDiv')
  const continentArray = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  continentArray.forEach(continent => {
    let continentBtn = document.createElement("button")
    continentBtn.textContent=continent;
    continentBtn.className = "btn";
    continentContainer.appendChild(continentBtn);
    continentBtn.addEventListener('click', async ()=>{
      
      const countries = await getCountryFromContinent(continent.toLowerCase());      
      createChart(
        countries.map((country) => country.name),
        countries.map((country) => country.population)
      );

      let countriesDiv = document.querySelector('.countriesDiv')
      countries.forEach(async country => {        
        let countryBtn = document.createElement("button");
        countryBtn.textContent=country.name;
        countriesDiv.appendChild(countryBtn);        
        countryBtn.addEventListener("click", async () => {
          const cities = await getCitiesByCountries(country.name);         
          createChart(
          cities.map((city) => city.name),
          cities.map((city) => city.population)
        );
        })        
      })
    });    
  })
}

// async function getCountryButton(country) {
  
// }
createContinentButtons()

// function createCountryButtons(countriesArray) {
//   countriesDiv.innerHTML = "";
//   for (let i = 0; i < countriesArray.length; i++) {
//     let country = await countriesArray[i];
//     let countryBtn = document.createElement("button");
//     countryBtn.textContent=country;
//     countriesDiv.appendChild(countryBtn);
//   }
// }


// ----------------------------------------------
    // Event listeners
// ----------------------------------------------

//   const continentButtons = document.querySelectorAll(".btn");
//   continentButtons.addEventListener("click", (e) => {
//   
// })



    
// ----------------------------------------------
    //  Get cities by country:
// ----------------------------------------------

const citiesByCountries = {
  //"Israel" : [{name:'jeruslam', population:1}, {name:'Tel Aviv', population: 1}]
}

const getCitiesByCountries = async (country) => {
  //let citiesArray = [];
  let countryData = await fetchPostData(
    "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
    { country }
  );

  return countryData.data.map(({city, country, populationCounts})=>({name:city, country, population: populationCounts?.[0].value}))
  //countryData.data.forEach((cityData) => {
    //citiesArray.push( {data.city} )
    // if country exists in map -> add city to array
  //}  
};