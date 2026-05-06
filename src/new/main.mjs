const m = 'MAIN'
// commonjs: require.main === module
if(import.meta.filename === process.argv[1]) {
	console.log(m)
}

export default m