function tagImage() {
    //  $("response").value("");
    var imgURL = document.getElementById("imgURL").value;
    var imgDisplay = document.getElementById("imageinput");
    imgDisplay.src = imgURL;

    var paramsDesc = {
    // Request parameters
    "visualFeatures": "Tags,Description,Color,ImageType"
        };
    $.ajax({
            url: "https://api.projectoxford.ai/vision/v1.0/analyze?" + $.param(paramsDesc),      
            beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "1509752abed946fe8d21cc1d998286d5");
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
                
                for(var i = 0, l = msgTag.length; i < l; i++) {
                    var msg = msgTag[i];
                    tagArray.push(" #" +msg.name);      
                }
                //apply the tags to the response div
                document.getElementById("response").innerHTML = tagArray;      
                document.getElementById("dominantColor").setAttribute("style", "background:" + color.dominantColorForeground);
                document.getElementById("bgColor").setAttribute("style", "background:" + color.dominantColorBackground);
                document.getElementById("accentColor").setAttribute("style", "background:" + color.accentColor);
            })

         

            .fail(function (error) {
                $("#response").text("Please provide a valid Image URL");
            })

            var paramsFace = {
            // Request parameters
            "returnFaceId": "true",
            "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses"
      }

$.ajax({
            url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(paramsFace),  
            beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "02fa0b4d321a486dbb4c29c3ee25ad2d");
            },
            type: "POST",
            data: "{'url':'" + imgURL+ "'}",
            })
            
            .done(function (data) {
                var dataString = JSON.stringify(data);
                var facesObject = JSON.parse(dataString);
                var facesAmount = facesObject.length;
                facesArray = [];
               
                if(!facesAmount) {
                    document.getElementById("description").innerHTML = "Sorry, I do not recognize a face in this image";
                }
                else {
                for(var i = 0, l = facesAmount; i < l; i++) {
      
                var face = facesObject[i].faceAttributes;
                var glasses = face.glasses;
                var smile = face.smile;
                var gender = face.gender;
                var age = face.age;
                var facialHair = face.facialHair
                //check if female or male to get pronoun
                var pronoun;
                (gender == "female") ? pronoun = "She" :   pronoun = "He";
            
                //if smile is >.5 then say 'is smiling' 
                var isSmiling;
                (smile > .5) ? isSmiling = "is smiling" : (smile <.5 && smile >.02) ? isSmiling ="neutral" : isSmiling = "not smiling" ;

                //what kind of glasses are they wearing
                var glassesType;

                (glasses == "NoGlasses") ? glassesType = " not wearing glasses" : (glasses =="Sunglasses") ? glassesType = " wearing sunglasses" : glassTypes = "wearing glasses";


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

                facesArray.push("There is a " + gender + glassesType + facialHairArray +  ". " + pronoun + " looks " + age + " and is " + isSmiling + ".");
                }
                document.getElementById("description").innerHTML = facesArray;
                }
          
            })

            .fail(function (error) {
                $("#description").text("Please provide a valid Image URL");
            })
        };  

    
    // images to test:
    // https://cdn111.picsart.com/214586577002202.jpg
    // https://cdn111.picsart.com/213738630003202.jpg  
    // https://cdn116.picsart.com/214506343001202.jpg  
    // https://cdn113.picsart.com/214670821003202.jpg
    // https://cdn114.picsart.com/214662062001202.jpg
    // https://cdn111.picsart.com/214294150001202.jpg
    // https://cdn129.picsart.com/213046190007201.jpg



        

