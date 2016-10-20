function tagImage() {
    //  $("response").value("");
    var imgURL = document.getElementById("imgURL").value;
       var imgDisplay = document.getElementById("imageinput");
       imgDisplay.src = imgURL;

        var params = {
            // Request parameters
            "visualFeatures": "Tags, Description"
        
        };
    $.ajax({
            url: "https://api.projectoxford.ai/vision/v1.0/analyze?" + $.param(params),      
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
                var msgLen = msgTag.length; 
                var tagArray = [];
                
                for(var i = 0, l = msgLen; i < l; i++) {
                    var msg = msgTag[i];
                    tagArray.push(" #" +msg.name);      
                }
                //apply Description to the div, commenting out for now
              //  document.getElementById("description").innerHTML = msgDesc;

                //apply the tags to the response div
                document.getElementById("response").innerHTML = tagArray;
  
        //images to test:
       // https://cdn117.picsart.com/213689042000202.jpg?r1024x1024
       //https://cdn111.picsart.com/214373619002202.jpg?r1024x1024        
          
            })

            .fail(function (error) {
                $("#response").text("Please provide a valid Image URL");
            })
        };  

       

        

