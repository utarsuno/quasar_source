$( document ).ready(function() {

    var textbox = $('#chat_input')

    var chat_history = []

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
        $.ajax({
            type: 'GET',
            url: 'get_all_messages',
            success: function(data) {
                console.log(data)
            }
        })
    }, 5000)

})
