// Super function to use inside view for sweet captcha.
function runCaptcha(i){ // Pass an element ID to the function.
    var e = document.getElementById(i);
    var Reg = '(?:<script.*?>)((\n|.)*?)(?:</script>)'; //Regex for all content between <script> tags.
    var match    = new RegExp(Reg, 'img');
    var scripts  = e.innerHTML.match(match);

    var doc = document.write; // Store the functionality of document.write temporarily.
    //Overwrite document.write with a new function that takes the innerHTML of the passed element
    //then replaces the <script> tag with the output of the passed content.
    document.write = function(p){ e.innerHTML = e.innerHTML.replace(scripts[s],p)};

    if (scripts) { //if matches
        for(var s = 0; s < scripts.length; s++) { //loop through matches
            var js = '';
            var match = new RegExp(Reg, 'im'); //find first match
            js = scripts[s].match(match)[1]; //inner content of the first match
            eval('try{'+js+'}catch(e){}'); //evaluate the inline JS.
        }

    }

    document.write = doc; //Reset document.write back to its original functionality
}