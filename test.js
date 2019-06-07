const { fromEvent } = require('./client/node_modules/rxjs')
const { map } = require('./client/node_modules/rxjs/operators')

let start_time = Date.now()
console.log('-----init-----')

let promise = new Promise(resolve => {
	setTimeout(() => {
		resolve('seohasong')
	}, 1000)
})

let val1 = promise.then(data => {
	data = data+data
	console.log(data, Date.now()-start_time)
	return data
})

setTimeout(() => {
	val1.then(data => console.log(data, Date.now()-start_time))
}, 2000)
