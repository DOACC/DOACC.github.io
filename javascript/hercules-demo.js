$(document).ready(function(){
    $("#start").click(function() {
        var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
        turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
        turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
        turtleParser.compileRuleSet();
        var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0(document.location.toString());
        turtleParser.parse(document.getElementById("n3").value, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);

        var engine = new Arielworks.Hercules.Sparql.Engine(action.graph.tripleList);
        var query = engine.prepare(document.getElementById("query").value);
        var results = query.execute();

        var resultVariables = results.getVariableList();

        $("#result_head").empty();
        $("#result_body").empty();
        var tr = $("<tr/>").appendTo("#result_head");
        for (var i = 0; i < resultVariables.length; i++) {
            $("<th/>").css("background", "#ababab").text(resultVariables[i]).appendTo(tr);
        }

        for (var i = 0 ; i < results.length; i++) {
            var tr = $("<tr/>").appendTo("#result_body");
            for (var j = 0; j < resultVariables.length; j++) {
                var value = ""
                if (results[i][resultVariables[j]]) {
                    var v = results[i][resultVariables[j]];
                    if (v instanceof Arielworks.Hercules.Rdf.RdfUriRef) {
                        value = "<" + v.getValue()  + ">";
                    } else if (v instanceof Arielworks.Hercules.Rdf.PlainLiteral) {
                        var l = v.getLanguageTag();
                        value = '"' + v.getValue() + '"' + (l ? "@" + l : "");
                    } else if (v instanceof Arielworks.Hercules.Rdf.TypedLiteral) {
                        var t = v.getDataTypeIri();
                        value = '"' + v.getValue() + '"' + (t ? "^^<" + t + ">" : "");
                    } else if (v instanceof Arielworks.Hercules.Rdf.BlankNode) {
                        value = "_:" + v.getValue();
                    } else {
                        alert("ERROR");
                    }
                }
                $("<td/>").css("background", "#e0e0e0").text(value).appendTo(tr);

            }
        }
    });
});
