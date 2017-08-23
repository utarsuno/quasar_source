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
                console.log('Data is ' + data)
                for (var d in data) {
                    console.log(d)
                    chat_history.push(d)
                }
            }
        })
    }, 5000)

})
