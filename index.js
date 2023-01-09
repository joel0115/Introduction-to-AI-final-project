const input_sequence_len = 24;
w2i_url = './word2integer.json'
tfjs_url = './model.json'
i2w_url = 'integer2word.json'


const click_pred = (obj) => {
    text_to_append = obj.innerHTML;
    origin_text = $("#nme").val();
    $("#nme").val(origin_text + text_to_append).trigger("change");
}

const text_to_int = (text, dict) => {
    let int_sequence = []
    for (let i = 0; i < text.length; i++) {
        if (text[i] in dict) {
            int_sequence.push(dict[text[i]])
        }
        else {
            int_sequence.push(0)
        }
    }
    pad_lenth = input_sequence_len - int_sequence.length
    for (let i = 0; i < pad_lenth; i++) {
        int_sequence = [0, ...int_sequence]
    }
    if (int_sequence.length > input_sequence_len) {
        int_sequence = int_sequence.slice(-input_sequence_len);
    }
    return int_sequence
}

$(document).ready(() => {
    $("#nme").change(() => {
        fetch(w2i_url)
            .then(response => {
                return response.json()
            })
            .then(dict => {
                var text = $('#nme').val();
                var int_sequence = text_to_int(text, dict);
                console.log(int_sequence)
                model = tf.loadLayersModel(tfjs_url);
                model.then(function (res) {
                    const prediction = res.predict(tf.tensor([int_sequence])).arraySync()[0];
                    console.log(prediction);

                    fetch(i2w_url)
                        .then(res => {
                            return res.json()
                        })
                        .then(dict => {
                            max_list = []
                            for (let i = 0; i < 5; i += 1) {
                                let max = Math.max(...prediction);
                                let cls = prediction.indexOf(max);
                                console.log(max)
                                console.log(cls)
                                prediction[cls] = -1;
                                max_list.push(cls);
                            }
                            // remove all previous answer
                            $("#result").empty();

                            for (let i = 0; i < 5; i += 1) {
                                $("#result").append(`<span style="margin-left:10px; width:20%; border:solid 1px; display:inline; font-size:50px" class="pred" onclick="click_pred(this)">${dict[max_list[i].toString()]}</span>`)
                            }
                        })
                });
            })
    });
})

// $(document).ready(() => {
//     $("#nme").on("input", () => {
//         $("#result").text("Changed");
//     });
// })
