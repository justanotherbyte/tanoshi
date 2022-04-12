// With the Tauri global script, enabled when `tauri.conf.json > build > withGlobalTauri` is set to true:
const invoke = window.__TAURI__.invoke;

const url_input = document.getElementById("url-input");
const http_send_button = document.getElementById("http-send-btn");
const http_method_input = document.getElementById("http-method-input");

const status_info = document.getElementById("status-info");
const size_info = document.getElementById("size-info");
const time_info = document.getElementById("time-info");

http_send_button.onclick = function() {
    const method = http_method_input.value;
    var url = url_input.value;

    var params = read_query_parameters();
    var headers = read_headers();
    var new_url_promise = _add_query_parameters(url, params);

    new_url_promise.then(new_url => {
        var data = {
            method: method,
            url: new_url,
            headers: headers
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
            rendered_response_iframe.srcdoc = response.body;
            
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
    });
}

function _add_query_parameters(url, parameters) {
    return invoke("add_query_parameters", {url: url, parameters: parameters}).then(new_url => {
        return new_url
    });
}

function read_query_parameters() {
    var query_name_list = document.getElementById("query-name-list").getElementsByTagName("*");
    var query_value_list = document.getElementById("query-value-list").getElementsByTagName("*");
    var parameters = [];
    for (var index = 0; index < query_name_list.length; index++) {
        var name = query_name_list[index];
        var value = query_value_list[index];

        name = name.value;
        value = value.value;

        var tuple = [name, value];

        if (name) {
            parameters.push(tuple);
        }
    }

    return parameters
}

function read_headers() {
    var header_name_list = document.getElementById("header-name-list").getElementsByTagName("*");
    var header_value_list = document.getElementById("header-value-list").getElementsByTagName("*");
    var headers = [];
    for (var index = 0; index < header_name_list.length; index++) {
        var name = header_name_list[index];
        var value = header_value_list[index];

        name = name.value;
        value = value.value;

        var tuple = [name, value];

        if (name) {
            headers.push(tuple);
        }
    }

    return headers
}