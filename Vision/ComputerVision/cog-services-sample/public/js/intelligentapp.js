//This code was developed by Kelsey Huebner, a Technical Evangelist as Microsoft to power intelligentapp.azurewebsites.net
//This is sample code for a personal project on implementing Microsoft Cognitive Services APIs into a web Services
//Go to microsoft.com/cognitive-services for details and documentation

function tagImage() {
    //  $("response").value("");
    var imgURL = document.getElementById("imgURL").value;
    var imgDisplay = document.getElementById("imageinput");
    imgDisplay.src = imgURL;
    var facesAmount;
    var facesObject;
    var facesEmot;
    var paramsDesc = {
    // Request parameters for Computer Vision API
    "visualFeatures": "Tags,Description,Color,ImageType"
    };
    var paramsFace = {
            // Request parameters for Face API
            "returnFaceId": "true",
            "FaceRectangle": "true",
            "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses"
    };

$.when( //chain events for Emotion and Face matching
    $.ajax({
        //begin request for Emotion API
            url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","{your key here}");
            },
            type: "POST",
            // Request body
         data: "{'url': '" + imgURL+ "' }"
   
    })
    .done(function(data) {
                var dataString = JSON.stringify(data);
                facesEmot = JSON.parse(dataString); 
        })
    .fail(function(e) {
            $("#description").text("Please provide a valid Image URL");
    }),
    $.ajax({
        //begin request for Vision API
            url: "https://api.projectoxford.ai/vision/v1.0/analyze?" + $.param(paramsDesc),      
            beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "{your key here}");
            },
            type: "POST",
            data: "{'url':'" + imgURL+ "'}",
            })
            .done(function (data) {
                var dataString = JSON.stringify(data);
                var msgs = JSON.parse(dataString);
                var msgTag = msgs.tags;
                var msgDesc = msgs.description.captions[0].text;
                var tagArray = [];
                var color = msgs.color;
                var imageType =msgs.imageType;
                var emotionText;
                
                for(var i = 0, l = msgTag.length; i < l; i++) {
                    var msg = msgTag[i];
                    tagArray.push(" #" +msg.name);      
                }
                //display tags and colors 
                document.getElementById("response").innerHTML = tagArray;      
                document.getElementById("dominantColor").setAttribute("style", "background:" + color.dominantColorForeground);
                document.getElementById("bgColor").setAttribute("style", "background:" + color.dominantColorBackground);
                document.getElementById("accentColor").setAttribute("style", "background:" + color.accentColor);
            })
            .fail(function (error) {
                $("#response").text("Please provide a valid Image URL");
            }),
            
    $.ajax({
            //Begin request for Face API
            url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(paramsFace),  
            beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "{your key here}");
            },
            type: "POST",
            data: "{'url':'" + imgURL+ "'}",
            })
            .done(function (data) {
                var dataString = JSON.stringify(data);
                facesObject = JSON.parse(dataString);
                facesAmount = facesObject.length;
            })
            .fail(function (error) {
                $("#description").text("Please provide a valid Image URL");
            })
            )
            .done(function(){
                //Now use the Face and Emotion API variables to describe the image
                facesArray = [];
                if(!facesAmount) {
                    document.getElementById("description").innerHTML = "Sorry, I do not recognize a face in this image";
                }
                else {
                for(var i = 0, l = facesAmount; i < l; i++) {
                //set face API variables per face in facesObject
                var face = facesObject[i].faceAttributes;
                var faceRect = facesObject[i].faceRectangle;
                var glasses = face.glasses;
                var smile = face.smile;
                var gender = face.gender;
                var age = face.age;
                var facialHair = face.facialHair;
     
                //check if female or male to get assumed pronoun
                var pronoun;
                (gender == "female") ? pronoun = "She" :   pronoun = "He";
            
                //check for smile, not currently using due to emotion addition
                var isSmiling;
                (smile > .5) ? isSmiling = "is smiling" : (smile <.5 && smile >.02) ? isSmiling ="neutral" : isSmiling = "not smiling" ;

                //what kind of glasses are they wearing
                var glassesType;

                (glasses == "NoGlasses") ? glassesType = " not wearing glasses" : (glasses =="Sunglasses") ? glassesType = " wearing sunglasses" : (glasses="ReadingGlasses") ? glassesType= " wearing reading glasses" : glassTypes = "wearing glasses";

                //does this person have facial hair?
                var facialHairArray= [];
                if (facialHair.beard > .5) {
                    facialHairArray.push(" with a beard");
                }
                if (facialHair.moustache > .5) {
                    facialHairArray.push(" with a moustache");
                }
                if (facialHair.sideburns > .5) {
                    facialHairArray.push(" with sideburns");
                }

                //check against emotion and face API faceRectangles to map the right emotion per face

               
                    //get the scores for each face
                    var scores = facesEmot[i].scores;
                    var faceRectEmot = facesEmot[i].faceRectangle;
                    //make sure that the face returned from Emotion API is same as Face API
                    if (faceRect.left == faceRectEmot.left && faceRect.top == faceRectEmot.top) {
                    
                    //here we find the last score that matches at least one of these options
                    //will fix in next version because even if a key is 1 which is most likely, it can be overriden by a .2 due to the loop
                    //cannot break a forEach statement so need to find next best solution for looping through the Object's keys
                    Object.keys(scores).forEach(function(key,index) {
                    // key: the name of the object key
                    // index: the ordinal position of the key within the object
              
                    if (scores[key] == 1) {
                        //return first key that matches exactly
                      //  emotionArray.push(key);
                        emotionText = key;
                        return;
                    } 
                    if (scores[key] > .75) {
                        //let's get second best score...
                      //  emotionArray.push(key);
                        emotionText = key;
                        return;
                    }
                    if (scores[key] > .5) {
                        //let's try one more...
                      ///  emotionArray.push(key); 
                        emotionText = key;
                        return;
                    }
                    if (scores[key] > .2) {
                        //let's try one more...
                       // emotionArray.push(key); 
                        emotionText=key;
                        return;
                    }
                        return;
                    })
                }
   
                //check if emotionText is undefined, and set to no emotion
                if (emotionText == "undefined") {
                    emotionText = "no emotion";
                }
            
                facesArray.push("There is a " + age + " " + gender + glassesType + facialHairArray + " showing " + emotionText +". <br>");
                }
                document.getElementById("description").innerHTML = facesArray.join("");
                }
            })
            .fail(function(){
});
}
