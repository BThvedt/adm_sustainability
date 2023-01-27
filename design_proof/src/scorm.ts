/* eslint-disable */
// let { SCORM: scorm } = require("./SCORM_API_wrapper")

// console.log("Initting Scorm!!")

// scorm.init()
// scorm.version = "1.2"
// // scorm.set("cmi.exit", "suspend") // have to do this in order to save stuff, apparently. WHATEVER

// console.log("Scorm should be Initted!!")

// export { scorm }

// all the lms/scorm stuff etc is handeled by state
let { SCORM: scorm } = require("./SCORM_API_wrapper")
export default scorm
