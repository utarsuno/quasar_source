
let HUD       = function(){};
HUD.prototype = {

    GLOBAL_DATA: [
        {"id":1,"created_at":1564399210,"completed_at":1564413610,"due_at":1564410610,"iteration":0,"iterations_needed":1,"time_needed":null,"description":"Reply to Recruiter email"},
        {"id":2,"created_at":1564399210,"completed_at":1564413610,"due_at":1564413610,"iteration":0,"iterations_needed":1,"time_needed":null,"description":"Pay AT&T Internet Bill"},
        {"id":3,"created_at":1564399210,"completed_at":1564413610,"due_at":1564434610,"iteration":0,"iterations_needed":1,"time_needed":null,"description":"Pay Dieken phone bill"},
    ],

    __init__: function() {
        this.hud     = document.getElementById('b');
        this.context = this.hud.getContext('2d');
    },

    render: function() {
        console.log('Rendered!');
        //this.context.beginPath();
        //this.context.arc(150,150,50,0,2 * Math.PI);
        //this.context.stroke();

        this.context.clearRect(0, 0, this.hud.width, this.hud.height);
        //this.context.font = '128px Arial';
        this.context.font = 'bold 64px Helvetica';

        let i;
        let y = 200;
        for (i = 0; i < this.GLOBAL_DATA.length; i++) {
            let row = this.GLOBAL_DATA[i];

            var date = new Date(row['due_at']*1000);
            var s0   = new Date(row['due_at']*1000).toLocaleDateString('en-US');
            var s1   = new Date(row['due_at']*1000).toLocaleTimeString('en-US');

            this.context.fillText(
                'TASK[' + row['description'] + '], DUE AT[' + (s0 + '\t' + s1) + ']', 200, 200 + y
                //'TASK[' + this.GLOBAL_DATA['description'] + '], DUE IN[' + this.GLOBAL_DATA['due_at'] + ']', 200, 200
            );

            y += 72;
        }
    },

    set_dimensions: function(w, h) {
        this.hud.width        = w * 2;
        this.hud.height       = h * 2;
        this.hud.style.width  = w;
        this.hud.style.height = h;
        this.context.width    = w * 2;
        this.context.height   = h * 2;
    }
};

let _hud = new HUD();

export default {
    singleton_hud: _hud
}
