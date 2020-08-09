var form = document.getElementById('form')
//when user gives input this event gets fired
form.addEventListener('submit', function () {
    event.preventDefault()
    var query = document.getElementById('inp').value
    searchByCountry(query)
    form.reset()
})

searchByCountry = (query) => {
    //fetching the data as per input country
    return fetch('https://api.covid19api.com/country/' + query + '/status/confirmed')
        .then(res => res.json())
        .then(res => {
            if (res) {
                 //setting the data to localstorage for reusing in other pages
                 localStorage.setItem("Countries", JSON.stringify(res))

                 //relocating to other page where data of user input is displayed
                 window.location.href = "countries.html"
            }
            else {
                alert('Please enter a valid country name')
            }
        })
        .catch(err => console.log(err))
}

worldDataSummary = () => {
    // fetching the data of all the countries
    fetch('https://api.covid19api.com/summary')
        .then(res => res.json())
        .then(async res => {
            worldData = res.Countries

            // calling loadData function to append the data
            await cardData(worldData)
        })
}

//on load calling summary function to print the data of all the countries
window.addEventListener('load', worldDataSummary)


function cardData(worldData) {
    //this function appends the data got from api to the table
    var totalCases = 0
    var totalDeaths = 0
    var totalRecovered = 0
    for (var i = 1; i < worldData.length; i++) {
        totalCases += worldData[i].TotalConfirmed
        totalDeaths += worldData[i].TotalDeaths
        totalRecovered += worldData[i].TotalRecovered
    }
    for (var i = 1; i < worldData.length; i++) {
        $('#liveCount').append(`<option value="${worldData[i].Country}">${worldData[i].Country}</option>`)
    }
    $('#cardTitleCases').html(totalCases)
    $('#cardTitleDeaths').html(totalDeaths)
    $('#cardTitleRecovered').html(totalRecovered)

}


let summaryData //this has to be an array. as i am getting data in array so no need change it to array
let pageData = []
let perPage = 25
let activePage = 1
let select

// fetching the data of all the countries
fetch('https://api.covid19api.com/summary')
    .then(res => res.json())
    .then(async res => {
        summaryData = res.Countries
        pagination(activePage)
    })

function loadData() {
    page = activePage
    let low = (page - 1) * perPage
    let high = page * perPage
    pageData = summaryData.filter((a, i) => i >= low && i < high)
    fillPage(page)

}

//Pagination
function pagination(page) {
    let total = summaryData.length;
    let pageCount = Math.ceil(total / perPage)
    let pages = document.getElementById('pages')
    pages.innerHTML = ""

    for (let i = 0; i < pageCount; i++) {
        let li = document.createElement('li')
        if (i === page - 1) {
            li.setAttribute('class', 'page-item active')
        }
        else {
            li.setAttribute('class', 'page-item')
        }
        li.setAttribute('onclick', `changePage(${i + 1})`)
        let a = document.createElement('a')
        a.setAttribute('class', 'page-link')
        a.setAttribute('href', `#${i + 1}`)
        a.textContent = i + 1

        li.append(a)
        pages.append(li)
    }
    loadData()
}

//Change-page
function changePage(newPage) {
    let liActive = document.querySelector(`#pages li:nth-child(${activePage})`)
    liActive.setAttribute('class', 'page-item')
    activePage = newPage
    let liNew = document.querySelector(`#pages li:nth-child(${activePage})`)
    liNew.setAttribute('class', 'page-item active')
    loadData()
}

//Fill-page
function fillPage() {
    let div = document.getElementById('tableBody')
    div.innerHTML = ''

    console.log(pageData)
    pageData.forEach(data => {
        $('#tableBody').append(`<tr><td>${data.Country}</td><td>${data.NewConfirmed}</td><td>${data.NewDeaths}</td><td>${data.NewRecovered}</td><td>${data.TotalConfirmed}</td><td>${data.TotalDeaths}</td><td>${data.TotalRecovered}</td></tr>`)
    })
}


//on load calling summary function to print the data of all the countries
window.addEventListener('load', () => {
    select = document.getElementById('pageSelect')
    select.addEventListener('change', () => {
        perPage = Number(select.value)
        pagination(activePage)
    })
})

//countries around the world for user information
$('countryData').html("")
async function showCountries() {
    await fetch('https://api.covid19api.com/countries')
        .then(res => res.json())
        .then(res => {
            data = res
            for (var i = 1; i < data.length; i += 6) {
                $('#countryData').append(`<tr><td>${i}. ${data[i].Country}</td><td>${i + 1}. ${data[i + 1].Country}</td><td>${i + 2}. ${data[i + 2].Country}</td><td>${i + 3}. ${data[i + 3].Country}</td><td>${i + 4}. ${data[i + 4].Country}</td><td>${i + 5}. ${data[i + 5].Country}</td></tr>`)
            }
        })
}
$('#countries').click(showCountries)


var liveCount = document.getElementById('liveCount')
function live(e) {
    //Live or current number of cases according to country
    if (e.target.value !== "selected") {
        fetch('https://api.covid19api.com/live/country/' + e.target.value + '/status/confirmed')
            .then(res => res.json())
            .then(res => {
                if (res[(res.length - 1)] == undefined) {
                    $('#liveCountCountry').html(`No cases till date`)
                }
                else {
                    console.log(res[res.length - 1].Confirmed)
                    $('#liveCountCountry').html(`Total number of Cases in ${e.target.value} till now are ${res[res.length - 1].Confirmed}`)
                }
            })
    }
}

liveCount.addEventListener('click', live)
