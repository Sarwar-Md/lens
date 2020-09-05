/**
 * Menu Bar
 */
const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".nav-items");
const form = document.querySelector("form");
menuBtn.onclick = ()=>{
    items.classList.add("active");
    menuBtn.classList.add("hide");
    searchBtn.classList.add("hide");
    cancelBtn.classList.add("show");
}
cancelBtn.onclick = ()=>{
    items.classList.remove("active");
    menuBtn.classList.remove("hide");
    searchBtn.classList.remove("hide");
    cancelBtn.classList.remove("show");
    form.classList.remove("active");
    cancelBtn.style.color = "#ff3d00";
}
searchBtn.onclick = ()=>{
    form.classList.add("active");
    searchBtn.classList.add("hide");
    cancelBtn.classList.add("show");
}

const filterBtn = document.querySelector('#filt');
const closeFilter = document.querySelector('.caret');
filterBtn.addEventListener('click', () =>{
    document.getElementById('filters').classList.toggle("hide");
});
closeFilter.addEventListener('click', () =>{
    document.getElementById('filters').classList.toggle("hide");
});

/**
 * Application
 */

// Dom Strings 
 
const imageContainer = document.getElementById('img-container');
const loader = document.getElementById('loader');
const queryBtn = document.querySelector('#start_search');


// Global varibales and values
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let apiUrl;
let page = 1;
let query;
const API_KEY = `Api_Key_Goes_Here`;
const count = 10;
const filteredNameValue = [];
const defaultApi = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${count}`;

// setting default api(random photos) on load
apiUrl = defaultApi;

function updatefilters(){
   page = 1; 
   query = document.querySelector('.search-data').value;

    //Object with filtered name value pairs
    const filtersValue = {
        color : document.querySelector('#color').value,
        content_filter : document.querySelector('#content_filter').value,
        order_by : document.querySelector('#order_by').value,
        orientation : document.querySelector('#orientation').value
    };
    // converting object to array
    const filtersEntries = Object.entries(filtersValue);      
    
    // pushing filter data to the array that has defined value
    for(i = 0; i < filtersEntries.length; i ++){
        if(filtersEntries[i][1] !== ""){
            filteredNameValue.push(`${filtersEntries[i][0]}=${filtersEntries[i][1]}`);
        }
    }      
};

// Building the search Api and selecting which api will be used
 function apiSelector(){
     if(query === undefined || query === 'random'){
         apiUrl = defaultApi;
     } else {
        let firstPartSearchApi = `https://api.unsplash.com/search/photos?client_id=${API_KEY}&query=${query}&count=${count}&page=${page}&`;
        let secondPartSearchApi = filteredNameValue.join('&')
        const searchApi = `${firstPartSearchApi}${secondPartSearchApi}`;
        apiUrl = searchApi;
     }
 }




 // check all images has been loaded
function imageLoaded(){
imagesLoaded++;
if(imagesLoaded === totalImages){
    ready = true;
    loader.hidden = true;
};
};


// display foto functionality

function displayPhoto(){
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach( photo =>{
       // create an achor <a> element
       const item = document.createElement('a');
       item.setAttribute('href', photo.links.html);
       item.setAttribute('target', '_blank');
       // create an achor <img> element
       const img = document.createElement('img');
       img.setAttribute('src', photo.urls.regular);
       img.setAttribute('alt', photo.alt_description);
       img.setAttribute('title', photo.alt_description);

       //event listener, check when is img finished loading
       img.addEventListener('load', imageLoaded);

       // put <img> inside <a> and <a> inside img-container
       item.appendChild(img);
       imageContainer.appendChild(item);


    });
};

// get photos from unsplash api
async function getPhotos(){ 
    apiSelector();       
    try {
       const response = await fetch(apiUrl);
       results = await response.json();
       
       // Note: retured JSON structure changes based on which api has been used
        if(apiUrl === defaultApi){
            photosArray = Array.from(results);
        } else{
            photosArray = results.results;
        }     
      
       displayPhoto();

       // to prevent loading same image, changing page numbers.
       // **will not effect the random api/ images
       page++;
       
    } catch (error) {
        console.log(error);
    }

    count = 30;
};


// image search with keywords and filters
queryBtn.addEventListener('click', () => {
    photosArray = [];
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
    updatefilters();   
    getPhotos();    
});

// check the scrollbar position

window.addEventListener('scroll', () => {
   if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000  && ready){
       ready = false;
       getPhotos();
   }
});

// On pageload
getPhotos();