import weatherStore from './WeatherDataStore'
import storage from './Storage'

class UI {
  #loadSelectors() {
    const cityElm = document.querySelector('#city')
    const cityInfoElm = document.querySelector('#w-city')
    const iconElm = document.querySelector('#w-icon')
    const temperatureElm = document.querySelector('#w-temp')
    const pressureElm = document.querySelector('#w-pressure')
    const humidityElm = document.querySelector('#w-humidity')
    const feelElm = document.querySelector('#w-feel')
    const formElm = document.querySelector('#form')
    const countryElm = document.querySelector('#country')
    const messageElm = document.querySelector('#messageWrapper')

    return {
      cityInfoElm,
      cityElm,
      countryElm,
      iconElm,
      temperatureElm,
      pressureElm,
      feelElm,
      humidityElm,
      formElm,
      messageElm,
    }
  }
  #getInputValues() {
    const { cityElm, countryElm } = this.#loadSelectors()
    const city = cityElm.value
    const country = countryElm.value
    return {
      city,
      country,
    }
  }
  #validateInput(city, country) {
    let error = false
    if (city === '' || country === '') {
      error = true
    }
    return error
  }
  #hideMessage() {
    const msgContentElm = document.querySelector('.err-msg')
    if (msgContentElm) {
      setTimeout(() => {
        msgContentElm.remove()
      }, 2000)
    }
  }
  #showMessage(msg) {
    const { messageElm } = this.#loadSelectors()
    const msgContentElm = document.querySelector('.err-msg')
    const elm = `<div class='alert alert-danger err-msg'>${msg}</div>`
    if (!msgContentElm) {
      messageElm.insertAdjacentHTML('afterbegin', elm)
    }
    this.#hideMessage()
  }
  #getIconSrc(iconCode) {
    return 'https://openweathermap.org/img/w/' + iconCode + '.png'
  }
  #printWeather(data) {
    const {
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      iconElm,
    } = this.#loadSelectors()

    const { main, weather, name } = data

    cityInfoElm.textContent = name
    temperatureElm.textContent = `Temperature: ${main.temp}°C`
    humidityElm.textContent = `Humidity: ${main.humidity}kpa`
    pressureElm.textContent = `pressure: ${main.pressure}kpa`
    feelElm.textContent = weather[0].description
    const src = this.#getIconSrc(weather[0].icon)
    iconElm.setAttribute('src', src)
  }
  #resetInput() {
    const { countryElm, cityElm } = this.#loadSelectors()
    cityElm.value = ''
    countryElm.value = ''
  }
  init() {
    const { formElm } = this.#loadSelectors()
    console.log(this)

    formElm.addEventListener('submit', async (e) => {
      e.preventDefault()
      //get the input value
      const { city, country } = this.#getInputValues()
      //reset Input
      this.#resetInput()
      //validate input
      const error = this.#validateInput(city, country)
      //show error message to UI
      if (error) return this.#showMessage('Please provide valid Input')
      //setting data to weather data store
      weatherStore.city = city
      weatherStore.country = country

      //setting to localStorage
      storage.city = city
      storage.country = country
      storage.saveItem()
      //send request to API server
      const data = await weatherStore.fetchData()
      if (Number(data.cod) > 400) {
        this.#showMessage(data.message)
      } else {
        this.#printWeather(data)
      }
    })

    document.addEventListener('DOMContentLoaded', async (e) => {
      //load data from localStorage
      if (localStorage.getItem('BD-weather-city')) {
        //setting data to data store
        weatherStore.city = localStorage.getItem('BD-weather-city')
      }
      if (localStorage.getItem('BD-weather-country')) {
        //setting data to data store
        weatherStore.country = localStorage.getItem('BD-weather-country')
      }

      //send request to API server
      const data = await weatherStore.fetchData()
      //show data to UI
      this.#printWeather(data)
    })
  }
}

const ui = new UI()

export default ui
