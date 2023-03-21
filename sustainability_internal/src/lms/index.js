import "./pipwerks_scorm.js" // the scorm api wrapper. Adds a global object pipwerks.SCORM
// import lmsObj from "./lms"

var scorm = window.pipwerks.SCORM //Shortcut
// var lmsConnected = false;
// var learnername;
// var completionstatus;
// var lesson_location;

scorm.version = "1.2"
// scorm.version = '2004';

export default {
  connect() {
    if (scorm.init()) {
      scorm.set("cmi.exit", "suspend") // have to do this in order to save stuff, apparently. WHATEVER
      return true
    } else {
      return false
    }
  },
  setVersion(version) {
    // can be 1.2, 2004 1st edition, or whatever
    console.log("setVersion called")
    scorm.version = version
  },
  // getVersion() {
  //   console.log(scorm.version)
  // },
  // bookmark(place) { // MIGHT NOT BE A STRING
  //   scorm.set("cmi.location", place)
  // },
  // getBookmark() {
  //   return scorm.get("cmi.location")
  // },
  // suspendData(str) {
  //   scorm.set("cmi.suspend_data", str)
  // },
  // getSuspendedData() {
  //   return scorm.get("cmi.suspend_data")
  // },
  // recordQuestion(data) {
  //   let num = data.num

  //   scorm.set("cmi.interactions." + num + ".id", data.num) // id

  //   // Hmm .. was hoping question choices could be recorded
  //   //for (var x = 0; x < data.choices.length; x++) {  // choices .. cmi.interactions.n.objectives.n.id
  //   //	scorm.set("cmi.interactions."+ num +".objectives."+x+".id",data.choices[x]);
  //   //}

  //   scorm.set("cmi.interactions." + num + ".type", "other") // type .. they're all "choice" for this one
  //   scorm.set("cmi.interactions." + num + ".student_response", data.response) // response
  //   scorm.set("cmi.interactions." + num + ".result", "correct") // result
  // },
  // setScore(min, max, score) {
  //   scorm.set("cmi.core.score.raw", score)
  //   scorm.set("cmi.core.score.max", max)
  //   scorm.set("cmi.core.score.min", min)
  //   // scorm.set("cmi.score.scaled", scaled ); // some scorm 2004 stuff that's not in 1.2, although good to be aware that 2004 REQUIRES this..
  // },
  // setStatus(status) {
  //   // passed or failed
  //   // probably shouldn't setCompletion if setting status
  //   scorm.set("cmi.core.lesson_status", status)
  // },
  setCompletion(completionString) {
    // completion status not in scorm 1.2 it's all in lesson status
    // lesson status values “passed”, “completed”, “failed”, “incomplete”, “browsed”, “not attempted”
    // “completed”/“incomplete”,
    scorm.set("cmi.core.lesson_status", completionString)
  }
}
