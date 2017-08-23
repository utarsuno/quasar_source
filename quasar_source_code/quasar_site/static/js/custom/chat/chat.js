$( document ).ready(function() {

    var textbox = $('#chat_input')

    var chat_history = []

    $(document).keypress(function (e) {
        if (e.which == 13) {

            var text = textbox.val()
            textbox.val('')

            $.ajax({
                type: 'POST',
                url: 'message',
                data: text
            })
        }
    })


    window.setInterval(function(){
        $.ajax({
            type: 'POST',
            url: 'get_all_messages',
            success: function(data) {
                console.log('Data is ' + data)
            }
        })
    }, 5000)

})
