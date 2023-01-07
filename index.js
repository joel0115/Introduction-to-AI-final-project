const input_sequence_len = 2;
url = './word2integer.json'
tfjs_url = './model.json'
i2w_url = 'integer2word.json'

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

    for (let i = 0; i < (input_sequence_len - int_sequence.length); i++) {
        int_sequence = [0, ...int_sequence]
    }

    if (int_sequence.length > input_sequence_len) {
        int_sequence = int_sequence.slice(-input_sequence_len);
    }
    return int_sequence
}

$(document).ready(() => {
    $("#nme").change(() => {
        fetch(url)
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
                            let max = Math.max(...prediction);
                            let cls = prediction.indexOf(max);
                            console.log(max)
                            console.log(cls)

                            result = dict[cls.toString()]
                            console.log(result)
                            $("#result").text(result);
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
