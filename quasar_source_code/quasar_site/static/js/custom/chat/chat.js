$( document ).ready(function() {

    var textbox = $('#chat_input')


    $(document).keypress(function (e) {
        if (e.which == 13) {

            var text = textbox.val()

            if (text.length > 0) {
                $.ajax({
                    type: 'POST',
                    url: 'message',
                    data: {message: text}
                })
            }

            textbox.val('')

            e.stopPropagation()
        }
    })

    window.setInterval(function(){
        $.get( 'get_all_messages', function(data) {

            console.log(data)

            var number_of_messages = data.data.length
            var number_to_ignore = 0
            if (number_of_messages > 30) {
                number_to_ignore = number_of_messages - 30
            }

            // Set up a new list
            var $list = $('<ul id="basic_chat"></ul>')

            // Loop through the list array, adding an <li> for each list item
            var i = 0
            $.each(data.data, function(index, element) {
                if (i < number_to_ignore) {
                    i += 1
                } else {
                    $list.append('<li>' + element + '</li>')
                }
            })

            // Replace the old element with the new list
            var $original = $('#basic_chat')
            $original.replaceWith( $list )
        })
    }, 5000)

})
