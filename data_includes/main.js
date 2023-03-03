PennController.ResetPrefix(null);
 
var shuffleSequence = seq("consent", "IDentry", "demo", "intro",
                            "startpractice",
                                            
                            seq("practice"),
                        
                            "setcounter",
                            "starter",

                            seq(rshuffle(startsWith("mklo"), startsWith("gp"), startsWith("psych"))),
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






