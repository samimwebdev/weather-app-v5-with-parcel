const randomValue1 = 20
const randomValue2 = 20
function sum(num1, num2) {
  return num1 + num2
}

//named export
export { randomValue1, sum as default }
//default export
// export default sum
