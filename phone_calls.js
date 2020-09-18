const fs = require('fs');
const ami = require('asterisk-manager')('5038','localhost','xuwadmin','901vaR3R123-', true);
ami.keepConnected(); // in case of connectivity problems

console.log("Connected to AMI");

// asterisk
const saveFolder = "/var/spool/asterisk/pranks/";
const fileExt = ".wav";

ami.on('confbridgestart', function(start) {
console.log('start!!');
console.log(start);
});

ami.on('confbridgejoin', function(start) {
console.log('join!!');
console.log();
});

ami.on('confbridgeleave', function(start) {
console.log('leave!!');
console.log(start);
});

ami.on('confbridgeend', function(start) {
console.log('end!!');
console.log(start);
});

ami.on('confbridgetalking', function(start) {
console.log('talking!!');
console.log(start);
});

ami.on('cdr', function (cdr) {

console.log(cdr);
if(!cdr.userfield) return;

var userField = cdr.userfield;
var result = cdr.disposition;
var prankId = userField.substring(0, userField.indexOf('-'));
var userId = userField.split('-').pop();
var fileName = userField + fileExt;

console.log("Call result: " + result);

    if(result == "ANSWERED") {
	uploadCall(saveFolder, fileName, prankRef, userPrankRef);
    }
});


function sendCall(receiver, callerid, customId, mp3Path) {
	ami.action({
	  'Action':'Originate',
	  'Account':customId,
	  'Channel':'Local/' + receiver + '@local-proxy-record',
	  'Application':'MP3Player',
	  'Data':mp3Path,
	  'CallerID':'\"TuilljRing\" <' + callerid + '>',
	  'Context':'outgoing',
	  'Async':true,
	  'Exten':receiver,
	  'Variable':'CDR(userfield)=' + customId
	}, function(err, res) {});
}

function sendCallNew(receiver, callerid, customId, mp3Path) {
	// place call
	ami.action({
	  'Action':'Originate',
	  'Channel':'Local/4746800882@stream',
	  'Context':'stream',
	  'Async':true,
	  'Exten':'100'
	}, function(err, res) {});


	// start streaming
	ami.action({
	  'Action':'Originate',
	  'Channel':'Local/102@stream',
	  'Context':'stream',
	  'Async':true,
	  'Exten':'100'
	}, function(err, res) {});
}

function writeCallFile(receiver, callerid, mp3Path) {


	var longString =  "Channel: Local/" + receiver + "@local-proxy-record\n";
	    longString += "Application: MP3Player\n";
	    longString += "Data: " + mp3Path + "\n";
	    longString += "CallerId: \"TuilljRing\" <" + callerid + ">\n";
	    longString += "MaxRetries: 0";

	var path = "/tmp/" + receiver + ".call";
	var newPath = "/var/spool/asterisk/outgoing/" + receiver + ".call";

	fs.writeFile(path, longString, function(err) {
	    if(err)
		return console.log(err);
	    console.log("The file was saved!");

	fs.rename(path, newPath, function(err) {
	    if (err)
		return console.log('ERROR: ' + err);
	});

	});

}
