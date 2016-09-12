/*
 This function collapses/hides a group of form fields concactenating the values into one line
 and adds a button to unhide it. This is handy for things like addresses and
 phone fields to put more information into horizontal view vs long list of small pieces
 of info. elementIdList is the list of dom ids to rollup, top_element is the first element
 in the list of fields that is used to insert a row with the concatenated
 field values of the group. label is the name of the new concatenated field.
 phone is a boolean when true is used for phone numbers to concatenate the type of
 phone number (home,work etc) to the list.
 labelcallback if supplied will be passed a label for each input element
 and the function should parse the label to extract relevent info
 e.g. Home Phone: xxx-xxx-xxxx  The function should split on space and return first field
 */

function inputRollup(elementIdList, labelForRollup, labelCallback) {
    "use strict";
    var top = "#" + elementIdList[0];
    var elementIdArr = [];
    elementIdList.forEach(function (el) {
        elementIdArr.push("#" + el);
    });
    var fields = $(elementIdArr.join(","));
    var joinedFieldVals = "";
    var empty = true;

    // create new field from concatenated vals
    //
    // if callback passed, it means we are going to iterate the labels for each input element
    // and create a prefix to the values.. for things like phone #s (e.g cell, home) this is necessary
    // for things like addresses it is not
    if (labelCallback) {
        var labArr = [];
        elementIdList.forEach(function (id) {
            var $lab = $("label[for=" + id + "]");
            labArr.push(labelCallback($lab.text()) + ":");
        });
        $(fields).each(function (i) {
            var val = $(this).val();
            if (val) {
                empty = false;
                joinedFieldVals += "<b>" + labArr[i] + "</b>" + val + " ";
            }
        });
    } else { // just the vals for things like addresses
        $(fields).each(function () {
            var val = $(this).val();
            if (val) {
                empty = false;
            }
            joinedFieldVals += val + " ";
        });
    }

    // if no data in the group, dont collapse it
    if (empty) {
        return;
    }
    // hide the group: tr tr<-td<-input (grandparent) for all the matching input elements
    fields.parent().parent().hide();

    // edit() is a closure that captures the fields
    // and top value to be used when opening and closing.
    // button is passed in by the click handler so
    // we can check and alter its text value (edit or close)
    function edit(button) {
        if ($(button).text() === "close") {
            $(fields).parent().parent().hide();
            $(button).text("edit");
            return;
        }
        $(fields).parent().parent().show();
        $(top).focus();
        $(button).text('close');
    }

    var button = $("<button type=button >edit</button>");

    button.on("click", function (event) {
        event.preventDefault(); // to prevent submit
        edit(this);
    });

    // make up a dom id for the label and span
    var spanId = Date.now() + "_" + labelForRollup.replace(/ /g, "_");
    var content = "<tr><th><label for=" + spanId + ">" + labelForRollup + "</label></th><td><span id=" + spanId + ">" + joinedFieldVals + "</span></td></tr>";

    //add new row before the top element of the group that we are hiding
    $(top).closest("tr").before(content);

    //add button after the span
    $("#" + spanId).after(button);
}


