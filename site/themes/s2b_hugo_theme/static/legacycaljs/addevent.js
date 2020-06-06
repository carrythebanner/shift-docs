(function($) {

    $.fn.getAddEventForm = function(id, secret, callback) {
        if (id && secret) {
            // TODO: loading spinner
            $.ajax({
                url: '/api/retrieve_event.php?id=' + id + "&secret=" + secret,
                type: 'GET',
                success: function(data) {
                    data.secret = secret;
                    data.readComic = true;
                    data.codeOfConduct = true;
                    populateEditForm( data, callback );
                },
                error: function(data) {
                    callback( data.responseJSON.error.message );
                }
            });
        } else {
            populateEditForm({ datestatuses: [] }, callback);
        }
    };

    function populateEditForm(shiftEvent, callback) {
        var i, h, m, meridian,
            displayHour, displayMinute, timeChoice,
            template, rendered, item,
            lengths = [ '0-3', '3-8', '8-15', '15+'],
            audiences = [{code: 'F', text: 'Family friendly. Adults bring children.'},
                         {code: 'G', text: 'General. For adults, but kids welcome.'},
                         {code: 'A', text: '21+ only.'}],
            areas = [{code: 'P', text: 'Portland'},
                {code: 'V', text: 'Vancouver'}];

        shiftEvent.lengthOptions = [];
        for ( i = 0; i < lengths.length; i++ ) {
            item = {range: lengths[i]};
            if (shiftEvent.length == lengths[i]) {
                item.isSelected = true;
            }
            shiftEvent.lengthOptions.push(item);
        }

        shiftEvent.timeOptions = [];
        meridian = 'AM';
        for ( h = 0; h < 24; h++ ) {
            for ( m = 0; m < 60; m += 15 ) {
                if ( h > 11 ) {
                    meridian = 'PM';
                }
                if ( h === 0 ) {
                    displayHour = 12;
                } else if ( h > 12 ) {
                    displayHour = h - 12;
                } else {
                    displayHour = h;
                }
                displayMinute = m;
                if ( displayMinute === 0 ) {
                    displayMinute = '00';
                }
                timeChoice = {
                    time: displayHour + ':' + displayMinute + ' ' + meridian,
                    value: h + ':' + displayMinute + ':00'
                };
                if (h < 10) {
                    timeChoice.value = '0' + timeChoice.value;
                }
                if (shiftEvent.time === timeChoice.value) {
                    timeChoice.isSelected = true;
                }
                shiftEvent.timeOptions.push(timeChoice);
            }
        }
        shiftEvent.timeOptions.push({ time: "11:59 PM" });
        if (!shiftEvent.time) {
            // default to 5:00pm if not set;
            // 0 = 12:00am, 1 = 12:15am, 2 = 12:30am, ... 68 = 5:00pm
            shiftEvent.timeOptions[68].isSelected = true;
        }

        if (!shiftEvent.audience) {
            shiftEvent.audience = 'G';
        }
        shiftEvent.audienceOptions = [];
        for ( i = 0; i < audiences.length; i++ ) {
            if (shiftEvent.audience == audiences[i].code) {
                audiences[i].isSelected = true;
            }
            shiftEvent.audienceOptions.push(audiences[i]);
        }

        if (!shiftEvent.area) {
            shiftEvent.area = 'P';
        }
        shiftEvent.areaOptions = [];
        for ( i = 0; i < areas.length; i++ ) {
            if (shiftEvent.area == areas[i].code) {
                areas[i].isSelected = true;
            }
            shiftEvent.areaOptions.push(areas[i]);
        }

        template = $('#mustache-edit').html();
        rendered = Mustache.render(template, shiftEvent);
        callback(rendered);

        $('#date-select').setupDatePicker(shiftEvent['datestatuses'] || []);

        if (shiftEvent['datestatuses'].length === 0) {
            $('.save-button').prop('disabled', true);
            $('.preview-button').prop('disabled', true);
        }

        if (shiftEvent.published) {
          $('.published-save-button').show();
        }

        $('.save-button, .publish-button').click(function() {
            var postVars,
                isNew = !shiftEvent.id;
            $('.form-group').removeClass('has-error');
            $('[aria-invalid="true"]').attr('aria-invalid', false);
            $('.help-block').remove();
            $('.save-result').removeClass('text-danger').text('');
            postVars = eventFromForm();
            if (!isNew) {
                postVars['id'] = shiftEvent.id;
            }
            var data = new FormData();
            $.each($('#image')[0].files, function(i, file) {
                data.append('file', file);
            });
            data.append('json', JSON.stringify(postVars));
            var opts = {
                type: 'POST',
                url: '/api/manage_event.php',
                contentType: false,
                processData: false,
                cache: false,
                data: data,
                success: function(returnVal) {
                    var msg = isNew ?
                        'Thank you! Your event has been submitted and will be reviewed. ' +
                            'Please contact bikecal@shift2bikes.org if you have any questions.' :
                        'Your event has been updated!';
                    if (returnVal.published) {
                        $('.unpublished-event').remove();
                        $('.published-save-button').show();
                    }

                    if (isNew) {
					    var newUrl = 'event-submitted';
					    history.pushState({}, newUrl, newUrl);
					    $('.edit-buttons').prop('hidden', true);
					    $('#mustache-html').html('<p>Event submitted! All submissions are reviewed by our moderators.</p><p><a href="/calendar/">See all upcoming events</a> or <a href="/addevent/">add another event</a>.</p>');
                    }
                    $('#success-message').text(msg);
                    $('#success-modal').modal('show');
                    shiftEvent.id = returnVal.id;
                },
                error: function(returnVal) {
                    var err = returnVal.responseJSON
                                ? returnVal.responseJSON.error
                                : { message: 'Server error saving event!' },
                        okGroups,
                        errGroups;

                    $('.save-result').addClass('text-danger').text(err.message);

                    $.each(err.fields, function(fieldName, message) {
                        var input = $('[name=' + fieldName + ']'),
                            parent = input.closest('.form-group,.checkbox'),
                            label = $('label', parent);
                        input.attr('aria-invalid', true);
                        parent
                            .addClass('has-error')
                            .append('<div class="help-block">' + message + '</div>');
                        $('.help-block .field-name', parent).text(
                            label.text().toLowerCase()
                        );
                    });

                    // Collapse groups without errors, show groups with errors
                    errGroups = $('.has-error').closest('.panel-collapse');
                    okGroups = $('.panel-collapse').not(errGroups);
                    errGroups.collapse('show');
                    okGroups.collapse('hide');
                    $('.preview-edit-button').click();
                }
            };
            if(data.fake) {
                opts.xhr = function() { var xhr = jQuery.ajaxSettings.xhr(); xhr.send = xhr.sendAsBinary; return xhr; }
                opts.contentType = "multipart/form-data; boundary="+data.boundary;
                opts.data = data.toString();
            }
            $.ajax(opts);
        });

        $(document).off('click', '.preview-button')
            .on('click', '.preview-button', function(e) {
            previewEvent(shiftEvent, function(eventHTML) {
                $('#mustache-html').append(eventHTML);
            });
        });
    }

    function previewEvent(shiftEvent, callback) {
        var previewEvent = {},
            mustacheData;
        var $form = $('#event-entry');
        $.extend(previewEvent, shiftEvent, eventFromForm());
        previewEvent.displayTime = previewEvent.time;
        previewEvent['length'] += ' miles';
        previewEvent['mapLink'] = $form.getMapLink(previewEvent['address']);
        $form.hide();
        mustacheData = {
            dates:[],
            preview: true,
            expanded: true
        };
        $.each(previewEvent.datestatuses, function(index, value) {
            var date = $form.formatDate(value['date']);
            mustacheData.dates.push({ date: date, events: [previewEvent] });
        });
        $('.preview-button').hide();
        $('.preview-edit-button').show();
        var template = $('#view-events-template').html();
        var info = Mustache.render(template, mustacheData);
        callback(info);
    }

    function eventFromForm() {
        var harvestedEvent = {};
        $('form').serializeArray().map(function (x) {
            harvestedEvent[x.name] = x.value;
        });
        harvestedEvent['datestatuses'] = $('#date-picker').dateStatusesList();
        return harvestedEvent;
    }

    // Set up email error detection and correction
    $( document ).on( 'blur', '#email', function () {
        $( this ).mailcheck( {
            suggested: function ( element, suggestion ) {
                var template = $( '#email-suggestion-template' ).html(),
                    data = { suggestion: suggestion.full },
                    message = Mustache.render( template, data );
                $( '#email-suggestion' )
                    .html( message )
                    .show();
            },
            empty: function ( element ) {
                $( '#emailMsg' )
                    .hide();
            }
        } );
    } );

    $( document ).on( 'click', '#email-suggestion .correction', function () {
        $( '#email' ).val( $( this ).text() );
        $( '#email-suggestion' )
            .hide();
    } );

    $( document ).on( 'click', '#email-suggestion .glyphicon-remove', function () {
        $( '#email-suggestion' )
            .hide();
        // They clicked the X button, turn mailcheck off
        // TODO: Remember unwanted corrections in local storage, don't offer again
        $( document ).off( 'blur', '#email' );
    } );

}(jQuery));
