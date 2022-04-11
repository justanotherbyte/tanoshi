// With the Tauri global script, enabled when `tauri.conf.json > build > withGlobalTauri` is set to true:
const invoke = window.__TAURI__.invoke;

console.log(invoke);
// Invoke the command



const url_input = document.getElementById("url-input");
const http_send_button = document.getElementById("http-send-btn");
const http_method_input = document.getElementById("http-method-input");

const status_info = document.getElementById("status-info");
const size_info = document.getElementById("size-info");
const time_info = document.getElementById("time-info");

http_send_button.onclick = function() {
    const method = http_method_input.value;
    const url = url_input.value;
    const data = {
        url: url,
        method: method
    };

    invoke('make_request', data).then(response => { 
        status_info.textContent = response.status_code;
        size_info.textContent = response.body.length / 1000 + " KB";

        var time = response.time;

        if (response.time === 0) {
            time = 1;
        };
        
        time_info.textContent = time + " ms";

        const rendered_response_iframe = document.getElementById("rendered-response-iframe");
        const local_src = response.body;
        rendered_response_iframe.srcdoc = local_src;
        
        var display_class;
        if (response.success) {
            display_class = "text-emerald-500";
        } else {
            display_class = "text-red-500"
        }

        status_info.classList = [display_class];
        size_info.classList = [display_class];
        time_info.classList = [display_class];
    })

}