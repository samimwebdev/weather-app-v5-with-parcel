class Storage {
  #privateCity
  #privateCountry
  set city(name) {
    this.#privateCity = name
  }
  set country(name) {
    this.#privateCountry = name
  }
  saveItem() {
    localStorage.setItem('BD-weather-city', this.#privateCity)
    localStorage.setItem('BD-weather-country', this.#privateCountry)
  }
}

const storage = new Storage()

export default storage
