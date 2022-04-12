const query_builder_grid = document.getElementById("query-builder-grid");
const query_name_list = document.getElementById("query-name-list");
const query_value_list = document.getElementById("query-value-list");

const header_name_list = document.getElementById("header-name-list");
const header_value_list = document.getElementById("header-value-list");

const add_query_pair_button = document.getElementById("add-query-pair-btn");
const add_header_pair_button = document.getElementById("add-header-pair-btn");

add_query_pair_button.onclick = function() {
    var html = document.createElement("input");
    html.type = "text";
    html.classList = "border-b border-gray-400 bg-transparent focus:outline-none text-gray-400 text-sm";

    var html2 = html.cloneNode(); // we need this because its its own element
    // not cloning the node, will cause it to shift parents

    query_name_list.appendChild(html);
    query_value_list.appendChild(html2);
}

add_header_pair_button.onclick = function() {
    var html = document.createElement("input");
    html.type = "text";
    html.classList = "border-b border-gray-400 bg-transparent focus:outline-none text-gray-400 text-sm";

    var html2 = html.cloneNode(); // we need this because its its own element
    // not cloning the node, will cause it to shift parents

    header_name_list.appendChild(html);
    header_value_list.appendChild(html2);
}