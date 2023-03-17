PennController.ResetPrefix(null);
 
var shuffleSequence = seq("consent", "IDentry", "demo", "intro",
                            "startpractice",
                                            
                            seq("practice"),
                        
                            "setcounter",
                            "starter",

                            seq(rshuffle(startsWith("mklo"), startsWith("gp"), startsWith("Subjexp"),
                                         startsWith("Objexp"))),
                            "sendresults",
                            "completion"
                         );
 
newTrial("IDentry",
   newText("instr", "Please enter your Prolific ID:").print()
   ,
   newHtml("partpage", "<input type='text' id='partID' name='participant ID' min='1' max='120'>").print()
   ,
   newButton("Next").print().wait(
       getVar("partID").set( v=>$("#partID").val() ).testNot.is('')
   )
)

newTrial("intro",
    newHtml("introhtml", "intro1.html")
        .print(),

    newText("What key do you press to read the sentence")
        .print()
        .bold(),

    newScale("q1", "Spacebar", "J")
        .labelsPosition("right")
        .print(),

    newText("How should you read the sentence")
        .print()
        .bold(),

    newScale("q2", "Out loud", "Silently")
        .labelsPosition("right")
        .print(),

    newText("Will the entire sentence stay on the screen?")
        .print()
        .bold(),

    newScale("q3", "No", "Yes")
        .labelsPosition("right")
        .print(),

    newText("error", "One or more of your responses to the questions above are incorrect")
        .color("red")
        .bold(),

    newButton("Continue")
        .print()
        .wait(
            getScale("q1").test.selected("Spacebar").failure(
                getText("error")
                    .print()
            ).and(getScale("q2").test.selected("Silently").failure(
                getText("error")
                    .print()
            )).and(getScale("q3").test.selected("No").failure(
                getText("error")
                    .print()
            ))
        )
)

 
 
Header(
   newVar("partID").global()   
)
.log( "partid" , getVar("partID") )
 
 
 
var showProgressBar =false;
 
var practiceItemTypes = ["practice"];
 
var manualSendResults = true;
 
var defaults = [
];

function modifyRunningOrder(ro) {

    var new_ro = [];
    item_count=0;
    for (var i in ro) {
      var item = ro[i];
      // fill in the relevant experimental condition names on the next line
      if (item[0].type.startsWith("mklo")|| item[0].type.startsWith("gp")
            || item[0].type.startsWith("Subjexp") || item[0].type.startsWith("Objexp")) {
          item_count++;
          new_ro.push(item);
        // first number after item count is how many items between breaks. second is total-items - 1
          if (item_count%30===0 & item_count<86){
         // value here should be total_items - items_per_block (to trigger message that last block is coming up)
              if (item_count===47){
                  text="End of block. Only 1 block left!";
                  }
              else {
        // first number is the total number of blocks. second number is number of items per block
                  text="End of block. "+(3-(Math.floor(item_count/30)))+" blocks left.";
              }ro[i].push(new DynamicElement("Message", 
                                { html: "<p>30-second break - stretch and look away from the screen briefly if needed.</p>", transfer: 30000 }));
          }
        } else {
        new_ro.push(item);
        }
    }
    return new_ro;
  }
 
 
Template("Experiment.csv", row => {

   items.push(
       [[row.label, row.item] , "PennController", newTrial(
           newController("DashedSentence", {s: row.sentence})
               .print()
               .log()
               .wait()
               .remove(),

            row.comprehension_question ? 
            newController("QuestionAlt", { 
                                      as: [["f", row.answerchoice0], ["j",row.answerchoice1]],
                                      // Needs to be cast as Num or else controller won't work
                                      // is expecting a Number
                                      hasCorrect: Number(row.correct_response),
                                      q: row.comprehension_question,
                                      randomOrder: false,
                                      presentHorizontally: true
            })
                .print()
                .log()
                .wait()
                :null
            
        )
       .log("counter", __counter_value_from_server__)
       .log("label", row.label)
       .log("latinitem", row.item)
       ]
   );
   return newTrial('_dummy_',null);
})

newTrial("demo",
   newHtml("Form", "demo.html")
       .log()
       .print()
   ,
   newButton("continue", "Submit")
       .css("font-size","medium")
       .center()
       .print()
       .wait(   
           getHtml("Form").test.complete()
           .failure( getHtml("Form").warn())
           ,
           newTimer("waitDemo", 500)
               .start()
               .wait()
           )
)
 

var items = [
 
   ["setcounter", "__SetCounter__", { }],
 
   ["sendresults", "__SendResults__", { }],
 
   ["consent", "Form", { html: { include: "consent.html" } } ],
 
 
 

 
 
["startpractice", Message, {consentRequired: false,
   html: ["div",
          ["p", "First you can do three practice sentences."]
         ]}],
 
["practice", "DashedSentence", {s:"What did the carpenter rust from the chinese restaurant?"}],
["practice", "DashedSentence", {s:"What did the pencil despise for the newspaper?"}],
["practice","DashedSentence", {s:"When did the butler ripple from the forgetful children?"}],
 
 
["starter", Message, {consentRequired: false,
   html: ["div",
          ["p", "Time to start the main portion of the experiment!"]
         ]}],
        
 
["completion", "Form", {continueMessage: null, html: { include: "completion.html" } } ]
 
];






