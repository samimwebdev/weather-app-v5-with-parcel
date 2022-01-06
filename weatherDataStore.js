const weatherStore = {
  privateCity: 'pabna',
  privateCountry: 'BD',
  API_KEY: 'd777b9cd1436c98f958dac1e189e4f09',
  set city(name) {
    //validation
    this.privateCity = name
  },
  set country(name) {
    this.privateCountry = name
  },
  async fetchData() {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=metric&appid=${this.API_KEY}`
      )

      return await res.json()
    } catch (err) {
      UI.showMessage(err.message)
    }
  },
}

export default weatherStore
