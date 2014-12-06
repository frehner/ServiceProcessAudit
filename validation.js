$( document ).ready(function() {
	var schema;
	$.getJSON( "lib/pcnspec_jsonschema.json", function( json ) {
		schema = json;
	});


    $("#validate").click(function(){
		var data = $.parseJSON($("#finalJson").val());
		
		//validate PCN Spec json (data) according to schema
		var validation = tv4.validateMultiple(data, schema);

		var cont = $('#validation');
		cont.empty();
		cont.append("valid: " + validation.valid);
		cont.append("<br>errors:");
		$.each(validation.errors, function() {
			cont.append("<br>&nbsp&nbsp&nbsp&nbsp;" + this.message);
			cont.append("<br>&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp;dataPath: " + this.dataPath);
			cont.append("<br>&nbsp;&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp;schemaPath: " + this.schemaPath);

		});
		cont.append("<br>missing:");
		$.each(validation.missing, function() {
			cont.append("<br>" + this);
		});

    }); 

	



});