const path = window.__TAURI__.path;
const invoke = window.__TAURI__.invoke;
const fs = window.__TAURI__.fs;

const new_request_button = document.getElementById("new-request-btn");
const mobile_new_request_button = document.getElementById("mobile-new-request-btn");
const rendered_response_iframe = document.getElementById("rendered-response-iframe");

const url_input = document.getElementById("url-input");
const http_send_button = document.getElementById("http-send-btn");
const http_method_input = document.getElementById("http-method-input");

const status_info = document.getElementById("status-info");
const size_info = document.getElementById("size-info");
const time_info = document.getElementById("time-info");


new_request_button.onclick = function() {
    clearWayForRequest();
}

mobile_new_request_button.onclick = function() {
    clearWayForRequest();
}

function clearWayForRequest() {
    var current_url = url_input.value;
    var method = http_method_input.value;

    console.log(current_url);

    if (current_url) {
        if (method) {
            createNewRequestHistory(method, current_url);
            setTimeout(loadHistory, 1000);
        }
    }
    rendered_response_iframe.srcdoc = "";
    url_input.value = "";

    status_info.textContent = "...";
    size_info.textContent = "...";
    time_info.textContent = "...";
}

function createNewRequestHistory(method, url) {
    path.appDir().then(path => {
        console.log(path);
        var opts = { recursive: true }

        fs.createDir(path, opts).then(_ => {
            var time = new Date();
            time = time.toISOString();
            const data = {
                url: url,
                method: method,
                time: time,
                appDir: path,
                name: "history.json"
            };
            invoke("append_history_store", data).then(_ => {
                console.log("entry-created");
            })
            
        })
    })
}

function createHistoryEntryNode(method, url, time) {
    // <li class="flex w-full justify-between text-gray-300 cursor-pointer items-center">
    //     <div class="w-full border-t border-b border-gray-300 py-3 px-2">
    //       <h3 class="text-white bg-blue-500 text-xs font-bold py-1 px-2 rounded-md w-1/5 text-center" id="method-header">GET</h3>
    //       <h5 class="text-gray-400 truncate text-xs font-bold mt-3" id="url-header">
    //         https://cdn.discordapp.com/avatars/691406006277898302/3140ce19301b14d4e40b6d57f505ba39.png?size=1024
    //       </h5>
    //       <h5 class="text-gray-400 truncate text-xs font-bold mt-3" id="time-header">4 Months ago</h5>
    //     </div>
    //   </li>
    
    var node = document.createElement("li");
    node.classList = "flex w-full justify-between text-gray-300 cursor-pointer items-center";
    var div_node = document.createElement("div");
    div_node.classList = "w-full border-t border-b border-gray-300 py-3 px-2";

    // create the appropriate header info
    var method_header = document.createElement("h3");
    method_header.classList = "text-white bg-blue-500 text-xs font-bold py-1 px-2 rounded-md w-1/5 text-center";
    var url_header = document.createElement("h5");
    url_header.classList = "text-gray-400 truncate text-xs font-bold mt-3";
    var time_header = document.createElement("h5");
    time_header.classList = "text-gray-400 truncate text-xs font-bold mt-3";

    method_header.innerText = method;
    url_header.innerText = url;
    time_header.innerText = time;

    div_node.appendChild(method_header);
    div_node.appendChild(url_header);
    div_node.appendChild(time_header);

    node.appendChild(div_node);
    return node
}

function loadHistory() {
    var history_sidebar = document.getElementById("history-sidebar");
    var mobile_history_sidebar = document.getElementById("mobile-history-sidebar");

    // clear the old history if any
    history_sidebar.replaceChildren([]);
    mobile_history_sidebar.replaceChildren([]);

    path.appDir().then(path => {
        console.log(history_sidebar, mobile_history_sidebar);
        
        const data = {
            appDir: path,
            name: "history.json"
        };

        invoke("read_history", data).then(history => {
            console.log(history);
            for (let index = 0; index < history.length; index++) {
                const entry = history[index];

                var parsed_time = new Date(entry.time);

                const node = createHistoryEntryNode(entry.method, entry.url, parsed_time.toUTCString());
                history_sidebar.appendChild(node);
                mobile_history_sidebar.appendChild(node.cloneNode());
            }
        })
    })
};


loadHistory();